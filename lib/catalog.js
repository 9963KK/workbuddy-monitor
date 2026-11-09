// WorkBuddy 直连供应商模型目录（/v2 chat completions 系列）。
// 数值仅作模型元数据（contextWindow/maxTokens）；能力以 /v2 实际为准。
//
// 能力说明（已对 copilot.tencent.com /v2/chat/completions 实测）：
// - 全部模型都接受 OpenAI 多模态 image_url（data URL）输入 → inputModalities 含 image。
// - 推理强度通过 reasoning_effort 传递，实测 low / medium / high / max 均被接受；
//   "off" 会被 deepseek-v4.1-flash 直接 400 拒绝，故不提供 off。
export const REASONING_EFFORTS = [
  { id: 'low', name: 'Low', description: '更快、更省，适合简单任务。' },
  { id: 'medium', name: 'Medium', description: '均衡的思考深度，默认值。' },
  { id: 'high', name: 'High', description: '更深入的推理，适合复杂任务。' },
  { id: 'max', name: 'Max', description: '最大推理深度，最慢也最贵。' },
]
export const DEFAULT_REASONING_EFFORT = 'medium'

const IMAGE = ['text', 'image']

export const MODELS = [
  { id: 'deepseek-v4.1-flash', name: 'DeepSeek-V4.1-Flash', contextWindow: 1000000, maxTokens: 128000, reasoning: true, inputModalities: IMAGE },
  { id: 'deepseek-v4-pro', name: 'DeepSeek-V4-Pro', contextWindow: 1000000, maxTokens: 128000, reasoning: true, inputModalities: IMAGE },
  { id: 'glm-5.3', name: 'GLM-5.3', contextWindow: 1000000, maxTokens: 64000, reasoning: true, inputModalities: IMAGE },
  { id: 'glm-5.3-flash', name: 'GLM-5.3-Flash', contextWindow: 1000000, maxTokens: 64000, reasoning: true, inputModalities: IMAGE },
  { id: 'glm-5.2', name: 'GLM-5.2', contextWindow: 1000000, maxTokens: 64000, reasoning: true, inputModalities: IMAGE },
  { id: 'kimi-k3.1-pro', name: 'Kimi-K3.1-Pro', contextWindow: 1000000, maxTokens: 64000, inputModalities: IMAGE },
  { id: 'kimi-k3', name: 'Kimi-K3', contextWindow: 1000000, maxTokens: 64000, inputModalities: IMAGE },
  { id: 'kimi-k2.8-preview', name: 'Kimi-K2.8-Preview', contextWindow: 1000000, maxTokens: 64000, inputModalities: IMAGE },
  { id: 'kimi-k2.6', name: 'Kimi-K2.6', contextWindow: 1000000, maxTokens: 64000, inputModalities: IMAGE },
  { id: 'minimax-m3.1-flash', name: 'MiniMax-M3.1-Flash', contextWindow: 1000000, maxTokens: 64000, inputModalities: IMAGE },
  { id: 'mimo-v2.6-pro', name: 'MiMo-V2.6-Pro', contextWindow: 1000000, maxTokens: 64000, inputModalities: IMAGE },
  { id: 'space-bunny', name: 'Space-Bunny', contextWindow: 1000000, maxTokens: 64000, inputModalities: IMAGE },
  { id: 'step-5-preview', name: 'Step-5-Preview', contextWindow: 1000000, maxTokens: 64000, inputModalities: IMAGE },
  { id: 'hy3', name: 'Hy3', contextWindow: 192000, maxTokens: 48000, inputModalities: IMAGE },
  { id: 'hy3-x', name: 'Hy3 (X)', contextWindow: 192000, maxTokens: 48000, inputModalities: IMAGE },
  { id: 'hy4free', name: 'Hy4', contextWindow: 960000, maxTokens: 64000, inputModalities: IMAGE },
  { id: 'hy4std', name: 'Hy4 (hy4std)', contextWindow: 960000, maxTokens: 64000, inputModalities: IMAGE },
]

export function catalogEntry(id) {
  const bare = String(id || '').replace(/^workbuddy\//, '')
  return MODELS.find((m) => m.id === bare)
}

/** 某模型允许的推理强度列表；非推理模型返回 []。 */
export function reasoningEfforts(id, override) {
  const m = catalogEntry(id) || {}
  const reasoning = override?.reasoning ?? m.reasoning
  return reasoning ? REASONING_EFFORTS.map((e) => ({ ...e })) : []
}

export function resolveModelMetadata(provider, model, override, fallback) {
  const m = catalogEntry(model) || {}
  const contextWindow = override?.contextWindow || m.contextWindow || fallback.contextWindow
  // 显式声明的模态优先；否则用目录里的能力；兜底 text。
  const modalities = (override?.inputModalities || m.inputModalities || ['text']).slice()
  const efforts = reasoningEfforts(model, override)
  return {
    provider,
    id: model,
    name: override?.name || m.name || model,
    inputModalities: modalities,
    context: { contextWindow },
    defaultMaxTokens: override?.maxTokens || m.maxTokens || fallback.maxTokens,
    // DSH 要求 efforts 非空，空数组会抛 INVALID_MODEL_REASONING；非推理模型就不带 reasoning。
    ...(efforts.length ? { reasoning: { efforts, defaultEffort: DEFAULT_REASONING_EFFORT } } : {}),
  }
}
