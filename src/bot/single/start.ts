import TelegramBot from "node-telegram-bot-api";
import { generateParagraph } from "../utils/generateP";
import { gameState, startTime, userAnswers } from "./singlePlayer";
import { generateWPM } from "../utils/generateWPM";

export const startTextChallenge = (
  bot: TelegramBot,
  chatId: number,
  options: { textCount?: string; duration?: string },
  difficulty: string
) => {
  if (!options.textCount && !options.duration) {
    bot.sendMessage(
      chatId,
      "❌ Either word count or duration must be provided."
    );
    return;
  }

  const paragraph = generateParagraph(difficulty, options);
  bot.sendMessage(chatId, paragraph, {
    protect_content: true,
    disable_web_page_preview: true,
  });

  userAnswers[chatId] = paragraph;
  startTime[chatId] = new Date().getTime();
  let messageId: number | undefined;

  gameState[chatId] = { intervalId: undefined, gameOver: false };

  const intervalId = setInterval(() => {
    const currentTime = new Date().getTime();
    const elapsedTime = Math.floor((currentTime - startTime[chatId]) / 1000);

    const timerMessage = `⏱ Time elapsed: ${elapsedTime} seconds. Type the paragraph and send it!`;
    if (!messageId) {
      bot
        .sendMessage(chatId, timerMessage, {
          reply_markup: {
            inline_keyboard: [
              [{ text: "⏹ Stop Challenge", callback_data: "stop_challenge" }],
            ],
          },
        })
        .then((sentMessage) => (messageId = sentMessage.message_id))
        .catch(() => {});
    } else {
      bot
        .editMessageText(timerMessage, {
          chat_id: chatId,
          message_id: messageId,
          reply_markup: {
            inline_keyboard: [
              [{ text: "⏹ Stop Challenge", callback_data: "stop_challenge" }],
            ],
          },
        })
        .catch(() => {});
    }
  }, 1000);

  gameState[chatId].intervalId = intervalId;

  bot.once("message", (msg) => {
    if (msg.chat.id === chatId && msg.text) {
      const typedMessage = msg.text.trim();
      const endTime = new Date().getTime();
      const timeSpent = (endTime - startTime[chatId]) / 1000;

      clearInterval(intervalId);

      if (!gameState[chatId].gameOver) {
        generateWPM(
          bot,
          chatId,
          difficulty,
          options,
          userAnswers[chatId],
          typedMessage,
          timeSpent
        );
        if (typedMessage === userAnswers[chatId]) {
          gameState[chatId].gameOver = true;
          bot.sendMessage(chatId, "✅ You completed the challenge! Game over.");
        } else {
          gameState[chatId].gameOver = true;
          bot.sendMessage(chatId, "❌ Challenge over. Try again!");
        }
      }
    }
  });
};
