import { dafContent as rawDafContent } from '../data/mishnah.js';
import { core300Data } from '../data/core.js';
import { chunksData } from '../data/chunks.js';

export const dafContent = {
  ...rawDafContent,
  segments: rawDafContent.segments.map((segment) => ({
    ref: segment.ref,
    kind: segment.kind || segment.segment_type || 'Mishnah',
    he: segment.he || segment.text_he,
    en: segment.en || segment.text_en,
    words: (segment.words || segment.word_by_word || []).map((word) => ({
      surface: word.surface,
      normalized: word.normalized,
      lemma: word.lemma || word.lemma_best_effort,
      root: word.root,
      gloss: word.gloss,
      clusterHints: word.clusterHints || word.cluster_hints || []
    }))
  }))
};
export const coreWords = Array.isArray(core300Data) ? core300Data.map((word) => ({ ...word, frequencyWeight: word.frequencyWeight ?? word.frequencyProvisionalWeight, source: word.source ?? word.sourceMethod })) : core300Data.words;
export const chunkCatalog = Array.isArray(chunksData) ? chunksData : chunksData.chunks;

export const lessonCards = [
  { id: 'bm10a-found-item-case', promptHe: 'רָאָה אֶת הַמְּצִיאָה', requiredWords: ['ראה', 'את', 'מציאה'], acceptedTranslations: ['he saw the found item', 'saw the found item', 'one saw the found item'], tiles: ['he', 'saw', 'the', 'found', 'item', 'fell', 'upon', 'it'], teachingPoint: 'Case-opening verbs tell you what happened before the ruling.' },
  { id: 'bm10a-fell-on-it', promptHe: 'וְנָפַל עָלֶיהָ', requiredWords: ['נפל', 'על'], acceptedTranslations: ['and fell upon it', 'and he fell on it', 'fell upon it'], tiles: ['and', 'fell', 'upon', 'it', 'another', 'acquired'], teachingPoint: 'עליה is על + a feminine suffix: “upon it.”' },
  { id: 'bm10a-acquired-it', promptHe: 'זָכָה בָּהּ', requiredWords: ['זכה', 'ב'], acceptedTranslations: ['he acquired it', 'acquired it', 'won rights to it'], tiles: ['he', 'acquired', 'it', 'saw', 'the'], teachingPoint: 'זכה is the ruling verb: the person legally acquires the object.' },
  { id: 'bm10a-other-held', promptHe: 'וּבָא אַחֵר וְהֶחְזִיק בָּהּ', requiredWords: ['בא', 'אחר', 'החזיק', 'ב'], acceptedTranslations: ['and another came and took hold of it', 'another came and seized it', 'and another came and held it'], tiles: ['and', 'another', 'came', 'and', 'took', 'hold', 'of', 'it'], teachingPoint: 'The second actor’s physical hold is the acquisition act in this Mishnah.' }
];
