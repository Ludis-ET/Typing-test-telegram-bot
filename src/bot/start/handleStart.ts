import TelegramBot, { CallbackQuery, Message } from "node-telegram-bot-api";
import user from "../../db/models/user";
import { welcomeMessageCaption } from "../messages";

export const handleHomeCallback = async (bot: TelegramBot, msg: Message) => {
  const chatId = msg.chat.id;
  const {
    id: telegramId,
    username,
    first_name: firstName,
    last_name: lastName,
  } = msg.from!;

  await user.findOneAndUpdate(
    { telegramId },
    { username, firstName, lastName },
    { upsert: true, new: true }
  );

  const sentMessage = await bot.sendPhoto(
    chatId,
    "https://i.ibb.co/Z6XNt56/IMG-20241122-200510-961.png",
    {
      caption: welcomeMessageCaption(firstName || "Player"),
      parse_mode: "MarkdownV2",
      reply_markup: {
        inline_keyboard: [
          [{ text: "🎮 Single Player", callback_data: "single_player" }],
          [{ text: "👥 Multiplayer", callback_data: "multiplayer" }],
        ],
      },
    }
  );

  if (sentMessage.message_id) {
    bot.on("callback_query", async (query: CallbackQuery) => {
      if (query.message?.message_id === sentMessage.message_id) {
        await bot.deleteMessage(chatId, sentMessage.message_id);
      }
    });
  }
};
