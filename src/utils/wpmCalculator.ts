export function calculateWPM(charCount: number, time: number): number {
  const minutes = time / 60;
  return Math.round(charCount / 5 / minutes);
}

export function calculateAccuracy(
  inputText: string,
  originalText: string
): number {
  const originalChars = originalText.split("");
  const typedChars = inputText.split("");
  let correctChars = 0;

  typedChars.forEach((char, idx) => {
    if (char === originalChars[idx]) correctChars++;
  });

  return Math.round((correctChars / originalChars.length) * 100);
}
