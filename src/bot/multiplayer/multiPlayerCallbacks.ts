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
    bot.deleteMessage(chatId, query.message!.message_id).catch(() => {});
    bot.sendMessage(
      chatId,
      `🎉 *Welcome to the Random Match Arena\\!* 🎮  
      
      \\> 💭 *Feeling lucky today\\?* Take on the challenge with a stranger in a random room\\!  

      ➡️ What would you like to do\\?  
      
      🔹 *Create a New Room* — Be the host of the game and wait for others to join\\.  
      🔹 *Join Randomly* — Instantly jump into an existing room and start the fun\\!`,
      {
        parse_mode: "MarkdownV2",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🆕 Create New Room",
                callback_data: "multi_create_room_random",
              },
              { text: "🔀 Join Randomly", callback_data: "multi_join_random" },
            ],
            [{ text: "🏘 Home", callback_data: "restart_game" }],
          ],
        },
      }
    );
  } else if (data === "multi_create_room_random") {
    bot.deleteMessage(chatId, query.message!.message_id).catch(() => {});
    try {
      const roomId = uuidv4();
      await createRoom("random", roomId, { telegramId: userId, username });
      bot.sendMessage(
        chatId,
        `🎉 *Room Created Successfully\\!* 🏠  

🔑 Your Room ID: ||${roomId}||  

Share this room with your friends or wait for a random player to join\\.  
Once ready, *you* can start the game as the host\\.  

✨ _Let the fun begin!_`,
        {
          parse_mode: "MarkdownV2",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "🚀 Start Game",
                  callback_data: `start_game_${roomId}`,
                },
                { text: "🏘 Home", callback_data: "restart_game" },
              ],
            ],
          },
        }
      );
    } catch (error) {
      bot.sendMessage(
        chatId,
        "⚠️ Something went wrong while creating the room. Please try again."
      );
    }
  }
};
