export const calculateWPMAndAccuracy = (
  originalText: string,
  userText: string,
  timeTakenMinutes: number
): {
  grossWPM: number;
  netWPM: number;
  accuracy: number;
  correctChars: number;
  totalChars: number;
} => {
  const originalWords = originalText.split(" ");
  const userWords = userText.split(" ");
  let correctChars = 0;
  const totalChars =
    originalWords.reduce((sum, word) => sum + word.length, 0) +
    originalWords.length -
    1;

  originalWords.forEach((origWord, index) => {
    const userWord = userWords[index] || "";

    for (let i = 0; i < Math.min(origWord.length, userWord.length); i++) {
      if (origWord[i] === userWord[i]) {
        correctChars++;
      }
    }

    if (userWord.length > origWord.length) {
      correctChars -= userWord.length - origWord.length;
    }

    if (index < originalWords.length - 1) {
      correctChars++;
    }
  });

  if (userWords.length > originalWords.length) {
    const extraChars =
      userWords
        .slice(originalWords.length)
        .reduce((sum, word) => sum + word.length, 0) +
      (userWords.length - originalWords.length);
    correctChars -= extraChars;
  }

  correctChars = Math.max(0, correctChars);
  const accuracy = (correctChars / totalChars) * 100;
  const grossWPM = userText.replace(/ /g, "").length / 5 / timeTakenMinutes;
  const netWPM = grossWPM * (accuracy / 100);

  return {
    grossWPM: Math.round(grossWPM * 100) / 100,
    netWPM: Math.round(netWPM * 100) / 100,
    accuracy: Math.round(accuracy * 100) / 100,
    correctChars,
    totalChars,
  };
}
