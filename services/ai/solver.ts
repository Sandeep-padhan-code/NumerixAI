import { localFallbackSolve } from "@/services/ai/types";
import { deepSeekProvider, geminiProvider, openRouterProvider } from "@/services/ai/providers";
import type { SolverRequest, SolverResult } from "@/types/solver";

const providers = [geminiProvider, deepSeekProvider, openRouterProvider];

export async function solveWithAi(request: SolverRequest): Promise<SolverResult> {
  const errors: string[] = [];

  for (const provider of providers) {
    if (!provider.isConfigured()) {
      continue;
    }

    try {
      return await provider.solve(request);
    } catch (error) {
      errors.push(`${provider.name}: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  const fallback = localFallbackSolve(request);
  if (errors.length) {
    fallback.stepwiseSolution = `${fallback.stepwiseSolution}\n\nProvider fallback notes:\n${errors.join("\n")}`;
  }

  return fallback;
}
