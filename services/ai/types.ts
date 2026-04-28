import type { ExamMode, SolverRequest, SolverResult, Subject } from "@/types/solver";

export type AiProvider = {
  name: string;
  isConfigured(): boolean;
  solve(request: SolverRequest): Promise<SolverResult>;
};

export function buildSolverPrompt(question: string, subject: Subject, mode: ExamMode) {
  const modeRules: Record<ExamMode, string> = {
    GATE: "Prioritize fast exam tricks, compact reasoning, and direct formula selection.",
    IIT: "Use rigorous derivation, conceptual explanation, and polished mathematical notation.",
    Beginner: "Explain every transformation in simple language and avoid skipped algebra.",
    Assignment: "Show complete working suitable for handwritten submission."
  };

  return `You are NumerixAI, an elite Engineering Mathematics Solver specialized in university exams, assignments, GATE, IIT-level mathematics, and step-by-step structured solutions.
Subject: ${subject}
Mode: ${mode}
Mode behavior: ${modeRules[mode]}

Highest priorities:
1. Clean corrupted OCR or handwritten math text before solving.
2. Reconstruct intended mathematical notation when symbols are broken.
3. Solve one question at a time with clear numbering.
4. Avoid random OCR text and unreadable symbols.
5. Use readable LaTeX equations.

OCR reconstruction rules:
- § usually means contour integral, ∮, or ∫ depending on context.
- dz _ means dz.
- lz, lz|, lz] usually mean |z|.
- co: or c0: usually means C:.
- "a © |z|=1" usually means over contour C: |z|=1.
- If the text is too corrupted, briefly state: "Question text partially corrupted. Most probable corrected form assumed below."
- Choose the most probable university Engineering Mathematics form when context is clear.

Mandatory answer format inside stepwiseSolution:
--------------------------------------------------
Question 1
Cleaned Question:
[rewrite proper mathematical question]

Given:
[if needed]

Formula Used:
[relevant theorem/formula]

Solution:
Step 1:
Step 2:
Step 3:

Final Answer:
\\[
...
\\]
--------------------------------------------------

For theory questions use Statement, Proof, and Conclusion. For complex integrals, state whether Cauchy's theorem, Cauchy's integral formula, residue theorem, or direct parametrization applies and why. For Assignment mode, show full derivation and every important algebra step.
Important contour-integral correctness rule: if a pole lies exactly on the contour, do not treat it as inside. State that the usual contour integral is undefined unless a principal value or indentation convention is explicitly given.

Return only strict JSON with these exact keys:
givenData, requiredToFind, formulaUsed, stepwiseSolution, finalAnswer, shortcutMethod, practiceProblem.
Use KaTeX-compatible inline math with $...$ and display math with $$...$$ where helpful.
The stepwiseSolution value must contain the full professional solved format above. Do not repeat corrupted OCR junk.

Cleaned or raw problem text:
${question}`;
}

export function normalizeSolverResult(value: unknown, provider: string): SolverResult {
  const data = value as Partial<SolverResult>;

  return {
    givenData: String(data.givenData || "The important values and conditions are identified from the question."),
    requiredToFind: String(data.requiredToFind || "Find the requested mathematical quantity."),
    formulaUsed: String(data.formulaUsed || "Use the standard formula for the selected topic."),
    stepwiseSolution: String(data.stepwiseSolution || "Work through the expression step by step."),
    finalAnswer: String(data.finalAnswer || "Final answer could not be isolated from the provider response."),
    shortcutMethod: String(data.shortcutMethod || "Use the direct exam formula once the pattern is recognized."),
    practiceProblem: String(data.practiceProblem || "Try a similar problem with slightly changed values."),
    provider
  };
}

export function localFallbackSolve(request: SolverRequest): SolverResult {
  return {
    givenData: `Cleaned/received question: ${request.question}\nSubject: ${request.subject}\nMode: ${request.mode}`,
    requiredToFind: "Identify the unknown requested in the problem statement and solve it from the available data.",
    formulaUsed:
      "No API key is configured yet. Add GEMINI_API_KEY, DEEPSEEK_API_KEY, or OPENROUTER_API_KEY to .env.local for full AI solving.",
    stepwiseSolution:
      `--------------------------------------------------
Question 1
Cleaned Question:
${request.question}

Given:
Subject: ${request.subject}
Mode: ${request.mode}

Formula Used:
Provider keys are required for complete AI-generated theorem/formula selection.

Solution:
Step 1:
Classify the topic from the cleaned question.

Step 2:
Write the known values and identify the required result.

Step 3:
Choose the relevant theorem or standard formula, then substitute carefully.

Final Answer:
\\[
\\text{Configure a valid AI provider key to generate the complete solved answer.}
\\]
--------------------------------------------------`,
    finalAnswer: "Configure an AI provider key to generate the complete numerical final answer.",
    shortcutMethod: "For exams, first match the problem to a standard result, then substitute directly.",
    practiceProblem: `Create one similar ${request.subject} problem by changing the constants and solving with the same method.`,
    provider: "local fallback"
  };
}
