export function createNewCard(cardId) {
  return { cardId, repetitions: 0, intervalDays: 0, easeFactor: 2.5, dueDate: new Date().toISOString(), lastQuality: null };
}

export function scheduleReview(card, quality, now = new Date()) {
  const boundedQuality = Math.max(0, Math.min(5, Number(quality)));
  let repetitions = boundedQuality < 3 ? 0 : card.repetitions + 1;
  let intervalDays = 1;
  if (boundedQuality < 3) intervalDays = 1;
  else if (repetitions === 1) intervalDays = 1;
  else if (repetitions === 2) intervalDays = 6;
  else intervalDays = Math.max(1, Math.round(card.intervalDays * card.easeFactor));

  const easeFactor = Math.max(
    1.3,
    card.easeFactor + (0.1 - (5 - boundedQuality) * (0.08 + (5 - boundedQuality) * 0.02))
  );
  const due = new Date(now);
  due.setDate(due.getDate() + intervalDays);
  return { ...card, repetitions, intervalDays, easeFactor: Number(easeFactor.toFixed(2)), dueDate: due.toISOString(), lastQuality: boundedQuality };
}
