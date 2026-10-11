import env from '#start/env'

export interface TokenUsage {
  input: number
  output: number
}

export class AiClientError extends Error {
  constructor(
    message: string,
    public readonly retriable: boolean = false
  ) {
    super(message)
    this.name = 'AiClientError'
  }
}

async function postJson(
  url: string,
  apiKey: string,
  body: unknown,
  timeoutMs = 120_000
): Promise<any> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    if (!response.ok) {
      const responseText = await response.text()
      const text = responseText.slice(0, 500)
      const retriable = response.status === 429 || response.status >= 500
      throw new AiClientError(`HTTP ${response.status}: ${text}`, retriable)
    }
    return await response.json()
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new AiClientError('AI request timed out', true)
    }
    throw error
  } finally {
    clearTimeout(timer)
  }
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * DeepSeek chat completion with JSON response format.
 * DeepSeek exposes an OpenAI-compatible /chat/completions API.
 */
export async function deepseekChatJson(options: {
  system: string
  user: string
  model?: string
  maxRetries?: number
}): Promise<{ data: unknown; usage: TokenUsage; model: string }> {
  const apiKey = env.get('DEEPSEEK_API_KEY')
  if (!apiKey) {
    throw new AiClientError('DEEPSEEK_API_KEY is not configured')
  }
  const baseUrl = env.get('DEEPSEEK_BASE_URL') ?? 'https://api.deepseek.com'
  const model = options.model ?? env.get('DEEPSEEK_MODEL') ?? 'deepseek-chat'
  const maxRetries = options.maxRetries ?? 3

  let lastError: unknown
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const json = await postJson(`${baseUrl}/chat/completions`, apiKey, {
        model,
        response_format: { type: 'json_object' },
        temperature: 0.7,
        messages: [
          { role: 'system', content: options.system },
          { role: 'user', content: options.user },
        ],
      })

      const content = json.choices?.[0]?.message?.content
      if (typeof content !== 'string' || !content.trim()) {
        throw new AiClientError('DeepSeek returned an empty completion')
      }

      let data: unknown
      try {
        data = JSON.parse(content)
      } catch {
        throw new AiClientError(`DeepSeek returned invalid JSON: ${content.slice(0, 200)}`)
      }

      return {
        data,
        usage: {
          input: json.usage?.prompt_tokens ?? 0,
          output: json.usage?.completion_tokens ?? 0,
        },
        model,
      }
    } catch (error) {
      lastError = error
      if (!(error instanceof AiClientError && error.retriable)) {
        throw error
      }
      const backoff = Math.min(1000 * 2 ** attempt, 30_000)
      await sleep(backoff + Math.random() * 500)
    }
  }
  throw lastError
}

export type JevQuestion =
  | { type: 'choice'; instructions: string; criteria: Record<string, string> }
  | { type: 'score'; instructions: string; criteria: string[] }
  | { type: 'noul'; instructions: string }

export interface JevAnswer {
  type: 'choice' | 'score' | 'noul'
  choice?: string
  score?: number
  noul?: number
  confidence?: number
  probabilities?: Record<string, number>
}

/**
 * TypeSafe Jev: evaluate typed questions (choice/score/noul) against a state.
 * Used for dedupe decisions, language matching and quality gating — not for text generation.
 */
export async function jevEvaluate(
  state: string,
  questions: Record<string, JevQuestion>
): Promise<{ answers: Record<string, JevAnswer>; usage: TokenUsage }> {
  const apiKey = env.get('TYPESAFE_API_KEY')
  if (!apiKey) {
    throw new AiClientError('TYPESAFE_API_KEY is not configured')
  }
  const baseUrl = env.get('TYPESAFE_BASE_URL') ?? 'https://api.typesafe.ai'
  const model = env.get('TYPESAFE_MODEL') ?? 'jev-latest'

  const json = await postJson(`${baseUrl}/v1/systemone`, apiKey, {
    state,
    model,
    questions,
  })

  return {
    answers: json.answers ?? {},
    usage: {
      input: json.usage?.input_tokens ?? 0,
      output: json.usage?.output_tokens ?? 0,
    },
  }
}
