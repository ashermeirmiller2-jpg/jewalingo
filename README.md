# Jewoulingo MVP — Bava Metzia 10a

Jewoulingo is a Duolingo-style learning app whose north star is to help learners leave the app and read Gemara unaided. This MVP implements **Track A: Learning How to Lein** on one real daf segment: the Mishnah on **Bava Metzia 10a** beginning `רָאָה אֶת הַמְּצִיאָה וְנָפַל עָלֶיהָ`.

## Run locally

The app is now a standalone HTML file. You can open `index.html` directly in a browser, or serve it with the included one-command Node server:

```bash
npm install
npm run dev
```

`npm install` is currently a no-op because the MVP uses only Node's standard library and browser-native JavaScript. Open the printed URL, usually <http://localhost:5173>.

## Test and validate

```bash
npm test
npm run build
```

The tests cover SRS scheduling, the known-word-only sentence generator, lenient grading, and Hebrew normalization.

## What is included

- A vowelized, RTL Mishnah reader for BM 10a with clickable words.
- Known-word highlighter mode on the actual Mishnah text.
- Word popovers with gloss, lemma/root where available, and cluster hints.
- A Track-A lesson loop with tappable English word tiles and free-type translation.
- A small SM-2-style SRS scheduler that reschedules cards after grading.
- A generator that only emits sentences whose required Hebrew/Aramaic words are already known by the learner.
- A localStorage-backed word library, growth chart, and daily streak tracker.
- Wave-1 research data under `/data`:
  - `data/bm10a_mishnah.json`
  - `data/core300.json`
  - `data/chunks_bm10a.json`
  - `data/*_findings.md`

## Architecture

This MVP is intentionally zero-config:

- `index.html` is self-contained with the MVP markup, CSS, and browser JavaScript inline, so it can be opened as a plain HTML file.
- `server.js` optionally serves the standalone HTML file and cached assets using Node's built-in HTTP server.
- `src/app.js` and `src/domain/*` remain as testable source modules matching the inline app logic.
- `src/domain/hebrew.js` handles nekudot stripping and final-letter normalization.
- `src/domain/generator.js` guarantees practice sentences use only known words.
- `src/domain/grader.js` performs lenient synonym/fuzzy grading against accepted translations.
- `src/domain/srs.js` schedules reviews using an SM-2-style algorithm.
- `src/domain/progress.js` persists known words, review history, and streaks in localStorage.
- The standalone HTML embeds the small MVP runtime dataset, while `/data` keeps the committed Wave-1 research JSON for auditability and later regeneration.

The app is structured so the current in-browser data layer can later be moved behind a Node/Express + SQLite/Prisma API without changing the core domain contracts.

## Data and copyright policy

All seed text is sourced from Sefaria's open-access API and the William Davidson / Steinsaltz editions available there. The cached source metadata records the Sefaria endpoint and license notes. **No ArtScroll text, translation, or elucidation is used** as app content, training data, or grading data.

The environment blocked direct shell fetches to Sefaria with a proxy 403 during this build, so the cached raw file is a compact verified excerpt rather than a full API dump. The Mishnah anchor was verified against the Sefaria v3 response available to the agent.

## Later-track extension points

- **Reasoning / outside track:** add function-tagged sugya flow data beside `data/chunks_bm10a.json`, then render it as argument puzzles and flowcharts.
- **Full corpus:** replace the provisional `core300.json` tail with a full Sefaria Bavli frequency job and keep the same word-library contract.
- **Layering:** add a chunk-pattern index that pairs distant sugyot by formulaic sequence and logical function.
- **Full persistence:** move localStorage progress into SQLite tables for users, known words, SRS cards/reviews, sentences, and daf content.
