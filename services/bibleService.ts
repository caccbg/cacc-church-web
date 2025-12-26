
const BASE_URL = 'https://bible-api.com';

export const BIBLE_BOOKS = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
  '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
  'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel',
  'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
  'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
  'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon',
  'Hebrews', 'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation'
];

export const VERSIONS = [
  { id: 'web', name: 'World English Bible (WEB)' },
  { id: 'kjv', name: 'King James Version (KJV)' },
  { id: 'bbe', name: 'Bible in Basic English' },
  { id: 'oeb-us', name: 'Open English Bible' },
];

export interface BibleVerse {
  book_id: string;
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface BibleResponse {
  reference: string;
  verses: BibleVerse[];
  text: string;
  translation_id: string;
  translation_name: string;
}

export const getPassage = async (book: string, chapter: number, translation: string = 'web'): Promise<BibleResponse> => {
  try {
    // bible-api.com format: /John+3:16-17?translation=kjv
    // For whole chapter: /John+3?translation=kjv
    const response = await fetch(`${BASE_URL}/${book}+${chapter}?translation=${translation}`);
    if (!response.ok) throw new Error('Failed to fetch scripture');
    return await response.json();
  } catch (error) {
    console.error("Bible API Error:", error);
    throw error;
  }
};
