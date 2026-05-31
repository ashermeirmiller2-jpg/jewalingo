# vocab-corpus Wave-1 findings

## Deliverables

- `data/core300.json` contains 300 JSON objects for a first-pass high-frequency Talmud/Gemara vocabulary seed.
- Every object has:
  - `rank`
  - `word`
  - `normalized`
  - `transliteration`
  - `gloss`
  - `frequencyProvisionalWeight`
  - `sourceMethod`
  - `provisional`
  - `appearsInBm10aMishnah`

## Source review

I looked for a clean, directly downloadable frequency list for the Bavli/Gemara and did not find one suitable for this repository task during Wave 1. The most relevant open corpus source located was Sefaria's public export infrastructure:

- Sefaria-Export repository: <https://github.com/Sefaria/Sefaria-Export>
- Sefaria-Export README says the public Sefaria text corpus is hosted in a public Google Cloud Storage bucket and gives paths such as `json/Talmud/Bavli/Seder Moed/Shabbat/Hebrew/merged.json`.
- Sefaria-Export README also documents `books.json` as an index containing `json_url` / `txt_url` entries for exported texts.
- Sefaria Talmud Bavli library page: <https://www.sefaria.org/texts/Talmud/Bavli>
- Sefaria Berakhot page: <https://www.sefaria.org/Berakhot>

Local shell HTTPS requests to `www.sefaria.org`, `storage.googleapis.com/sefaria-export/...`, GitHub raw, and Hugging Face raw endpoints failed in this environment with `CONNECT tunnel failed, response 403`, so I could not compute fresh counts from the exported corpus in this working tree. Because no clean frequency file was obtainable in-run, `core300.json` is explicitly marked provisional.

## Method used for `core300.json`

1. Seeded the list from common Bavli/Gemara study vocabulary and high-yield formulae:
   - frequent Amoraic discourse markers: `אמר`, `מאי`, `תנן`, `תניא`, `איתמר`, `קשיא`, `תיובתא`, `תיקו`, `תא שמע`, `שמע מינה`;
   - common particles and prepositions: `לא`, `אי`, `אלא`, `כי`, `כל`, `על`, `מן`, `של`, `את`, `או`, `אם`;
   - common legal categories: `חייב`, `פטור`, `מותר`, `אסור`, `כשר`, `פסול`, `טמא`, `טהור`, `הלכה`, `דין`;
   - common people / authorities: `רב`, `רבי`, `רבנן`, `רבא`, `אביי`, `שמואל`, `רבי יוחנן`;
   - common nouns and verbs that recur throughout Bavli discussions.
2. Assigned `rank` by this provisional high-yield ordering rather than by measured corpus counts.
3. Assigned `frequencyProvisionalWeight` with a monotone rank-scaled score from `1.0` down to about `0.157`; it is a relative seed weight, **not** a corpus frequency.
4. Created `normalized` forms by removing cantillation/vowel combining marks when present and mapping final Hebrew letters to medial letters (`ך→כ`, `ם→מ`, `ן→נ`, `ף→פ`, `ץ→צ`).
5. Created `transliteration` with a lightweight consonantal Hebrew/Aramaic mapping. These transliterations are intentionally approximate and mostly vowel-less.
6. Marked all entries `provisional: true` and used `sourceMethod` to make that status machine-visible.

## `appearsInBm10aMishnah` handling

For the Bava Metzia 10a Mishnah check, I used the common printed/Sefaria-aligned Mishnah text beginning:

> ראה את המציאה ונפל עליה ובא אחר והחזיק בה ...

and continuing through:

> ... ואמר זכתה לי שדי לא אמר כלום.

The boolean was computed against a normalized token set from this Mishnah text. For multi-word entries, the current Wave-1 flag is permissive: it is `true` when the whole normalized expression appears or when one of its normalized component tokens appears. This is useful for quick client-side highlighting but should be tightened in a later corpus pass if exact phrase matching is needed.

## Uncertainties and recommended next steps

- The list is a **provisional top-300 learning seed**, not a statistically verified Bavli frequency list.
- Formulaic multi-word expressions are mixed with single-token words because they are pedagogically frequent in Gemara study; a later schema may want `type: "token" | "phrase"`.
- Transliteration is consonantal and approximate; it does not disambiguate ב/בֿ, כ/ך, פ/פֿ, שׁ/שׂ, vowels, or begadkefat pronunciation.
- Glosses are concise learning glosses, not full Jastrow-style lexical entries.
- `appearsInBm10aMishnah` is based on the common Bava Metzia 10a Mishnah wording and normalization described above; exact segmentation can vary by edition/export.
- Recommended next wave:
  1. Fetch `books.json` from Sefaria-Export or `gs://sefaria-export/json/Talmud/Bavli/...` outside the blocked shell environment.
  2. Count Hebrew/Aramaic tokens across all Bavli Hebrew `merged.json` files, excluding HTML tags and punctuation.
  3. Decide whether to count raw surface forms, normalized forms, or lemmatized forms.
  4. Join the measured counts back to this seed list, preserving `rank` only where supported by counts.
  5. Replace `frequencyProvisionalWeight` with actual `frequency` and/or `perMillion` fields.
