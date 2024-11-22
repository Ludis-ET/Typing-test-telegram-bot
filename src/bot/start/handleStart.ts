import TelegramBot, { Message } from "node-telegram-bot-api";
import User from "../../db/models/user";
import { welcomeMessage } from "../messages";

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
