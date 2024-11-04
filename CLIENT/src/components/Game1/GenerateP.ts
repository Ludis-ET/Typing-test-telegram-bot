const commonWords = [
  "the",
  "be",
  "to",
  "of",
  "and",
  "a",
  "in",
  "that",
  "have",
  "it",
  "you",
  "he",
  "with",
  "on",
  "do",
  "at",
  "by",
  "not",
  "this",
  "but",
  "from",
  "or",
  "which",
  "as",
  "were",
  "an",
  "are",
  "their",
  "if",
  "will",
];

const wordFreq = [
  "example",
  "random",
  "frequency",
  "paragraph",
  "challenge",
  "character",
  "typing",
  "test",
  "accuracy",
  "performance",
  "invention",
  "sequence",
];

const nltkWords = [
  "serendipity",
  "ubiquitous",
  "perspicacious",
  "quixotic",
  "nefarious",
  "elucidate",
  "obfuscate",
  "enigma",
  "paradox",
  "synergy",
  "cognizance",
];

const symbols = [
  "!",
  "@",
  "#",
  "$",
  "%",
  "^",
  "&",
  "*",
  "(",
  ")",
  "-",
  "_",
  "=",
  "+",
  "[",
  "]",
  "{",
  "}",
  ";",
  ":",
  "'",
  '"',
  "<",
  ">",
  ",",
  ".",
  "?",
  "/",
];

const averageWPM = 40;

export function generateRandomPrompt(
  difficulty: string,
  durationInSeconds: number
): string {
  const totalCharacters = calculateTotalCharacters(durationInSeconds);
  const paragraphs = Array(6)
    .fill("")
    .map(() => generateParagraphByDifficulty(difficulty, totalCharacters))
    .join("\n\n");

  return paragraphs;
}

function calculateTotalCharacters(durationInSeconds: number): number {
  const totalWords = (durationInSeconds / 60) * averageWPM;
  return totalWords * 5;
}

function generateParagraphByDifficulty(
  difficulty: string,
  totalCharacters: number
): string {
  switch (difficulty) {
    case "easy":
      return generateEasyPrompt(totalCharacters);
    case "medium":
      return generateMediumPrompt(totalCharacters);
    case "hard":
      return generateHardPrompt(totalCharacters);
    case "nightmare":
      return generateNightmarePrompt(totalCharacters);
    default:
      return generateEasyPrompt(totalCharacters);
  }
}

function generateEasyPrompt(totalCharacters: number): string {
  const words = getRandomWords(commonWords, Math.ceil(totalCharacters / 5));
  return words.join(" ");
}

function generateMediumPrompt(totalCharacters: number): string {
  const commonCount = Math.floor(totalCharacters / 10);
  const freqCount = Math.ceil(totalCharacters / 10);
  const common = getRandomWords(commonWords, commonCount);
  const freq = getRandomWords(wordFreq, freqCount);
  return [...common, ...freq].sort(() => Math.random() - 0.5).join(" ");
}

function generateHardPrompt(totalCharacters: number): string {
  const freqCount = Math.floor(totalCharacters / 6);
  const nltkCount = Math.ceil(totalCharacters / 12);
  const freq = getRandomWords(wordFreq, freqCount);
  const nltk = getRandomWords(nltkWords, nltkCount);
  return [...freq, ...nltk].sort(() => Math.random() - 0.5).join(" ");
}

function generateNightmarePrompt(totalCharacters: number): string {
  const nltkCount = Math.floor(totalCharacters / 8);
  const symbolCount = Math.ceil(totalCharacters / 12);
  const nltk = getRandomWords(nltkWords, nltkCount);
  const randomSymbols = getRandomSymbols(symbolCount);
  return [...nltk, ...randomSymbols].sort(() => Math.random() - 0.5).join(" ");
}

function getRandomWords(wordArray: string[], count: number): string[] {
  return wordArray.sort(() => Math.random() - 0.5).slice(0, count);
}

function getRandomSymbols(count: number): string[] {
  return Array.from(
    { length: count },
    () => symbols[Math.floor(Math.random() * symbols.length)]
  );
}


