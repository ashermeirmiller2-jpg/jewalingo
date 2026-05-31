# Chunk-taxonomy findings for Bava Metzia 10a

## Scope

This wave-1 pass extracts **formulaic/framing chunks** from the discussion on **Bava Metzia 10a** and assigns each chunk one logical function from the requested label set:

- `question`
- `presumption`
- `proof`
- `answer`
- `statement`
- `conclusion`
- `implied-question`
- `kal-vachomer`

The resulting structured data is in [`data/chunks_bm10a.json`](chunks_bm10a.json).

## Sources consulted

Primary source target:

1. **Sefaria, Bava Metzia 10a** / William Davidson Talmud text. Sefaria was consulted through indexed page snippets and segment snippets because direct local HTTP requests to the Sefaria API were blocked by the environment proxy with `CONNECT tunnel failed: 403 Forbidden`.
2. **Sefaria, Steinsaltz on Bava Metzia 10a**, used only to help verify segmentation and dialog flow when the main Sefaria page snippets were partial.
3. **Daf-Yomi.com text page for Bava Metzia 10a**, used as a cross-check for the latter part of the daf where Sefaria snippets were incomplete.
4. **talmud-bavli.com indexed snippet for Bava Metzia 10a**, used as an additional cross-check for the first half of the daf.

No local cache of the base daf text was created because this task requested ownership only of `data/chunks_bm10a.json` and `data/chunk-taxonomy_findings.md`.

## Method

1. Read/search BM 10a source snippets and cross-check them against parallel indexed text snippets.
2. Ignore content-specific legal nouns and case facts, such as specific actors, property terms, and halakhic objects.
3. Extract only discourse/framing formulae that signal the role of the next move in the sugya.
4. Normalize phrases by removing niqqud and standardizing final presentation while keeping the original phrase in vocalized or exact-source form where available.
5. Assign each phrase exactly one logical function. Where a phrase can function differently in other sugyot, the tag reflects its function in BM 10a.
6. Add short evidence snippets and refs for traceability without attempting to reproduce the full daf.

## Function-tagging choices

- **Question**: explicit interrogative/opening challenge formulas, e.g. `מאי טעמא`, `במאי קמיפלגי`, `למה לי`.
- **Presumption**: formulas that set up a hypothetical assumption, e.g. `ואי סלקא דעתך`, `ואי אמרת`, `אלא אי אמרת`.
- **Proof**: formulas introducing textual evidence or a source-based challenge, e.g. `איתיביה`, `והתניא`, `תלמוד לומר`, `דקתני סיפא`.
- **Answer**: formulas resolving a challenge, narrowing a case, or distinguishing a source, e.g. `הכא במאי עסקינן`, `שאני`, `איכא בינייהו`.
- **Statement**: formulas establishing common ground or an accepted rule, e.g. `קיימא לן`, `כולי עלמא לא פליגי`.
- **Conclusion**: formulas marking an inference, e.g. `אם כן`, `אלא לאו ... קא משמע לן`.
- **Implied-question**: elliptical or rhetorical objection markers, e.g. `ואידך`, `ואם תאמר`, and the BM 10a use of `הכי נמי`.
- **Kal-vachomer**: no clear `קל וחומר` / `ומה ... אף` framing sequence was identified on BM 10a in this pass, so no entry was assigned this function.

## Uncertainties and notes

- **Segment refs in the second half of the daf**: Some evidence was available as page-level text rather than precise Sefaria segment lines. Those entries use page/sugya-level refs such as `Bava Metzia 10a, agency-for-transgression sugya` when precise segment numbers could not be confidently verified from the accessible snippets.
- **`אמר ליה` tagging**: This is a dialogue marker, not inherently an answer. In BM 10a, the listed occurrences introduce responses to objections, so it is tagged `answer`.
- **`איתיביה` and `והתניא` tagging**: These often introduce objections, but their mechanism is evidentiary citation. They are therefore tagged `proof` rather than `question`.
- **`הכי נמי` tagging**: This phrase can be affirmative in other contexts. In the BM 10a `אלא מעתה ... הכי נמי` sequence, it is rhetorical and challenge-oriented, so it is tagged `implied-question`.
- **Normalization**: Normalized forms remove vocalization and preserve common Talmudic spelling rather than forcing a single modern Hebrew orthography.
- **Completeness**: This is a wave-1 taxonomy, not a complete linguistic concordance. It prioritizes recurring and pedagogically useful framing chunks over every possible connective particle.
