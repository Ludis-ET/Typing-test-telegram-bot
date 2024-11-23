import TelegramBot from "node-telegram-bot-api";
import SinglePlay from "../../db/models/singlePlay";
import { gameOverCaption } from "../messages";

export const generateWPM = async (
  bot: TelegramBot,
  chatId: number,
  difficulty: string,
  options: { textCount?: string; duration?: string },
  generatedText: string,
  promptText: string,
  timeTaken: number
) => {
  const calculateWPM = (
    typedText: string,
    promptText: string,
    timeTaken: number,
    difficulty: string,
    duration: number
  ) => {
    const correctChars = typedText
      .split("")
      .filter((char, index) => char === promptText[index]).length;

    const totalChars = promptText.length;
    const accuracy = totalChars > 0 ? correctChars / totalChars : 0;

    const baseWPM = correctChars / 5 / (timeTaken / 60);

    const difficultyMultiplier =
      {
        easy: 1,
        medium: 1.2,
        hard: 1.5,
      }[difficulty.toLowerCase()] || 1;

    const timeFactor = timeTaken <= duration ? 1 : duration / timeTaken;

    return Math.round(baseWPM * difficultyMultiplier * timeFactor * accuracy);
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
    return prompt.length > 0
      ? ((correct / prompt.length) * 100).toFixed(2)
      : "0";
  };

  const duration = options.duration ? parseInt(options.duration) : 0;

  const wpm = calculateWPM(
    promptText,
    generatedText,
    timeTaken,
    difficulty,
    duration
  );
  const missedChars = calculateMissedChars(generatedText, promptText);
  const newChars = calculateNewChars(generatedText, promptText);
  const accuracyValue = parseFloat(
    calculateAccuracy(generatedText, promptText)
  );
  const accuracy = isNaN(accuracyValue) ? 0 : accuracyValue;

  const status =
    timeTaken > duration
      ? "You took longer than expected!"
      : "You finished within the expected time!";

  bot.sendPhoto(
    chatId,
    "https://i.ibb.co/4j2wHQH/IMG-20241122-200539-983.jpg",
    {
      caption: gameOverCaption(
        wpm,
        accuracy,
        missedChars,
        newChars,
        status,
        timeTaken,
        difficulty,
        options.duration || "N/A"
      ),
      parse_mode: "MarkdownV2",
    }
  );
};
