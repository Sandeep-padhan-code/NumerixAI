import { buildSolverPrompt, normalizeSolverResult, type AiProvider } from "@/services/ai/types";
import type { SolverRequest, SolverResult } from "@/types/solver";

async function fetchJsonWithTimeout(url: string, init: RequestInit, timeoutMs = 30000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Provider returned ${response.status}`);
    }

    return response.json();
  } finally {
    clearTimeout(timeout);
  }
}

function parseJsonText(text: string, provider: string): SolverResult {
  const cleaned = text.replace(/^```json/i, "").replace(/^```/i, "").replace(/```$/i, "").trim();
  return normalizeSolverResult(JSON.parse(cleaned), provider);
}

export const geminiProvider: AiProvider = {
  name: "Gemini",
  isConfigured: () => Boolean(process.env.GEMINI_API_KEY),
  async solve(request: SolverRequest) {
    const data = await fetchJsonWithTimeout(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: buildSolverPrompt(request.question, request.subject, request.mode) }] }],
          generationConfig: { responseMimeType: "application/json", temperature: 0.2 }
        })
      }
    );

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error("Gemini returned an empty response");
    }

    return parseJsonText(text, this.name);
  }
};

export const deepSeekProvider: AiProvider = {
  name: "DeepSeek",
  isConfigured: () => Boolean(process.env.DEEPSEEK_API_KEY),
  async solve(request: SolverRequest) {
    const data = await fetchJsonWithTimeout("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [{ role: "user", content: buildSolverPrompt(request.question, request.subject, request.mode) }]
      })
    });

    const text = data?.choices?.[0]?.message?.content;
    if (!text) {
      throw new Error("DeepSeek returned an empty response");
    }

    return parseJsonText(text, this.name);
  }
};

export const openRouterProvider: AiProvider = {
  name: "OpenRouter",
  isConfigured: () => Boolean(process.env.OPENROUTER_API_KEY),
  async solve(request: SolverRequest) {
    const data = await fetchJsonWithTimeout("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "NumerixAI"
      },
      body: JSON.stringify({
        model: "openrouter/free",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [{ role: "user", content: buildSolverPrompt(request.question, request.subject, request.mode) }]
      })
    });

    const text = data?.choices?.[0]?.message?.content;
    if (!text) {
      throw new Error("OpenRouter returned an empty response");
    }

    return parseJsonText(text, this.name);
  }
};
