import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { solveWithAi } from "@/services/ai/solver";
import { cleanMathOcrInput } from "@/services/input-cleaning/math-ocr-cleaner";
import { examModes, subjects } from "@/types/solver";

const solveSchema = z.object({
  question: z.string().min(3),
  subject: z.enum(subjects),
  mode: z.enum(examModes),
  saveToHistory: z.boolean().optional()
});

export async function POST(request: Request) {
  const parsed = solveSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid solver request" }, { status: 400 });
  }

  const cleanedInput = cleanMathOcrInput(parsed.data.question);
  const requestForSolver = {
    ...parsed.data,
    question: cleanedInput.likelyCorrupted
      ? `Question text partially corrupted. Most probable corrected form assumed below.\n\n${cleanedInput.cleaned}`
      : cleanedInput.cleaned
  };

  const result = await solveWithAi(requestForSolver);

  let historyId: string | undefined;
  if (parsed.data.saveToHistory) {
    const record = await prisma.solveHistory.create({
      data: {
        question: requestForSolver.question,
        subject: parsed.data.subject,
        mode: parsed.data.mode,
        provider: result.provider,
        givenData: result.givenData,
        requiredToFind: result.requiredToFind,
        formulaUsed: result.formulaUsed,
        stepwiseSolution: result.stepwiseSolution,
        finalAnswer: result.finalAnswer,
        shortcutMethod: result.shortcutMethod,
        practiceProblem: result.practiceProblem
      }
    });
    historyId = record.id;
  }

  return NextResponse.json({ result, historyId });
}
