const KEY = 'jewoulingo-progress-v1';
const today = () => new Date().toISOString().slice(0, 10);

export function initialProgress() {
  return { knownWords: ['ראה', 'את', 'מציאה'], reviews: {}, completedDates: [], history: [{ date: today(), count: 3 }] };
}

export function loadProgress() {
  try { return { ...initialProgress(), ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { return initialProgress(); }
}

export function saveProgress(progress) {
  localStorage.setItem(KEY, JSON.stringify(progress));
}

export function learnWords(progress, words) {
  const known = new Set(progress.knownWords);
  words.forEach((word) => known.add(word));
  const knownWords = [...known];
  const date = today();
  const history = [...progress.history.filter((h) => h.date !== date), { date, count: knownWords.length }].slice(-14);
  return { ...progress, knownWords, history };
}

export function markPractice(progress) {
  const date = today();
  const completedDates = progress.completedDates.includes(date) ? progress.completedDates : [...progress.completedDates, date];
  return { ...progress, completedDates };
}

export function currentStreak(completedDates) {
  const dates = new Set(completedDates);
  let streak = 0;
  const cursor = new Date();
  while (dates.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
