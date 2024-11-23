import { easyWords } from "./words/easy";
import { hardWords } from "./words/hard";
import { mediumWords } from "./words/medium";
import { nightmareWords } from "./words/nightmare";

const getWordsBasedOnDifficulty = (difficulty: string): string[] => {
  switch (difficulty) {
    case "easy":
      return easyWords;
    case "medium":
      return mediumWords;
    case "hard":
      return hardWords;
    case "nightmare":
      return nightmareWords;
    default:
      return easyWords;
  }
};

const generateRandomParagraph = (
  words: string[],
  wordCount: number
): string => {
  let paragraph = "";
  for (let i = 0; i < wordCount; i++) {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    paragraph += randomWord + " ";
  }
  return paragraph.trim();
};

const getWordCountBasedOnDuration = (duration: string): number => {
  switch (duration) {
    case "15sec":
      return 20;
    case "30sec":
      return 40;
    case "1min":
      return 60;
    case "3min":
      return 120;
    default:
      return 20;
  }
};

export const generateParagraph = (
  difficulty: string,
  options: { duration?: string; wordCount?: number }
): string => {
  const words = getWordsBasedOnDifficulty(difficulty);

  if (options.wordCount) {
    return generateRandomParagraph(words, options.wordCount);
  } else if (options.duration) {
    const wordCount = getWordCountBasedOnDuration(options.duration);
    return generateRandomParagraph(words, wordCount);
  } else {
    throw new Error("Either wordCount or duration must be provided.");
  }
};
