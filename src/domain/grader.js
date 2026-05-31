const SYNONYMS = new Map([
  ['seized', 'hold'], ['held', 'hold'], ['took', 'hold'], ['hold', 'hold'], ['won', 'acquired'], ['rights', 'acquired'],
  ['object', 'item'], ['it', 'it'], ['upon', 'on'], ['one', 'he']
]);

function normalizeEnglish(text) {
  return text.toLowerCase().replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(Boolean).map((w) => SYNONYMS.get(w) ?? w);
}

function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length][b.length];
}

export function gradeTranslation(answer, acceptedTranslations) {
  const response = normalizeEnglish(answer);
  let best = { score: 0, match: acceptedTranslations[0] ?? '', status: 'again', message: 'Try again.' };
  for (const accepted of acceptedTranslations) {
    const target = normalizeEnglish(accepted);
    const targetSet = new Set(target);
    const overlap = response.filter((word) => targetSet.has(word)).length;
    const orderDistance = levenshtein(response.join(' '), target.join(' '));
    const lexical = target.length ? overlap / target.length : 0;
    const edit = 1 - orderDistance / Math.max(response.join(' ').length, target.join(' ').length, 1);
    const score = Math.max(0, Math.round((lexical * 0.7 + edit * 0.3) * 100));
    if (score > best.score) best = { score, match: accepted, status: score >= 60 ? 'correct' : score >= 45 ? 'near' : 'again', message: score >= 60 ? 'Correct — strong leining!' : score >= 45 ? 'Near miss — check the key words.' : 'Try again.' };
  }
  return best;
}
