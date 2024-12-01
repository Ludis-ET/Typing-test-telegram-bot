import TelegramBot from "node-telegram-bot-api";
import { MultiplayerMessage } from "../messages";

export const singlePlayerHandler = (bot: TelegramBot, chatId: number) => {
  bot.sendMessage(chatId, MultiplayerMessage(), {
    parse_mode: "MarkdownV2",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🔀 Random Match", callback_data: "random_match" },
          { text: "👥 Friend Match", callback_data: "friend_match" },
        ],
        [{ text: "🏘 Home", callback_data: "restart_game" }],
      ],
    },
  });
};
