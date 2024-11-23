import TelegramBot, { Message } from "node-telegram-bot-api";
import User from "../../db/models/user";
import { welcomeMessageCaption } from "../messages";

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

  bot.sendPhoto(
    chatId,
    "https://i.ibb.co/Z6XNt56/IMG-20241122-200510-961.png",
    {
      caption: welcomeMessageCaption(firstName || "Player"),
      parse_mode: "MarkdownV2",
      reply_markup: {
        keyboard: [[{ text: "🎮 Single Player" }, { text: "👥 Multiplayer" }]],
        resize_keyboard: true,
        one_time_keyboard: false,
      },
    }
  );
};
