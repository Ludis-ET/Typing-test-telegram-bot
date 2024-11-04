export function calculateWPMAndAccuracy(
  userInput: string,
  promptText: string,
  timeTaken: number,
  difficulty: string
): { wpm: number; accuracy: string } {
  const totalChars = promptText.length;
  const typedChars = userInput.length;
  const correctChars = getCorrectCharsCount(userInput, promptText);
  const missedChars = totalChars - correctChars;
  const extraChars = Math.max(0, typedChars - totalChars);

  let charsPerWord = 5;
  let difficultyMultiplier = 1;

  if (difficulty === "easy") {
    charsPerWord = 4;
    difficultyMultiplier = 0.8;
  } else if (difficulty === "medium") {
    charsPerWord = 5;
    difficultyMultiplier = 1;
  } else if (difficulty === "hard") {
    charsPerWord = 6;
    difficultyMultiplier = 1.2;
  } else if (difficulty === "nightmare") {
    charsPerWord = 7;
    difficultyMultiplier = 1.5;
  }

  const wpm =
    (correctChars / charsPerWord / (timeTaken / 60)) * difficultyMultiplier;
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
