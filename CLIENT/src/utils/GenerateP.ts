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
  "transcend",
  "ambiguous",
  "inevitable",
  "complexity",
  "peripheral",
  "abstract",
  "hypothetical",
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
  "ephemeral",
  "juxtaposition",
  "euphemism",
  "anachronistic",
  "pulchritude",
  "idiosyncratic",
];

const smallSymbols = ["=", ",", ".", "-"];
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
  "_",
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
  "?",
  "/",
];
const numbers = Array.from({ length: 10 }, (_, i) => i.toString());

const averageWPM = 40;

export function generateRandomPrompt(
  difficulty: string,
  durationInSeconds: number
): string {
  const totalCharacters = calculateTotalCharacters(durationInSeconds);
  const paragraphs = Array(10)
    .fill("")
    .map(() => generateParagraphByDifficulty(difficulty, totalCharacters))
    .join(" ");

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
  const freqCount = Math.floor(totalCharacters / 8);
  const nltkCount = Math.ceil(totalCharacters / 12);
  const symbolCount = Math.ceil(totalCharacters / 15);
  const numberCount = Math.ceil(totalCharacters / 20);

  const freq = getRandomWords(wordFreq, freqCount);
  const nltk = getRandomWords(nltkWords, nltkCount);
  const symbolsList = getRandomSymbols(smallSymbols, symbolCount);
  const numbersList = getRandomSymbols(numbers, numberCount);

  return [...freq, ...nltk, ...symbolsList, ...numbersList]
    .sort(() => Math.random() - 0.5)
    .join(" ");
}

function generateNightmarePrompt(totalCharacters: number): string {
  const nltkCount = Math.floor(totalCharacters / 6);
  const symbolCount = Math.ceil(totalCharacters / 8);
  const numberCount = Math.ceil(totalCharacters / 10);

  const nltk = getRandomWords(nltkWords, nltkCount);
  const allSymbols = getRandomSymbols(symbols, symbolCount);
  const numbersList = getRandomSymbols(numbers, numberCount);

  return [...nltk, ...allSymbols, ...numbersList]
    .sort(() => Math.random() - 0.5)
    .join(" ");
}

function getRandomWords(wordArray: string[], count: number): string[] {
  return wordArray.sort(() => Math.random() - 0.5).slice(0, count);
}

function getRandomSymbols(symbolArray: string[], count: number): string[] {
  return Array.from(
    { length: count },
    () => symbolArray[Math.floor(Math.random() * symbolArray.length)]
  );
}
