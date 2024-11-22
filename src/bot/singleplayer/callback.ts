import TelegramBot from "node-telegram-bot-api";
import { handleDifficultySelection, handleDurationSelection } from ".";


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
