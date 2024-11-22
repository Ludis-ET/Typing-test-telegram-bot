import TelegramBot from "node-telegram-bot-api";
import { SinglePlayerMessage } from "../messages";

const userChoices: { [key: number]: { difficulty: string; duration: string } } =
  {};

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

    bot.deleteMessage(chatId, query.message!.message_id); // Delete the current message
    bot.sendMessage(
      chatId,
      "🎯 Great choice! Now, select the duration for the challenge ⏱️:",
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "15 seconds ⏳", callback_data: "15sec" }],
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

    bot.deleteMessage(chatId, query.message!.message_id); // Delete the current message
    bot.sendMessage(
      chatId,
      `🎉 You have selected:\n\nDifficulty: *${userChoices[chatId].difficulty}*\nDuration: *${userChoices[chatId].duration}*\n\nGet ready to start the challenge! 💥`
    );
  };

export const setupCallbackQueryListener = (bot: TelegramBot) => {
  bot.on("callback_query", (query) => {
    const { data, message } = query;

    if (message && data) {
      const chatId = message.chat.id;

      if (["easy", "medium", "hard", "nightmare"].includes(data)) {
        handleDifficultySelection(bot)(query);
      } else if (["15sec", "30sec", "1min", "3min"].includes(data)) {
        handleDurationSelection(bot)(query);
      }
    }
  });
};
