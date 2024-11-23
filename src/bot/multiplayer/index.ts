import TelegramBot from "node-telegram-bot-api";

export const multiplayerHandler = (bot: TelegramBot, chatId: number) => {
  bot.sendMessage(chatId, "👥 Multiplayer mode selected! Team up and play!");
};
