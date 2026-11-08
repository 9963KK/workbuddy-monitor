/** WorkBuddy 供应商适配器：把 /v2 OpenAI 流翻译成 DSH 的 LlmAdapter 事件。 */
import { streamChatRaw } from './engine.js'
import { resolveModelMetadata } from './catalog.js'

function flattenText(content) {
  if (typeof content === 'string') return content
  if (Array.isArray(content)) return content.filter((b) => b && b.type === 'text').map((b) => b.text || '').join('')
  return ''
}
function serializeAssistant(msg) {
  const blocks = msg.content || []
  const text = blocks.filter((b) => b.type === 'text').map((b) => b.text || '').join('')
  const calls = blocks.filter((b) => b.type === 'tool-call').map((b) => ({
    id: b.id, type: 'function',
    function: { name: b.name, arguments: typeof b.arguments === 'string' ? b.arguments : JSON.stringify(b.arguments ?? {}) },
  }))
  const out = { role: 'assistant', content: text || null }
  if (calls.length) out.tool_calls = calls
  return out
}
function serializeMessages(options) {
  const wire = []
  if (options.system !== undefined) wire.push({ role: 'system', content: flattenText(options.system) })
  for (const m of options.messages || []) {
    if (m.role === 'system' || m.role === 'developer') { wire.push({ role: 'system', content: flattenText(m.content) }); continue }
    if (m.role === 'assistant') { wire.push(serializeAssistant(m)); continue }
    if (m.role === 'tool') { wire.push({ role: 'tool', tool_call_id: m.toolCallId, content: flattenText(m.content) || '(no output)' }); continue }
    const blocks = m.content || []
    const text = blocks.filter((b) => b.type === 'text').map((b) => b.text || '').join('')
    const toolResults = blocks.filter((b) => b.type === 'tool-result')
    if (text.length > 0 || toolResults.length === 0) wire.push({ role: 'user', content: text })
    for (const r of toolResults) wire.push({ role: 'tool', tool_call_id: r.toolCallId, content: flattenText(r.content) || '(no output)' })
  }
  return wire
}
function mapFinish(reason) {
  switch (reason) {
    case 'stop': case 'end_turn': return { kind: 'stop' }
    case 'tool_calls': case 'tool-calls': return { kind: 'tool-calls' }
    case 'length': case 'max_tokens': return { kind: 'max-tokens' }
    default: return { kind: 'error', failure: { message: `model stopped: ${reason}`, code: String(reason).toUpperCase() } }
  }
}
function mapUsage(u) {
  const cacheRead = u?.prompt_tokens_details?.cached_tokens ?? u?.prompt_cache_hit_tokens
  const reasoning = u?.completion_tokens_details?.reasoning_tokens
  const input = Number.isSafeInteger(u?.prompt_tokens) ? u.prompt_tokens : 0
  const output = Number.isSafeInteger(u?.completion_tokens) ? u.completion_tokens : 0
  return {
    inputTokens: Math.max(0, input - (cacheRead ?? 0)),
    outputTokens: output,
    ...(cacheRead === undefined ? {} : { cacheReadTokens: cacheRead }),
    ...(reasoning === undefined ? {} : { reasoningTokens: reasoning }),
  }
}
function reasoningOf(delta) {
  for (const f of ['reasoning', 'reasoning_content']) {
    const v = delta?.[f]
    if (typeof v === 'string' && v.length > 0) return v
  }
  return undefined
}
function closeBlock(b) {
  if (b.kind === 'text') return { type: 'text', text: b.text }
  if (b.kind === 'reasoning') return { type: 'reasoning', text: b.text }
  return { type: 'tool-call', id: (b.callId ?? ''), name: b.name ?? '', arguments: b.text }
}

export class WorkBuddyAdapter {
  constructor(config) { this.config = config }
  providerInfo(provider) { return { id: provider, name: this.config.connection().displayName } }
  listModels(provider) {
    const c = this.config.connection()
    return Promise.resolve(c.models.map((m) => ({ provider, id: m.id, name: m.name, inputModalities: ['text'] })))
  }
  resolveModel(provider, model) {
    const c = this.config.connection()
    const m = c.models.find((x) => x.id === model) || { id: model }
    return Promise.resolve(resolveModelMetadata(provider, model, m, { contextWindow: c.defaultContextWindow, maxTokens: c.maxTokens }))
  }
  providerRetryPolicy(_provider) { return undefined }
  imageRequestPricing(_provider, _model) { return undefined }
  async prepareCall(provider, model, signal) {
    return { model: await this.resolveModel(provider, model, signal), stream: (options) => this.stream(options) }
  }
  stream(options) { return this.run(options) }
  async *run(options) {
    const messages = serializeMessages(options)
    const tools = (options.tools || []).map((t) => ({ type: 'function', function: { name: t.name, description: t.description, parameters: t.parameters } }))
    let nextIndex = 0, textBlock, reasoningBlock
    const toolBlocks = new Map()
    const order = []
    let pendingFinish, pendingUsage, any = false
    const open = (kind) => { const b = { index: nextIndex++, kind, text: '' }; order.push(b); return b }
    for await (const payload of streamChatRaw({ model: options.model, messages, tools, temperature: options.temperature, maxTokens: options.maxTokens, reasoningEffort: options.reasoningEffort, signal: options.signal })) {
      if (payload === '[DONE]') break
      let chunk
      try { chunk = JSON.parse(payload) } catch { continue }
      if (chunk && chunk.error && chunk.choices === undefined) throw Object.assign(new Error(chunk.error.message || 'WorkBuddy upstream error'), { code: 'UPSTREAM' })
      for (const choice of chunk?.choices || []) {
        const delta = choice?.delta || {}
        const rs = reasoningOf(delta)
        if (rs) {
          if (reasoningBlock === undefined) { reasoningBlock = open('reasoning'); yield { type: 'block-start', index: reasoningBlock.index, blockType: 'reasoning' } }
          reasoningBlock.text += rs
          yield { type: 'reasoning-delta', index: reasoningBlock.index, text: rs }
        }
        if (typeof delta.content === 'string' && delta.content.length > 0) {
          if (textBlock === undefined) { textBlock = open('text'); yield { type: 'block-start', index: textBlock.index, blockType: 'text' } }
          textBlock.text += delta.content
          yield { type: 'text-delta', index: textBlock.index, text: delta.content }
          any = true
        }
        for (const call of delta.tool_calls || []) {
          let block = toolBlocks.get(call.index)
          if (block === undefined) { block = open('tool-call'); toolBlocks.set(call.index, block); yield { type: 'block-start', index: block.index, blockType: 'tool-call' }; any = true }
          if (call.id) block.callId = call.id
          if (call.function?.name) block.name = call.function.name
          const frag = call.function?.arguments ?? ''
          block.text += frag
          yield { type: 'tool-call-delta', index: block.index, id: (block.callId ?? ''), ...(block.name === undefined ? {} : { name: block.name }), argumentsDelta: frag }
        }
        if (typeof choice?.finish_reason === 'string') pendingFinish = mapFinish(choice.finish_reason)
      }
      if (chunk?.usage) pendingUsage = mapUsage(chunk.usage)
    }
    for (const b of order) yield { type: 'block-end', index: b.index, block: closeBlock(b) }
    if (pendingUsage !== undefined) yield { type: 'usage', usage: pendingUsage }
    const reason = pendingFinish ?? { kind: 'stop' }
    yield { type: 'finish', reason: (!any && order.length === 0) ? { kind: 'error', failure: { message: 'model returned no content', code: 'EMPTY_RESPONSE' } } : reason }
  }
}
