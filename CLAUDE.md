# CLAUDE.md — Terbilang

Indonesian number-to-words engine, bidirectional. A zero-dependency npm library plus a static site that demonstrates it and surveys where existing implementations break. GitHub Pages, no backend.

Read `PRD.md` before starting any task. It fixes scope; this file describes how to work in the repo.

**Three things shape everything:**

1. **This is a library first.** The site imports it, not the other way round. Nothing in `lib/` may know that a browser exists.
2. **`BigInt`, never `number`.** JavaScript loses integer precision above 2⁵³ ≈ 9×10¹⁵ — just past *kuadriliun*. A `number` implementation is correct through *triliun* and silently wrong immediately after, which means it passes casual testing and corrupts a real invoice.
3. **Exhaustive testing is the point.** The domain is bounded and the function is pure, so it can be verified *completely* for the first million values. That rigour is the reason this small project is worth building.

**Downstream:** Rinci depends on this for payslips. Keep the API stable and the package clean.

---

## Stack

- TypeScript, `strict: true`
- **Zero runtime dependencies in `lib/`.** Not one.
- tsup (or equivalent) for dual ESM/CJS build with types
- Next.js 14, App Router, `output: 'export'` for the site only
- Tailwind CSS for the site only
- Vitest
- pnpm

## Commands

```bash
pnpm build:lib              # dual ESM/CJS + .d.ts
pnpm build                  # site static export to ./out
pnpm dev                    # site dev server
pnpm preview                # serve ./out under the production basePath
pnpm test                   # vitest watch
pnpm test:run               # vitest once — before every commit
pnpm test:exhaustive        # full 0..1,000,000 round-trip + structural sweep
pnpm test:bigint            # boundary behaviour above 2^53
pnpm survey:record          # DEV ONLY — runs other packages to regenerate survey data
pnpm typecheck
pnpm lint
```

`pnpm test:exhaustive` gates every commit touching `lib/`. It runs in seconds; there is no excuse to skip it.

`pnpm survey:record` installs and executes third-party packages. Development only — never in CI, never in the shipped bundle.

## Layout

```
lib/                        # THE PACKAGE. Pure. Zero deps. No DOM, no React, no clock.
  index.ts                  # public API surface — keep it small
  format.ts                 # BigInt → words
  parse.ts                  # words → BigInt
  groups.ts                 # three-digit decomposition
  words.ts                  # lexicon: units, teens, scales
  options.ts                # variant handling + defaults
  errors.ts                 # structured refusals
  types.ts
app/                        # the site
  [locale]/                 # id (default), en
    ubah/                   # converter
    aturan/                 # rule reference
    survei/                 # implementation survey
components/
  cheque/                   # amount line, group brackets, # brackets
data/
  survey/                   # recorded third-party results + versions + dates
tests/
  exhaustive/
  boundaries/               # named fixtures
  options/                  # option matrix round-trips
  survey/                   # differential classifications
```

## Invariants

1. **`lib/` has zero runtime dependencies and no environment coupling.** No React, no Next, no DOM, no `Intl`, no `Date`, no `process`, no module-level mutable state. It must behave identically in Node and the browser.

2. **`BigInt` throughout the arithmetic path.** Accept `bigint` or a digit `string`. **Never accept or produce a `number` for the value.** No `parseInt`, no `Number()`, no arithmetic on `number` anywhere in `lib/`. Non-integer input is rejected at the boundary with a structured error.

3. **Refuse rather than guess.** Out-of-range magnitude, non-integer input, or unparseable words return a structured error naming exactly what failed. Never a best-effort string, never a partial result, never a silent clamp.

4. **Never invent a scale word.** Usage above *triliun* is unsettled in Indonesian. If it cannot be cited, the library refuses. Do not extrapolate the pattern.

5. **The `se-` rules are lexical, not arithmetic.** `sepuluh`, `sebelas`, `seratus`, `seribu` — but **`satu juta`**, not `sejuta`, under the default option. Do not "simplify" this into a uniform rule; the asymmetry is real and the uniform version is wrong.

6. **A three-digit group of `000` emits nothing.** `1.000.001` is *satu juta satu*. This is the most common structural bug in the ecosystem; it has permanent fixtures.

7. **Every option carries a citation.** No silent defaults. Both sides of each variant are documented with the usage that supports them.

8. **`format` and `parse` are exact inverses under identical options.** Any change to one requires the round-trip suite to stay green. If they can't round-trip, one of them is wrong.

9. **Parsing resolves multiplier scope correctly.** *dua ratus lima puluh ribu* is `(2×100 + 5×10) × 1000`, not `200 + 50000`. This is the hard part of the reverse direction and it needs its own fixtures.

10. **The public API surface stays small.** `format`, `parse`, `Options`, error types. Everything else is internal. Rinci depends on this — breaking changes cost real work downstream.

11. **Survey data is recorded, versioned, and dated.** Every third-party claim carries the package version and the date it was measured, so the claims stay checkable and age honestly.

12. **The survey is factual, never editorial.** Characterise the failure mode. Do not disparage. It is a map of a shared problem, and the tone matters because these are other people's repositories.

13. **Nothing is computed in a component.** The site imports `lib/` and renders results.

14. **Void red is reserved for validation failures and refusals.** The words output is bank blue. See PRD §8.

## Working style

- **Write the exhaustive harness before the implementation.** M0 exists for this. A million round-trip assertions on a stub proves the harness; then implement until it passes.
- **Boundary fixtures first, general case second.** 0, 10, 11, 100, 1.000, 1.000.001, and the *triliun* edge are where implementations die. Fixture them before writing the recursive case.
- **When a survey disagreement appears, classify it in writing.** Our bug, their bug, or a legitimate variant — recorded in `tests/survey/` either way. That record is a genuine contribution to the ecosystem.
- **Don't optimise the formatter.** It runs in microseconds on a bounded domain. Clarity beats cleverness, and a clever grouping trick is how the empty-group bug gets reintroduced.
- **Ask before adding to the public API.** Rinci depends on it.
- **Don't touch the package build config, the Actions workflow, or `survey:record` without saying so explicitly.**
- **Never add a dependency to `lib/`.** Not for BigInt helpers, not for string utilities, not for anything.
- **Never weaken a test to make something pass**, especially the exhaustive sweep.

## Conventions

- Named exports throughout. `lib/index.ts` re-exports the public surface explicitly — no `export *`.
- Discriminated unions for results and errors, keyed on `type`. Exhaustive `switch` with a `never` default.
- No `any`. No non-null `!` in `lib/`.
- Indonesian grammatical vocabulary in identifiers and comments: `satuan`, `belasan`, `puluhan`, `ratusan`, `kelompok`. Do not translate to English approximations.
- Comments cite the standard for any spelling rule they implement.
- Option keys stable and readable: `sejuta`, `ejaanMiliar`, `mataUang`, `sen`. They appear in the site's URL hash.
- Tailwind utilities inline in the site; semantic tokens in `tailwind.config.ts` — `tint`, `guilloche`, `ink`, `bank`, `void`. Never raw hex in components.

## Testing rules

- `pnpm test:run` before every commit; `pnpm test:exhaustive` before any commit touching `lib/`.
- Exhaustive round-trip 0…1,000,000 must pass completely. Not sampled, not skipped, not marked slow.
- Structural invariants asserted across the entire exhaustive sweep: no `satu puluh`/`satu belas`/`satu ratus`/`satu ribu`; `nol` only for zero; no doubled or edge whitespace; no scale word without a quantity; no empty group emitted.
- Randomized round-trip above a million, seeded, including neighbourhoods of every power of ten.
- Explicit assertions above 2⁵³ — the precision boundary is a permanent test, not a one-off check.
- Every option combination round-trips under itself.
- New variant → citation, option-matrix entry, fixtures.
- Bug fix → failing test first.

## Deployment

Library publishes to npm from a tagged release; the exhaustive suite gates it. Site builds to Pages via Actions. `basePath` must match the repository name; `.nojekyll` must exist in `out/`. Verify with `pnpm preview` before pushing.

## Current state

M0–M5 scaffolded and green. Library formats and parses with `BigInt` throughout; the exhaustive sweep (1.000.001 values) runs in ~5s and gates the suite; site exports statically with converter, rule reference, and survey page.

Open items:

- **Survey data is empty by design.** `pnpm survey:record <paket>` takes package names as arguments and records versions and dates; nothing is claimed about a package that was not measured. Run it to populate `data/survey/hasil.json`, then classify every disagreement in `tests/survey/klasifikasi.ts` — the differential test fails on any unexplained difference.
- **Scale ceiling is *kuadriliun* (10¹⁵), refusing at 10¹⁸.** Chosen because KBBI carries the lemma, and because it is what makes the above-2⁵³ tests meaningful — a *triliun* ceiling would put every in-range value below the precision boundary. Revisit if the citation does not hold.
- Not published to npm; no tagged release yet.
