import TelegramBot from "node-telegram-bot-api";
import { generateParagraph } from "../utils/generateP";
import { gameState, startTime, userAnswers } from "./singlePlayer";
import { generateWPM } from "../utils/generateWPM";

export const startTextCountChallenge = (
  bot: TelegramBot,
  chatId: number,
  options: { textCount: string },
  difficulty: string
) => {
  const wordCount = parseInt(options.textCount);
  let typedWordsCount = 0;
  let messageId: number | undefined;

  const paragraph = generateParagraph(difficulty, options);
  bot.sendMessage(chatId, paragraph, {
    protect_content: true,
    disable_web_page_preview: true,
  });

  userAnswers[chatId] = paragraph;
  startTime[chatId] = new Date().getTime();
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

    // Count words typed by the user
    if (userAnswers[chatId]) {
      typedWordsCount = userAnswers[chatId].split(" ").length;
      if (typedWordsCount >= wordCount) {
        clearInterval(intervalId);
        bot.sendMessage(chatId, "✅ You completed the challenge! Game over.");
        gameState[chatId].gameOver = true;
      }
    }
  }, 1000);

  gameState[chatId].intervalId = intervalId;

  // Listen for when the user sends a message
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

export const startDurationChallenge = (
  bot: TelegramBot,
  chatId: number,
  options: { duration: string },
  difficulty: string
) => {
  const durationInSeconds = parseInt(options.duration);
  let remainingTime = durationInSeconds;
  let messageId: number | undefined;

  const paragraph = generateParagraph(difficulty, options);
  bot.sendMessage(chatId, paragraph, {
    protect_content: true,
    disable_web_page_preview: true,
  });

  userAnswers[chatId] = paragraph;
  startTime[chatId] = new Date().getTime();
  gameState[chatId] = { intervalId: undefined, gameOver: false };

  const intervalId = setInterval(() => {
    if (remainingTime <= 0) {
      clearInterval(intervalId);
      bot.sendMessage(chatId, "❌ Challenge over. Time's up!");
      gameState[chatId].gameOver = true;
    } else {
      const timerMessage = `⏱ Time remaining: ${remainingTime} seconds. Type the paragraph and send it!`;

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

      remainingTime--;
    }
  }, 1000);

  gameState[chatId].intervalId = intervalId;

  // Listen for when the user sends a message
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
