/**
 * LLM Service — OpenAI-compatible API client.
 * Works with Ollama, vLLM, LM Studio, or any OpenAI-compatible endpoint.
 * Configure via env: LLM_BASE_URL, LLM_MODEL, LLM_API_KEY
 */

export interface LlmMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LlmCompletionOptions {
  messages: LlmMessage[];
  maxTokens?: number;
  temperature?: number;
}

export interface LlmResponse {
  content: string;
  model: string;
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
}

const LLM_BASE_URL = process.env.LLM_BASE_URL || "http://localhost:11434/v1";
const LLM_MODEL = process.env.LLM_MODEL || "llama3";
const LLM_API_KEY = process.env.LLM_API_KEY || "not-needed";

export async function chatCompletion(options: LlmCompletionOptions): Promise<LlmResponse> {
  const { messages, maxTokens = 1000, temperature = 0.7 } = options;

  const response = await fetch(`${LLM_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LLM_API_KEY}`,
    },
    body: JSON.stringify({
      model: LLM_MODEL,
      messages,
      max_tokens: maxTokens,
      temperature,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`LLM API error ${response.status}: ${errText}`);
  }

  const result = await response.json();
  const content = result.choices?.[0]?.message?.content || "";

  return {
    content,
    model: result.model || LLM_MODEL,
    usage: result.usage,
  };
}

export async function generateContent(params: {
  contentType: string;
  prompt: string;
  tone?: string;
  audience?: string;
  wordCount?: number;
  creativity?: number;
}): Promise<LlmResponse> {
  const { contentType, prompt, tone, audience, wordCount, creativity } = params;

  const systemPrompt = `You are a creative content assistant for a creator community platform. Generate ${contentType} content.
Tone: ${tone || "Professional"}
Target audience: ${audience || "General"}
Approximate word count: ${wordCount || 150}
Only output the generated content, no explanations or prefixes.`;

  return chatCompletion({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    maxTokens: Math.min((wordCount || 150) * 2, 2000),
    temperature: creativity ? creativity / 100 : 0.7,
  });
}

export async function translateText(text: string, targetLanguage: string): Promise<string> {
  const result = await chatCompletion({
    messages: [
      {
        role: "system",
        content: `You are a precise translator. Translate the following text to ${targetLanguage}. Output ONLY the translation, nothing else.`,
      },
      { role: "user", content: text },
    ],
    maxTokens: Math.max(text.length * 2, 500),
    temperature: 0.3,
  });

  return result.content;
}
