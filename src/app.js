import { dafContent, coreWords, chunkCatalog, lessonCards } from './domain/content.js';
import { normalizeHebrewToken, tokenizeHebrew } from './domain/hebrew.js';
import { createNewCard, scheduleReview } from './domain/srs.js';
import { generateSentenceFromKnownWords } from './domain/generator.js';
import { gradeTranslation } from './domain/grader.js';
import { currentStreak, learnWords, loadProgress, markPractice, saveProgress } from './domain/progress.js';

const state = { progress: loadProgress(), selectedWord: null, currentCard: null, tileAnswer: [], feedback: null, highlight: true };
const $ = (id) => document.getElementById(id);

function wordLookup(normalized) {
  const segmentWord = dafContent.segments.flatMap((s) => s.words).find((w) => normalizeHebrewToken(w.normalized) === normalized || normalizeHebrewToken(w.surface) === normalized);
  const core = coreWords.find((w) => normalizeHebrewToken(w.normalized) === normalized || normalizeHebrewToken(w.word) === normalized);
  const chunks = chunkCatalog.filter((chunk) => normalizeHebrewToken(chunk.normalized).includes(normalized));
  return { segmentWord, core, chunks };
}

function chooseCard() {
  state.currentCard = generateSentenceFromKnownWords(state.progress.knownWords, lessonCards) || lessonCards[0];
  state.tileAnswer = [];
  state.feedback = null;
}

function renderStats() {
  $('known-count').textContent = state.progress.knownWords.length;
  $('streak').textContent = currentStreak(state.progress.completedDates);
  $('due-count').textContent = Object.values(state.progress.reviews).filter((card) => new Date(card.dueDate) <= new Date()).length;
}

function renderLearnQueue() {
  const needed = ['נפל', 'על', 'בא', 'אחר', 'החזיק', 'ב', 'זכה'];
  $('learn-queue').innerHTML = needed.map((word) => {
    const known = state.progress.knownWords.includes(word);
    const gloss = coreWords.find((w) => w.normalized === word)?.gloss || wordLookup(word).segmentWord?.gloss || 'Gemara word';
    return `<button class="word-pill ${known ? 'known' : ''}" data-learn="${word}">${word}<small>${gloss}</small></button>`;
  }).join('');
}

function renderReader() {
  const known = new Set(state.progress.knownWords.map(normalizeHebrewToken));
  $('reader').innerHTML = dafContent.segments.map((segment) => {
    const words = tokenizeHebrew(segment.he).map(({ surface, normalized }) => {
      const isKnown = known.has(normalized) || [...known].some((kw) => normalized.endsWith(kw));
      return `<button class="he-word ${state.highlight && isKnown ? 'known-highlight' : ''}" data-word="${normalized}" title="Tap for meaning">${surface}</button>`;
    }).join(' ');
    return `<article class="daf-segment"><p class="ref">${segment.ref}</p><p class="hebrew" dir="rtl">${words}</p><p class="translation">${segment.en}</p></article>`;
  }).join('');
}

function renderPopover() {
  if (!state.selectedWord) { $('popover').innerHTML = '<p>Tap any Hebrew/Aramaic word in the reader to see meaning, lemma, root, and common clusters.</p>'; return; }
  const lookup = wordLookup(state.selectedWord);
  const word = lookup.segmentWord;
  $('popover').innerHTML = word ? `
    <h3 dir="rtl">${word.surface}</h3>
    <p><strong>Gloss:</strong> ${word.gloss}</p>
    <p><strong>Lemma:</strong> ${word.lemma || '—'} ${word.root ? ` · <strong>Root:</strong> ${word.root}` : ''}</p>
    <p><strong>Clusters:</strong> ${(word.clusterHints || []).join(', ') || 'No cluster notes yet.'}</p>
    ${lookup.chunks.length ? `<p><strong>Related chunks:</strong> ${lookup.chunks.map((c) => `${c.phrase} (${c.function})`).join(', ')}</p>` : ''}
  ` : '<p>Word not in the MVP lexicon yet. Add it as known after review.</p>';
}

function renderLesson() {
  if (!state.currentCard) chooseCard();
  const card = state.currentCard;
  const canPractice = card.requiredWords.every((w) => state.progress.knownWords.includes(w));
  $('lesson-card').innerHTML = `
    <div class="prompt" dir="rtl">${card.promptHe}</div>
    <p>${card.teachingPoint}</p>
    ${canPractice ? '' : `<p class="warning">Learn: ${card.requiredWords.filter((w) => !state.progress.knownWords.includes(w)).join(', ')}</p>`}
    <div class="tiles">${card.tiles.map((tile, i) => `<button data-tile="${i}">${tile}</button>`).join('')}</div>
    <div class="answer-bar">${state.tileAnswer.join(' ') || 'Tap tiles or type below'}</div>
    <input id="free-answer" placeholder="Type an English translation" />
    <div class="actions"><button id="check-tile">Check tile answer</button><button id="check-free">Check typed answer</button><button id="next-card">Next</button></div>
    ${state.feedback ? `<div class="feedback ${state.feedback.status}"><strong>${state.feedback.message}</strong> Score ${state.feedback.score}. Matched: “${state.feedback.match}”.</div>` : ''}
  `;
}

function renderLibrary() {
  const bars = state.progress.history.map((h) => `<div class="bar" style="height:${Math.max(12, h.count * 8)}px"><span>${h.count}</span></div>`).join('');
  $('library').innerHTML = `<h3>${state.progress.knownWords.length} known words</h3><div class="word-list">${state.progress.knownWords.map((w) => `<span>${w}</span>`).join('')}</div><div class="chart">${bars}</div>`;
}

function persistAndRender() {
  saveProgress(state.progress);
  renderStats(); renderLearnQueue(); renderReader(); renderPopover(); renderLesson(); renderLibrary();
}

function gradeAndSchedule(answer) {
  const result = gradeTranslation(answer, state.currentCard.acceptedTranslations);
  state.feedback = result;
  const existing = state.progress.reviews[state.currentCard.id] || createNewCard(state.currentCard.id);
  const quality = result.status === 'correct' ? 5 : result.status === 'near' ? 3 : 1;
  state.progress.reviews[state.currentCard.id] = scheduleReview(existing, quality);
  if (result.status !== 'again') state.progress = markPractice(state.progress);
  persistAndRender();
}

document.addEventListener('click', (event) => {
  const target = event.target.closest('button');
  if (!target) return;
  if (target.dataset.word) { state.selectedWord = target.dataset.word; renderPopover(); }
  if (target.dataset.learn) { state.progress = learnWords(state.progress, [target.dataset.learn]); chooseCard(); persistAndRender(); }
  if (target.dataset.tile) { state.tileAnswer.push(state.currentCard.tiles[Number(target.dataset.tile)]); renderLesson(); }
  if (target.id === 'check-tile') gradeAndSchedule(state.tileAnswer.join(' '));
  if (target.id === 'check-free') gradeAndSchedule($('free-answer').value);
  if (target.id === 'next-card') { chooseCard(); persistAndRender(); }
  if (target.id === 'toggle-highlight') { state.highlight = !state.highlight; persistAndRender(); }
  if (target.id === 'reset-demo') { localStorage.clear(); state.progress = loadProgress(); chooseCard(); persistAndRender(); }
});

chooseCard();
persistAndRender();
