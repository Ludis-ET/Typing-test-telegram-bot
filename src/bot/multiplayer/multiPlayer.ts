import TelegramBot from "node-telegram-bot-api";
import { MultiplayerMessage } from "../messages";

export const multiPlayerHandler = (bot: TelegramBot, chatId: number) => {
  bot.sendMessage(chatId, MultiplayerMessage(), {
    parse_mode: "MarkdownV2",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🔀 Random Match", callback_data: "multi_random_match" },
          { text: "👥 Friend Match", callback_data: "multi_friend_match" },
        ],
        [{ text: "🏘 Home", callback_data: "restart_game" }],
      ],
    },
  });
};
