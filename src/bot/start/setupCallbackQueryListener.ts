import TelegramBot, { Message } from "node-telegram-bot-api";
import {
  setupCallbackQueryListener2,
  singlePlayerHandler,
} from "../single/singlePlayer";
import { handleHomeCallback } from "./handleStart";
import { multiPlayerHandler, multiPlayerCallbacks } from "../multiplayer";

export const setupCallbackQueryListener = (bot: TelegramBot) => {
  bot.on("callback_query", async (query) => {
    const chatId = query.message?.chat.id;
    const data = query.data;

    if (!chatId || !data) return;

    if (data === "single_player") {
      singlePlayerHandler(bot, chatId);
    } else if (data === "multiplayer") {
      multiPlayerHandler(bot, chatId);
    } else if (data === "restart_game") {
      bot.deleteMessage(chatId, query.message!.message_id).catch(() => {});
      handleHomeCallback(bot, query.message as Message);
    } else if (data.startsWith("multi_")) {
      multiPlayerCallbacks(bot, query, chatId, data);
    } else {
      setupCallbackQueryListener2(bot, query, chatId, data);
    }
  });
};
