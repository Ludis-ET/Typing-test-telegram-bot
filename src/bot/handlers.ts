import TelegramBot, { Message } from "node-telegram-bot-api";
import User from "../db/models/user";
import { welcomeMessage } from "./messages";

export const handleStart = (bot: TelegramBot) => async (msg: Message) => {
  const chatId = msg.chat.id;
  const {
    id: telegramId,
    username,
    first_name: firstName,
    last_name: lastName,
  } = msg.from!;

  await User.findOneAndUpdate(
    { telegramId },
    { username, firstName, lastName },
    { upsert: true, new: true }
  );

  bot.sendMessage(chatId, welcomeMessage(firstName || "Player"), {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🎮 Single Player", callback_data: "single_player" }],
        [{ text: "👥 Multiplayer", callback_data: "multiplayer" }],
      ],
    },
    parse_mode: "HTML",
  });
};

export const handleCallbackQuery = (bot: TelegramBot) => (query: any) => {
  const chatId = query.message!.chat.id;
  const { data } = query;

  if (data === "single_player") {
    bot.sendMessage(chatId, "🎮 Single Player mode selected! Have fun!");
  } else if (data === "multiplayer") {
    bot.sendMessage(chatId, "👥 Multiplayer mode selected! Team up and play!");
  }
};
