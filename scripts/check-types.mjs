// Fails the build when a published type declaration does not resolve:
// every `types` path in package.json must exist, and every relative import
// in dist/types/**/*.d.ts must point to an emitted declaration.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const root = resolve(dirname(new URL(import.meta.url).pathname), "..");
const typesDir = join(root, "dist/types");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const errors = [];

const typePaths = [pkg.types];
for (const entry of Object.values(pkg.exports ?? {})) {
  if (entry && typeof entry === "object" && entry.types) typePaths.push(entry.types);
}
for (const p of typePaths.filter(Boolean)) {
  if (!existsSync(join(root, p))) errors.push(`package.json: ${p}`);
}

const declarations = existsSync(typesDir)
  ? readdirSync(typesDir, { recursive: true })
      .filter((f) => f.endsWith(".d.ts"))
      .map((f) => join(typesDir, f))
  : [];
if (declarations.length === 0) {
  console.error("dist/types: no declarations found");
  process.exit(1);
}

const specifier = /(?:from\s+|import\()\s*["'](\.{1,2}\/[^"']+)["']/g;
// `./AareGuru.vue` resolves to `AareGuru.vue.d.ts`, so `${p}.d.ts` covers it.
const resolves = (p) => existsSync(`${p}.d.ts`) || existsSync(join(p, "index.d.ts"));

for (const file of declarations) {
  for (const [, spec] of readFileSync(file, "utf8").matchAll(specifier)) {
    if (!resolves(resolve(dirname(file), spec))) {
      errors.push(`${file.slice(root.length + 1)}: ${spec}`);
    }
  }
}

if (errors.length > 0) {
  for (const e of errors) console.error(e);
  process.exit(1);
}
