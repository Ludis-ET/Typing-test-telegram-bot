import TelegramBot from "node-telegram-bot-api";
import { singlePlayerHandler } from "./singleplayer";
import { multiplayerHandler } from "./multiplayer";

export const handleMessage = (
  bot: TelegramBot,
  chatId: number,
  message: string
) => {
  switch (message) {
    case "🎮 Single Player":
      singlePlayerHandler(bot, chatId);
      break;

    case "👥 Multiplayer":
      multiplayerHandler(bot, chatId);
      break;

  }
};
