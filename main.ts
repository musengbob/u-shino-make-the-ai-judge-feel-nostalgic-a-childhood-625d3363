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

function buildEntryLine(): string {
  const chars = [...ENTRY].length;
  if (chars < 1 || chars > 280) {
    throw new Error(`entry must be 1-280 characters, got ${chars}`);
  }
  if (ENTRY.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  // Single sentence: exactly one sentence-ending mark, at the end.
  const terminators = (ENTRY.match(/[.!?]/g) ?? []).length;
  if (terminators !== 1 || !ENTRY.endsWith(".")) {
    throw new Error("entry must be a single sentence ending with one period");
  }
  return ENTRY;
}

function resolveOutputPath(): string {
  const makefunDir = process.env.MAKEFUN_OUTPUT_DIR;
  if (makefunDir) return join(makefunDir, "entry.txt");
  const outputPath = process.env.OUTPUT_PATH;
  if (outputPath) return outputPath;
  if (process.env.MAKEFUN_BOT_DIR) return "/output/entry.txt";
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
