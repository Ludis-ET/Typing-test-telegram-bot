import TelegramBot from "node-telegram-bot-api";
import { SinglePlayerMessage } from "../messages";

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

