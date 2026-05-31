import test from 'node:test';
import assert from 'node:assert/strict';
import { createNewCard, scheduleReview } from '../src/domain/srs.js';
import { gradeTranslation } from '../src/domain/grader.js';
import { generateSentenceFromKnownWords, sentenceUsesOnlyKnownWords } from '../src/domain/generator.js';
import { normalizeHebrewToken } from '../src/domain/hebrew.js';
import { lessonCards } from '../src/domain/content.js';

test('SRS schedules successful reviews into the future', () => {
  const now = new Date('2026-05-31T00:00:00Z');
  const scheduled = scheduleReview(createNewCard('card'), 5, now);
  assert.equal(scheduled.repetitions, 1);
  assert.equal(scheduled.intervalDays, 1);
  assert.ok(new Date(scheduled.dueDate) > now);
});

test('generator never emits an unknown word', () => {
  const knownWords = ['ראה', 'את', 'מציאה'];
  const card = generateSentenceFromKnownWords(knownWords, lessonCards);
  assert.ok(card);
  assert.equal(sentenceUsesOnlyKnownWords(card, knownWords), true);
});

test('generator returns null when no sentence can be built only from known words', () => {
  assert.equal(generateSentenceFromKnownWords(['ראה'], lessonCards), null);
});

test('grader accepts known paraphrases and flags near misses', () => {
  const correct = gradeTranslation('another came and seized it', ['and another came and took hold of it']);
  assert.equal(correct.status, 'correct');
  const near = gradeTranslation('another came and held', ['and another came and took hold of it']);
  assert.equal(near.status, 'near');
});

test('Hebrew normalization strips nikkud and normalizes final letters', () => {
  assert.equal(normalizeHebrewToken('בָּהּ.'), 'בה');
  assert.equal(normalizeHebrewToken('מֶלֶךְ'), 'מלכ');
});
