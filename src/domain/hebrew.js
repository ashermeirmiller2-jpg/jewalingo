export const HEBREW_NIKKUD = /[\u0591-\u05C7]/g;
export const FINAL_LETTERS = { ך: 'כ', ם: 'מ', ן: 'נ', ף: 'פ', ץ: 'צ' };

export function stripNikkud(text) {
  return text.normalize('NFC').replace(HEBREW_NIKKUD, '');
}

export function normalizeHebrewToken(token) {
  return stripNikkud(token)
    .replace(/[״׳"'.,:;!?()[\]{}־–—]/g, '')
    .split('')
    .map((char) => FINAL_LETTERS[char] ?? char)
    .join('')
    .trim();
}

export function tokenizeHebrew(text) {
  return text
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean)
    .map((surface) => ({ surface, normalized: normalizeHebrewToken(surface) }));
}
