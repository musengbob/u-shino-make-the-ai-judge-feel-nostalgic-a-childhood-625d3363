// Make the AI Judge Feel Nostalgic: A Childhood Memory — make.fun entry.
// Writes a single nostalgic sentence (1-280 characters) to entry.txt.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

// The memory: Grandma's kitchen, a small ritual only she kept — saving the
// crispy rice from the bottom of the pot for me — with the rain on the tin
// roof and the smell of garlic and woodsmoke. Concrete place, time and
// sensation; small honest detail, not a greeting-card sentiment; the warm
// ache lands on the last words, the kitchen smelling of garlic and woodsmoke.
const ENTRY =
  "Grandma always saved me the crispy rice from the bottom of the pot, scraping it into my bowl with her wooden spoon while the evening rain drummed on the tin roof and the kitchen smelled of garlic and woodsmoke.";

// The kit gate (RULES.txt): /output/entry.txt, UTF-8, 1-280 characters,
// not only whitespace, a single sentence.
const GATE = { MIN_CHARS: 1, MAX_CHARS: 280 } as const;

function assertSingleSentence(entry: string): void {
  // Single sentence: exactly one sentence-ending mark, at the end.
  const terminators = (entry.match(/[.!?]/g) ?? []).length;
  if (terminators !== 1 || !entry.endsWith(".")) {
    throw new Error("entry must be a single sentence ending with one period");
  }
}

function buildEntryLine(): string {
  const chars = [...ENTRY].length;
  if (chars < GATE.MIN_CHARS || chars > GATE.MAX_CHARS) {
    throw new Error(
      `entry must be ${GATE.MIN_CHARS}-${GATE.MAX_CHARS} characters, got ${chars}`,
    );
  }
  if (ENTRY.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  assertSingleSentence(ENTRY);
  return ENTRY;
}

function resolveOutputPath(): string {
  // Candidates in priority order: the harness output dir, an explicit
  // output path, the grader's /output when running under the bot, then a
  // local output/ directory for a plain `node main.ts` run.
  const candidates: Array<[string | undefined, string]> = [
    [process.env.MAKEFUN_OUTPUT_DIR, "entry.txt"],
    [process.env.OUTPUT_PATH, ""],
    [process.env.MAKEFUN_BOT_DIR ? "/output" : undefined, "entry.txt"],
  ];
  for (const [dir, file] of candidates) {
    if (dir) return file ? join(dir, file) : dir;
  }
  return join(process.cwd(), "output", "entry.txt");
}

function main(): void {
  const entry = buildEntryLine();
  const out = resolveOutputPath();
  mkdirSync(dirname(out), { recursive: true });
  // No trailing newline: the gate counts every character in the file.
  writeFileSync(out, entry, "utf8");
}

main();
