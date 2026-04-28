import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

const url = process.env.DATABASE_URL || "file:./prisma/dev.db";
const filePath = url.replace(/^file:/, "");
const absolutePath = path.resolve(process.cwd(), filePath);

fs.mkdirSync(path.dirname(absolutePath), { recursive: true });

const db = new Database(absolutePath);

db.exec(`
CREATE TABLE IF NOT EXISTS "AppSetting" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "key" TEXT NOT NULL UNIQUE,
  "value" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "SolveHistory" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "question" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "mode" TEXT NOT NULL,
  "provider" TEXT,
  "givenData" TEXT NOT NULL,
  "requiredToFind" TEXT NOT NULL,
  "formulaUsed" TEXT NOT NULL,
  "stepwiseSolution" TEXT NOT NULL,
  "finalAnswer" TEXT NOT NULL,
  "shortcutMethod" TEXT NOT NULL,
  "practiceProblem" TEXT NOT NULL,
  "bookmarked" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "FormulaItem" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "formula" TEXT NOT NULL,
  "notes" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "RevisionNote" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "pinned" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "PracticeAttempt" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "subject" TEXT NOT NULL,
  "prompt" TEXT NOT NULL,
  "answer" TEXT,
  "correct" BOOLEAN,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`);

db.close();

console.log(`Initialized SQLite database at ${absolutePath}`);
