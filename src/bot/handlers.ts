import TelegramBot from "node-telegram-bot-api";
import { singlePlayerHandler } from "./singleplayer";
import { multiplayerHandler } from "./multiplayer";

export const handleCallbackQuery =
  (bot: TelegramBot) => (query: TelegramBot.CallbackQuery) => {
    const chatId = query.message!.chat.id;
    const { data } = query;

    switch (data) {
      case "single_player":
        singlePlayerHandler(bot, chatId);
        break;

      case "multiplayer":
        multiplayerHandler(bot, chatId);
        break;

      default:
        bot.sendMessage(chatId, "Unknown action. Please try again.");
    }
  };
