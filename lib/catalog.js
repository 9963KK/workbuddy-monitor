// WorkBuddy 直连供应商模型目录（/v2 chat completions 系列）。
// 数值仅作模型元数据（contextWindow/maxTokens）；能力以 /v2 实际为准。
export const MODELS = [
  { id: 'deepseek-v4.1-flash', name: 'DeepSeek-V4.1-Flash', contextWindow: 1000000, maxTokens: 128000, reasoning: true },
  { id: 'deepseek-v4-pro', name: 'DeepSeek-V4-Pro', contextWindow: 1000000, maxTokens: 128000, reasoning: true },
  { id: 'glm-5.3', name: 'GLM-5.3', contextWindow: 1000000, maxTokens: 64000, reasoning: true },
  { id: 'glm-5.3-flash', name: 'GLM-5.3-Flash', contextWindow: 1000000, maxTokens: 64000, reasoning: true },
  { id: 'glm-5.2', name: 'GLM-5.2', contextWindow: 1000000, maxTokens: 64000, reasoning: true },
  { id: 'kimi-k3.1-pro', name: 'Kimi-K3.1-Pro', contextWindow: 1000000, maxTokens: 64000 },
  { id: 'kimi-k3', name: 'Kimi-K3', contextWindow: 1000000, maxTokens: 64000 },
  { id: 'kimi-k2.8-preview', name: 'Kimi-K2.8-Preview', contextWindow: 1000000, maxTokens: 64000 },
  { id: 'kimi-k2.6', name: 'Kimi-K2.6', contextWindow: 1000000, maxTokens: 64000 },
  { id: 'minimax-m3.1-flash', name: 'MiniMax-M3.1-Flash', contextWindow: 1000000, maxTokens: 64000 },
  { id: 'mimo-v2.6-pro', name: 'MiMo-V2.6-Pro', contextWindow: 1000000, maxTokens: 64000 },
  { id: 'space-bunny', name: 'Space-Bunny', contextWindow: 1000000, maxTokens: 64000 },
  { id: 'step-5-preview', name: 'Step-5-Preview', contextWindow: 1000000, maxTokens: 64000 },
  { id: 'hy3', name: 'Hy3', contextWindow: 192000, maxTokens: 48000 },
  { id: 'hy3-x', name: 'Hy3 (X)', contextWindow: 192000, maxTokens: 48000 },
  { id: 'hy4free', name: 'Hy4', contextWindow: 960000, maxTokens: 64000 },
  { id: 'hy4std', name: 'Hy4 (hy4std)', contextWindow: 960000, maxTokens: 64000 },
]

export function catalogEntry(id) {
  return MODELS.find((m) => m.id === id)
}

export function resolveModelMetadata(provider, model, override, fallback) {
  const m = catalogEntry(model) || {}
  const contextWindow = override?.contextWindow || m.contextWindow || fallback.contextWindow
  return {
    provider,
    id: model,
    name: override?.name || m.name || model,
    inputModalities: ['text'],
    context: { contextWindow },
    defaultMaxTokens: override?.maxTokens || m.maxTokens || fallback.maxTokens,
    ...(m.reasoning || override?.reasoning ? { reasoning: { efforts: [] } } : {}),
  }
}
