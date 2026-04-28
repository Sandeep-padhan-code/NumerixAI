export const subjects = [
  "Engineering Mathematics",
  "GATE Mathematics",
  "IIT Mathematics",
  "Calculus",
  "Differential Equations",
  "Laplace Transform",
  "Fourier Series",
  "Linear Algebra",
  "Complex Analysis",
  "Probability",
  "Numerical Methods",
  "Mechanics Basics",
  "Electrical Numericals"
] as const;

export type Subject = (typeof subjects)[number];

export const examModes = ["GATE", "IIT", "Beginner", "Assignment"] as const;

export type ExamMode = (typeof examModes)[number];

export type SolverRequest = {
  question: string;
  subject: Subject;
  mode: ExamMode;
  saveToHistory?: boolean;
};

export type SolverResult = {
  givenData: string;
  requiredToFind: string;
  formulaUsed: string;
  stepwiseSolution: string;
  finalAnswer: string;
  shortcutMethod: string;
  practiceProblem: string;
  provider?: string;
};

export type HistoryItem = SolverResult & {
  id: string;
  question: string;
  subject: Subject;
  mode: ExamMode;
  bookmarked: boolean;
  createdAt: string;
};

export type FormulaItem = {
  id: string;
  title: string;
  subject: Subject;
  formula: string;
  notes?: string | null;
  createdAt: string;
};

export type RevisionNote = {
  id: string;
  title: string;
  subject: Subject;
  content: string;
  pinned: boolean;
  createdAt: string;
};

export type PracticeProblem = {
  subject: Subject;
  prompt: string;
  answer?: string;
};
