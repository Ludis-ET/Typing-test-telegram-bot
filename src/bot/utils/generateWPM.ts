import TelegramBot from "node-telegram-bot-api";

export const generateWPM = (
  bot: TelegramBot,
  chatId: number,
  difficulty: string,
  duration: string,
  generatedText: string,
  promptText: string,
  timeTaken: number
) => {
  const calculateWPM = (
    typedText: string,
    timeTaken: number,
    totalDuration: number
  ) => {
    const typedWords = typedText.split(/\s+/).length;
    const timeInMinutes = timeTaken / 60;
    const wpm = timeInMinutes > 0 ? Math.round(typedWords / timeInMinutes) : 0;
    const totalDurationInMinutes = totalDuration / 60;
    const comparisonMessage =
      timeTaken > totalDuration
        ? "You took longer than expected!"
        : "You finished within the expected time!";

    return { wpm, comparisonMessage };
  };

  const calculateMissedChars = (generated: string, prompt: string) => {
    let missed = 0;
    const length = Math.min(generated.length, prompt.length);
    for (let i = 0; i < length; i++) {
      if (generated[i] !== prompt[i]) missed++;
    }
    missed += Math.max(0, prompt.length - generated.length);
    return missed;
  };

  const calculateNewChars = (generated: string, prompt: string) => {
    return generated.length > prompt.length
      ? generated.length - prompt.length
      : 0;
  };

  const calculateAccuracy = (generated: string, prompt: string) => {
    let correct = 0;
    for (let i = 0; i < Math.min(generated.length, prompt.length); i++) {
      if (generated[i] === prompt[i]) correct++;
    }
    return ((correct / prompt.length) * 100).toFixed(2);
  };

  const { wpm, comparisonMessage } = calculateWPM(
    generatedText,
    timeTaken,
    parseInt(duration)
  );
  const missedChars = calculateMissedChars(generatedText, promptText);
  const newChars = calculateNewChars(generatedText, promptText);
  const accuracy = calculateAccuracy(generatedText, promptText);

  const caption = `
🎉 *Congratulations\\!*
> _You've just completed the challenge\\!_

||\`Game Stats:
- Difficulty: ${difficulty.toUpperCase()}
- Duration: ${duration} seconds
- Time Taken: ${timeTaken.toFixed(0)} seconds
- Missed Characters: ${missedChars}
- Accuracy: ${accuracy}%
- New Characters Typed: ${newChars}
- WPM: ${wpm} WPM
- Status: ${comparisonMessage}\`||

🔥 **Your WPM:** ***${wpm} WPM*** 🚀

> _"Success is the sum of small efforts, repeated day in and day out\\."_ Keep it up\\!
`;

  bot.sendPhoto(
    chatId,
    "https://i.ibb.co/4j2wHQH/IMG-20241122-200539-983.jpg",
    {
      caption: caption,
      parse_mode: "MarkdownV2",
    }
  );
};
