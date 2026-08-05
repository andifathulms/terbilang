# PRD — Terbilang

**Indonesian numbers spelled out in words, and read back again. A small, exhaustively tested, bidirectional library — plus a page that shows you where every other implementation breaks.**

> *terbilang* (Indonesian) — spelled out in words; the standard term for the words-form of an amount on a receipt, invoice, or cheque.
> Named plainly on purpose: this is the exact term people search for. Slug used throughout as `terbilang`.

| | |
|---|---|
| **Status** | Draft — pre-implementation |
| **Owner** | Andi Fathul Mukminin Salahuddin |
| **Type** | Personal portfolio project, open source. **Library first, site second.** |
| **Deployment** | GitHub Pages (static export) + npm package |
| **Language** | Indonesian-first UI; English secondary |
| **Normative source** | KBBI and PUEBI/EYD (Badan Pengembangan dan Pembinaan Bahasa) for numeral spelling. |
| **Downstream** | Rinci needs this for payslips. Build it here, depend on it there. |

---

## 1. Why a project this small deserves a spec

Two honest reasons, and one that matters more than either.

**It is broken everywhere.** *Terbilang* is legally and conventionally required on Indonesian receipts, invoices, cheques, and *akta*, so nearly every Indonesian accounting or payroll system implements it. A large share get it wrong: `satu ribu` instead of `seribu`, `satu puluh` instead of `sepuluh`, silent breakage above `triliun`, or float precision corrupting large amounts. These are not exotic failures — they appear on printed documents.

**It is a near-perfect subject for exhaustive testing.** A pure integer→string function over a bounded domain can be verified *completely* for the first million values and round-tripped. Very few libraries in this space do that, and the rigour is legible to anyone reading the repository.

**And it will actually get finished.** Every other project in this set is months of work. This one is a weekend for the engine and a weekend for the page, and it ends with a published package that other people can install. Small and shipped beats large and specced.

## 2. The rules

Indonesian numeral formation is regular until it isn't, and the exceptions are exactly where implementations fail.

**The `se-` rule.** For a leading `1`, the word is fused rather than compounded:

| Value | Correct | Common error |
|---|---|---|
| 10 | sepuluh | satu puluh |
| 11 | sebelas | satu belas |
| 100 | seratus | satu ratus |
| 1.000 | seribu | satu ribu |
| 1.000.000 | **satu juta** | sejuta |

The asymmetry at the bottom row is the interesting one: `se-` fusion applies to *puluh*, *belas*, *ratus*, and *ribu*, but standard usage takes `satu juta` — while *sejuta* is widespread informally and in literary registers. This is a real variant, not a bug, and it becomes a documented, cited option rather than a silent choice.

**The teens.** 11–19 use `belas`: *sebelas*, *dua belas*, … *sembilan belas*. Not derivable from the tens pattern.

**Scale words.** *ribu* (10³), *juta* (10⁶), *miliar* (10⁹), *triliun* (10¹²). Spelling variants *milyar* and *trilyun* are common in the wild; KBBI takes *miliar* and *triliun*. Beyond *triliun*, usage is genuinely unsettled — the app either cites a source or refuses, and does not invent.

**Empty group suppression.** `1.000.001` is *satu juta satu*, never *satu juta nol ribu satu*. A group of `000` emits nothing at all. This is the single most common structural bug.

**Decimals.** Comma is the decimal separator and is read as *koma*, with following digits read individually: `1,25` → *satu koma dua lima*, not *satu koma dua puluh lima*.

**Currency.** Trailing *rupiah*; *sen* for hundredths where an accounting context requires it. On documents the words are conventionally bracketed with `#` to prevent tampering — a real convention worth reproducing in the document mode.

## 3. Product

**A library**, published to npm, that is the actual deliverable. Pure, dependency-free, `BigInt`-based, bidirectional, typed.

**A site** that is three things at once:

- a working converter, with the three-digit grouping visualised as you type;
- a rule reference, each rule cited;
- a **survey of existing implementations**, run against the same inputs, showing exactly where each one breaks.

That last piece is the distinctive contribution. It is the same move as Kupas's Sastrawi divergence record: not "here is my implementation", but "here is a documented account of a problem the ecosystem gets wrong, with evidence."

## 4. Non-goals

- **Not a general i18n number formatter.** `Intl.NumberFormat` exists for digits. This is the words form only.
- **No other languages.** Javanese, Sundanese, and Malay have their own numeral morphology. Out of scope; a different package if ever.
- **No ordinals in v1.** *pertama*, *kedua*, *ketiga* is a separate small problem with its own irregularity. Deferred, and cheap to add later.
- **No date or time spelling.**
- **No speech synthesis.** Text output only.
- **No scale words beyond what can be cited.** If usage above *triliun* is unsettled, the library returns a structured refusal rather than guessing.
- **No accounts, no server.**

## 5. Features

### 5.1 Converter
Number in, words out, live. The **three-digit grouping is drawn as you type** — each group boxed and labelled with its scale word — because that grouping *is* the algorithm and seeing it is most of the explanation. Empty groups visibly collapse to nothing.

### 5.2 Parse mode — the reverse direction
Words in, number out. Most implementations are one-way; this one is not. Parsing is genuinely harder than formatting, because multiplier scope has to be resolved: *dua ratus lima puluh ribu* is `(2×100 + 5×10) × 1000`, not `200 + 50000`.

The parser is also what makes round-trip property testing possible, which is where the project's real rigour lives.

### 5.3 Options, each cited
- `satu juta` vs `sejuta`
- `miliar` vs `milyar`, `triliun` vs `trilyun`
- currency suffix on or off
- *sen* handling
- capitalisation style for document use

Every option names the standard or usage that justifies both sides. No option is a silent default.

### 5.4 Implementation survey
A table of existing npm and PHP terbilang packages against a battery of inputs, with each failure shown and characterised. Generated by a development script and committed as data, with each package's version recorded so the claims stay checkable and dated.

Written factually and without disparagement — the goal is a useful map of a shared problem, not a scoreboard.

### 5.5 Document mode
Output formatted as it appears on a *kwitansi* or cheque: `# seribu lima ratus rupiah #`, correctly capitalised, ready to copy.

### 5.6 Rule reference
Every rule with its citation and worked examples, including the failure cases from §2.

## 6. Architecture

The library is the core; the site imports it.

```
lib/                     ← published to npm, zero dependencies
  format.ts              # BigInt → words
  parse.ts               # words → BigInt
  groups.ts              # three-digit decomposition
  words.ts               # lexicon: units, teens, scales
  options.ts             # variant handling
  types.ts
app/                     ← the site, imports lib/
```

**`BigInt` throughout, not `number`.** JavaScript integers lose precision above 2⁵³ ≈ 9×10¹⁵, which is *just above* the *kuadriliun* boundary — so a naive `number` implementation is correct through *triliun* and silently wrong immediately after. That is a nasty failure mode: it works in testing and corrupts a real invoice. Accept `bigint | string`, never a float, and reject non-integer input explicitly.

**Pure and dependency-free.** No React, no DOM, no clock, no locale APIs. Same inputs, same output, in Node and the browser.

**Refuse rather than guess.** Out-of-range magnitudes, non-integers, and unparseable words return a structured error naming what failed — never a best-effort string.

**Tree-shakeable, dual ESM/CJS, with types.** It is a library; it should behave like one.

## 7. Testing — where this project earns its place

**Exhaustive round-trip for 0…1,000,000.** Every value, formatted then parsed, must return the original. A million assertions on a pure integer function runs in seconds. Complete verification of a bounded domain is rare and worth having.

**Randomized round-trip beyond**, seeded, up to the supported magnitude ceiling, including boundary neighbourhoods around every power of ten.

**Structural invariants**, asserted over every output in the exhaustive sweep:
- never contains `satu puluh`, `satu belas`, `satu ratus`, or `satu ribu`
- contains `nol` only for exactly zero
- no doubled spaces, no leading or trailing space
- no scale word appears without a preceding quantity
- no empty group is emitted

**Boundary fixtures**, named and permanent: 0, 1, 10, 11, 19, 20, 100, 101, 110, 1.000, 1.001, 1.100, 10.000, 100.000, 101.000, 1.000.000, 1.000.001, 1.000.000.000, and the *triliun* boundary.

**Differential survey.** The same development script that generates the survey table also acts as a differential test. Disagreements are investigated and classified — our bug, their bug, or a legitimate variant — and the classification is written down.

**Option matrix.** Every option combination round-trips: parsing must accept what formatting produced, under the same options.

## 8. Design direction

The material world is the **cheque and the bilyet giro**: pale security tint, fine guilloche line-work behind the fields, a ruled line for the amount in words, and the `#` brackets that stop anyone adding to it.

**Palette.** Security tint `#E6EDE4`, a pale printed green. Guilloche line `#B9C7BC` — fine engine-turned patterning, used at low contrast as texture behind the amount field, never as decoration elsewhere. Ink `#1C231F`. Bank blue `#2B4C6F` for the words output, which is the hero of the page and should read as the printed amount. **Void red `#A33C33` reserved for validation failures and refusals** — nothing else.

**Type.** The words output carries the page, so **Fraunces** for it and for display — it has the engraved, slightly vintage quality that security printing has, and it holds up at large sizes. **Roboto Mono** with tabular figures for numeric input and the group boxes, since digits must align. **Inter** for controls and prose.

**Structure.** The converter is laid out as a cheque amount line: digits in a boxed field to the right, words running across a ruled line to the left, `#` brackets at each end in document mode. The three-digit groups sit above the digits as labelled brackets — *juta*, *ribu* — so grouping is visible before the words are read.

**Motion.** One thing only: as digits are typed, each three-digit group's words re-render as a unit, so the reader sees the number decompose group by group rather than character by character. Empty groups visibly collapse. Nothing else moves.

**Copy.** Indonesian first. Grammatical terms in Indonesian — *satuan*, *belasan*, *puluhan*, *ratusan* — and each variant option states the usage behind both choices rather than declaring one correct.

## 9. Milestones

| | | |
|---|---|---|
| **M0** | Library skeleton | Package scaffold, dual build, types, exhaustive test harness proven on a stub. |
| **M1** | Format | `BigInt` → words, all `se-` rules, group suppression, scale words, decimals, currency. Exhaustive structural tests green. **Publish to npm here.** |
| **M2** | Parse | Words → `BigInt` with multiplier scope. Exhaustive round-trip green. Republish. |
| **M3** | Site | Converter, group visualisation, document mode. Deploy to Pages. |
| **M4** | Options + reference | Cited variants, option matrix tests, rule reference pages. |
| **M5** | Survey | Differential script, implementation table, failure characterisation. |

**M1 is shippable and useful on its own.** M2 is what makes the testing rigorous. M5 is what makes the project interesting to read about.

## 10. Success criteria

- Exhaustive round-trip passes for every value 0…1,000,000 — no exceptions.
- Structural invariants hold across the full exhaustive sweep.
- No `number` type anywhere in the arithmetic path; verified above 2⁵³.
- Every option carries a citation; every survey claim carries a package version and a date.
- Out-of-range and malformed input returns a structured refusal, never a plausible wrong string.
- Zero runtime dependencies; ESM and CJS with types.
- Rinci can depend on it unmodified.
- Site JS ≤ 100 KB gzipped.

## 11. Deployment

Library publishes to npm from a tagged release; the site builds to Pages via `output: 'export'` with `basePath` matching the repository name and `.nojekyll` in the output root. The exhaustive test suite gates both. Verify the site under the production `basePath` with `pnpm preview` before pushing.

## 12. Risks

| Risk | Mitigation |
|---|---|
| **Float precision corrupts large amounts silently.** | `BigInt` throughout, non-integer input rejected at the boundary, tests explicitly above 2⁵³. This is the bug that reaches printed invoices. |
| **Variant disputes** (*sejuta*, *milyar*). | Cited options, both sides explained, no silent default. |
| **Scale words above *triliun* are unsettled.** | Cite or refuse. Never invent a scale word. |
| **The survey reads as attacking other developers.** | Factual, versioned, dated, characterised by failure mode, no editorialising. It is a map of a shared problem. |
| **The project is small enough to feel slight.** | It is small. The value is exhaustive verification, a working reverse parser, and a real published package with downstream users — including your own. |
| **Scope creep into a general formatting library.** | §4 is binding. `Intl.NumberFormat` already exists. |
