import TelegramBot, { Message } from "node-telegram-bot-api";
import {
  setupCallbackQueryListener2,
  singlePlayerHandler,
} from "../singlePlayer";
import { handleHomeCallback } from "./handleStart";

export const setupCallbackQueryListener = (bot: TelegramBot) => {
  bot.on("callback_query", async (query) => {
    const chatId = query.message?.chat.id;
    const data = query.data;

    if (!chatId || !data) return;

    if (data === "single_player") {
      singlePlayerHandler(bot, chatId);
    } else if (data === "multiplayer") {
      bot.sendMessage(chatId, "👥 Multiplayer mode selected!");
      // Implement logic to start the multiplayer game.
    } else if (data === "restart_game") {
      handleHomeCallback(bot, query.message as Message);
    } else {
      setupCallbackQueryListener2(bot);
    }
  });
};
