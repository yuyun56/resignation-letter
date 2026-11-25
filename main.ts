// The Funniest One-Line Resignation Letter
// (make.fun u-deranalabs-the-funniest-one-line-resignation-letter-53c0d947)
//
// The entry is one resignation letter, written by something an agent runs —
// here, a retry loop that finally gives up — and it obeys a single hard
// constraint: exactly one line of 1 to 140 characters, nothing else.
//
// This guard program reads entry.txt from beside itself, checks the line
// against that constraint, prints the letter with its character count and
// the budget it leaves unused, and hands it in by writing it to the output
// directory's entry.txt (MAKEFUN_OUTPUT_DIR when set, otherwise /output).
// Any violation exits non-zero with a plain explanation, so a bad letter
// can never slip through.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_CHARS = 140;
const here = dirname(fileURLToPath(import.meta.url));

function fail(reason: string): never {
  console.error(`entry rejected: ${reason}`);
  process.exit(1);
}

const raw = readFileSync(join(here, "entry.txt"), "utf8");

// One trailing newline is the file's terminator, not part of the letter.
const line = raw.replace(/\r?\n$/, "");

if (line.includes("\n") || line.includes("\r")) {
  fail("the letter must be a single line, but entry.txt holds more than one");
}
const chars = [...line].length;
if (chars === 0) {
  fail("the letter is empty");
}
if (line.trim().length === 0) {
  fail("the letter is only white space");
}
if (chars > MAX_CHARS) {
  fail(`the letter is ${chars} characters, over the ${MAX_CHARS} character limit`);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), line, "utf8");

console.log(line);
console.log(`${chars} characters`);
console.log(`budget: ${MAX_CHARS - chars} of ${MAX_CHARS} characters left`);
