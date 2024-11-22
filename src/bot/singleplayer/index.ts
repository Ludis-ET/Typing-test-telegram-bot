import TelegramBot from "node-telegram-bot-api";
import { SinglePlayerMessage } from "../messages";
import { generateParagraph } from "../utils/generateP";

const userChoices: { [key: number]: { difficulty: string; duration: string } } =
  {};
const userAnswers: { [key: number]: string } = {};
const startTime: { [key: number]: number } = {}; // Store start time for each user

const startCountdown = (bot: TelegramBot, chatId: number, duration: string) => {
  let timeRemaining: number;

  switch (duration) {
    case "20sec":
      timeRemaining = 20;
      break;
    case "30sec":
      timeRemaining = 30;
      break;
    case "1min":
      timeRemaining = 60;
      break;
    case "3min":
      timeRemaining = 180;
      break;
    default:
      timeRemaining = 20;
  }

  let messageId: number | undefined;
  let gameOver = false;
  timeRemaining -= 10;
  const intervalId = setInterval(() => {
    if (timeRemaining <= 0) {
      clearInterval(intervalId);
      if (messageId) {
        bot.deleteMessage(chatId, messageId).catch((error) => {});
      }

      const endTime = new Date().getTime();
      const timeSpent = (endTime - startTime[chatId]) / 1000; // Time in seconds
      const typedMessage = ""; // No message sent, treat as empty

      console.log(`Inserted text: ${typedMessage}`);
      console.log(`Generated paragraph: ${userAnswers[chatId]}`);
      console.log(`Time spent: ${timeSpent} seconds`);

      if (!gameOver) {
        bot.sendMessage(chatId, "🎴 Game over.").catch((error) => {});
      }

      gameOver = true;
      bot
        .sendMessage(chatId, "⏰ Time's up! Challenge over.")
        .catch((error) => {});
    } else {
      if (!messageId) {
        bot
          .sendMessage(chatId, `${timeRemaining} seconds left...`)
          .then((sentMessage) => {
            messageId = sentMessage.message_id;
          })
          .catch((error) => {});
      } else {
        bot
          .editMessageText(`${timeRemaining} seconds left...`, {
            chat_id: chatId,
            message_id: messageId,
          })
          .catch((error) => {});
      }

      timeRemaining -= 10;
    }
  }, 10000);

  bot.once("message", (msg) => {
    if (msg.chat.id === chatId && msg.text) {
      const typedMessage = msg.text.trim();
      const endTime = new Date().getTime();
      const timeSpent = (endTime - startTime[chatId]) / 1000; // Time in seconds

      console.log(`Inserted text: ${typedMessage}`);
      console.log(`Generated paragraph: ${userAnswers[chatId]}`);
      console.log(`Time spent: ${timeSpent} seconds`);

      if (typedMessage === userAnswers[chatId]) {
        clearInterval(intervalId);
        gameOver = true;
        bot
          .sendMessage(chatId, "✅ You completed the challenge! Game over.")
          .catch((error) => {});
      } else {
        clearInterval(intervalId);
        gameOver = true;
        bot
          .sendMessage(chatId, "⏰ Time's up! Challenge over.")
          .catch((error) => {});
      }
    }
  });
};

export const singlePlayerHandler = (bot: TelegramBot, chatId: number) => {
  bot.sendMessage(chatId, SinglePlayerMessage(), {
    parse_mode: "MarkdownV2",
    reply_markup: {
      inline_keyboard: [
        [{ text: "🟢 Easy", callback_data: "easy" }],
        [{ text: "🟡 Medium", callback_data: "medium" }],
        [{ text: "🔴 Hard", callback_data: "hard" }],
        [{ text: "🔥 Nightmare", callback_data: "nightmare" }],
      ],
    },
  });
};

export const handleDifficultySelection =
  (bot: TelegramBot) => (query: TelegramBot.CallbackQuery) => {
    const chatId = query.message!.chat.id;
    const { data } = query;

    if (!userChoices[chatId]) {
      userChoices[chatId] = { difficulty: "", duration: "" };
    }

    if (data) {
      userChoices[chatId].difficulty = data;
    }

    bot.deleteMessage(chatId, query.message!.message_id);
    bot.sendMessage(
      chatId,
      "🎯 Great choice! Now, select the duration for the challenge ⏱️:",
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "20 seconds ⏳", callback_data: "20sec" }],
            [{ text: "30 seconds ⏳", callback_data: "30sec" }],
            [{ text: "1 minute ⏰", callback_data: "1min" }],
            [{ text: "3 minutes ⏰", callback_data: "3min" }],
          ],
        },
      }
    );
  };

export const handleDurationSelection =
  (bot: TelegramBot) => (query: TelegramBot.CallbackQuery) => {
    const chatId = query.message!.chat.id;
    const { data } = query;

    if (!userChoices[chatId]) {
      userChoices[chatId] = { difficulty: "", duration: "" };
    }

    if (data) {
      userChoices[chatId].duration = data;
    }

    bot.deleteMessage(chatId, query.message!.message_id);

    const paragraph = generateParagraph(
      userChoices[chatId].difficulty,
      userChoices[chatId].duration
    );

    bot.sendMessage(chatId, paragraph, {
      protect_content: true,
      disable_web_page_preview: true,
    });

    userAnswers[chatId] = paragraph;
    startTime[chatId] = new Date().getTime();

    startCountdown(bot, chatId, userChoices[chatId].duration);
  };
