import TelegramBot from "node-telegram-bot-api";

export const singlePlayerHandler = (bot: TelegramBot, chatId: number) => {
  bot.sendMessage(chatId, "🎮 Single Player mode selected! Have fun!");
};

