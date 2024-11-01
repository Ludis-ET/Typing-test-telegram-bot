export const calculateWPMAndAccuracy = (
  userInput: string,
  promptText: string
) => {
  const correctChars = userInput
    .split("")
    .filter((char, idx) => char === promptText[idx]).length;
  const totalChars = userInput.length;

  const totalTimeInMinutes = promptText.length / 5 / (totalChars / 60);
  const wpm = Math.round(totalChars / 5 / totalTimeInMinutes);

  const missedChars = Math.max(0, totalChars - promptText.length);
  const extraChars = Math.max(0, totalChars - (correctChars + missedChars));
  const accuracyPercentage = ((correctChars / totalChars) * 100).toFixed(2);
  const accuracy = `${correctChars}/${totalChars} - Accuracy: ${accuracyPercentage}%`;

  return { wpm, accuracy };
};
