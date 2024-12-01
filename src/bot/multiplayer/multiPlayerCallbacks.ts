import { v4 as uuidv4 } from "uuid";
import {
  createRoom,
  addPlayerToRoom,
  fetchRoom,
} from "../../db/RoomManagement";
import TelegramBot, { CallbackQuery } from "node-telegram-bot-api";

export const multiPlayerCallbacks = async (
  bot: TelegramBot,
  query: CallbackQuery,
  chatId: number,
  data: string
) => {
  if (!data) return;

  const userId = query.from.id;
  const username = query.from.username || "Anonymous";

  if (data === "multi_random_match") {
    try {
      const room = await fetchRoom({ type: "random", isAvailable: true });
      if (room) {
        await addPlayerToRoom(room._id, { telegramId: userId, username });
        bot.sendMessage(
          chatId,
          `🔀 You joined a random match! Room ID: ${room._id}. You can start when you’re ready.`
        );
      } else {
        const roomId = uuidv4();
        await createRoom("random", roomId, { telegramId: userId, username });
        bot.sendMessage(
          chatId,
          "🔀 You've created a random match! Waiting for another player..."
        );
      }
    } catch (error) {
      bot.sendMessage(chatId, "⚠️ Something went wrong. Please try again.");
    }
  } else if (data === "multi_friend_match") {
    bot.sendMessage(
      chatId,
      `👥 Want to play with friends? You can either create a new match or join an existing one.  
      Choose wisely! Here’s what you can do:`
    );

    bot.sendMessage(
      chatId,
      "🎮 1. Create a new match and share the code with your friends. 🎮 2. Join an existing match with a unique room code."
    );

    bot.sendMessage(
      chatId,
      "👉 Type /create to create a match or /join to join a match."
    );
  } else if (data.startsWith("multi_friend_join_")) {
    try {
      const roomKey = data.split("_")[3];
      const room = await fetchRoom({ _id: roomKey, type: "friend" });
      if (room) {
        await addPlayerToRoom(roomKey, { telegramId: userId, username });
        bot.sendMessage(chatId, `👥 You joined the match! Room ID: ${roomKey}`);
      } else {
        bot.sendMessage(chatId, "⚠️ Invalid or full room code.");
      }
    } catch (error) {
      bot.sendMessage(chatId, "⚠️ Something went wrong. Please try again.");
    }
  } else {
    bot.sendMessage(chatId, "⚠️ Invalid action.");
  }
};
