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
];

const nltkWords = [
  "serendipity",
  "ubiquitous",
  "perspicacious",
  "quixotic",
  "nefarious",
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
  const totalCharacters = calculateTotalCharacters(
    difficulty,
    durationInSeconds
  );
  let prompt = "";

  switch (difficulty) {
    case "easy":
      prompt = generateEasyPrompt(totalCharacters);
      break;
    case "medium":
      prompt = generateMediumPrompt(totalCharacters);
      break;
    case "hard":
      prompt = generateHardPrompt(totalCharacters);
      break;
    default:
      prompt = generateEasyPrompt(totalCharacters);
      break;
  }

  return prompt;
}

function calculateTotalCharacters(
  difficulty: string,
  durationInSeconds: number
): number {
  const durationModifiers = {
    15: 0.5,
    20: 0.75,
    60: 1.0,
    180: 1.5,
    300: 2.0,
    420: 2.5,
  };

  const modifier = durationModifiers[durationInSeconds as keyof typeof durationModifiers] || 1.0;
  const wordsPerMinute = averageWPM * modifier;
  const difficultyFactor =
    difficulty === "easy" ? 1 : difficulty === "medium" ? 1.25 : 1.5;
  const totalWords =
    (durationInSeconds / 60) * wordsPerMinute * difficultyFactor;

  return totalWords * 5;
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
  const freq = getRandomWords(wordFreq, freqCount);
  const nltk = getRandomWords(nltkWords, nltkCount);
  const randomSymbols = getRandomSymbols(Math.floor(totalCharacters / 20));
  return [...freq, ...nltk, ...randomSymbols]
    .sort(() => Math.random() - 0.5)
    .join(" ");
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

export function calculateWPMAndAccuracy(
  userInput: string,
  promptText: string,
  timeTaken: number
): { wpm: number; accuracy: string } {
  const totalChars = promptText.length;
  const typedChars = userInput.length;
  const correctChars = getCorrectCharsCount(userInput, promptText);
  const missedChars = totalChars - correctChars;
  const extraChars = Math.max(0, typedChars - totalChars);
  const wpm = correctChars / 5 / (timeTaken / 60);
  const totalCountedChars = typedChars + missedChars + extraChars;
  const accuracy =
    totalCountedChars > 0
      ? ((correctChars / totalCountedChars) * 100).toFixed(2) + "%"
      : "0.00%";

  return {
    wpm,
    accuracy,
  };
}

function getCorrectCharsCount(userInput: string, promptText: string): number {
  let count = 0;
  const length = Math.min(userInput.length, promptText.length);

  for (let i = 0; i < length; i++) {
    if (userInput[i] === promptText[i]) {
      count++;
    }
  }

  return count;
}
