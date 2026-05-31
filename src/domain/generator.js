export function generateSentenceFromKnownWords(knownWords, cards) {
  const known = new Set(knownWords);
  const eligible = cards.filter((card) => card.requiredWords.every((word) => known.has(word)));
  if (!eligible.length) return null;
  return eligible[0];
}

export function sentenceUsesOnlyKnownWords(card, knownWords) {
  const known = new Set(knownWords);
  return card.requiredWords.every((word) => known.has(word));
}
