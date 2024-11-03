const easyWords = ["cat", "dog", "tree", "car", "sun", "bird"];
const mediumWords = ["predict", "explore", "simple", "rocket", "driver"];
const hardWords = [
  "algorithm",
  "differentiation",
  "computation",
  "synchronize",
];

function getRandomWords(wordList: string[], wordCount: number): string {
  let sentence = "";
  for (let i = 0; i < wordCount; i++) {
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    sentence += randomWord + (i === wordCount - 1 ? "." : " ");
  }
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}

export const generateRandomPrompt = (
  difficulty: string,
  duration: number
): string => {
  let wordList: string[];
  let sentenceCount: number;

  if (difficulty === "easy") {
    wordList = easyWords;
    sentenceCount = 2; // Increase base for easy
  } else if (difficulty === "medium") {
    wordList = mediumWords;
    sentenceCount = 3; // Increase base for medium
  } else {
    wordList = hardWords;
    sentenceCount = 4; // Increase base for hard
  }

  // Adjust sentence count based on duration
  if (duration >= 180) {
    sentenceCount += Math.floor(Math.random() * 3); // Randomly add up to 3 more sentences
  } else if (duration >= 60) {
    sentenceCount += 1; // Add 1 sentence for moderate durations
  }

  let prompt = "";
  for (let i = 0; i < sentenceCount; i++) {
    prompt += getRandomWords(wordList, Math.floor(Math.random() * 5) + 1) + " "; // Generate 1-5 words for each sentence
  }

  return prompt.trim();
};

export const calculateWPMAndAccuracy = (
  userInput: string,
  promptText: string,
  timeTaken: number
) => {
  const wordsTyped = userInput
    .trim()
    .split(" ")
    .filter((word) => word.length > 0).length;
  const wpm = (wordsTyped / timeTaken) * 60;
  const correctLetters = userInput
    .split("")
    .filter((char, idx) => char === promptText[idx]).length;
  const incorrectLetters = userInput.length - correctLetters;
  const accuracy = ((correctLetters / userInput.length) * 100).toFixed(2) + "%"; // Calculate percentage accuracy

  console.log(`Time taken: ${timeTaken} seconds`);
  console.log(`Correct letters: ${correctLetters}`);
  console.log(`Incorrect letters: ${incorrectLetters}`);

  return { wpm, accuracy };
};
