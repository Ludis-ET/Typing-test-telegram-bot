import { v4 as uuidv4 } from "uuid";
import {
  createRoom,
  addPlayerToRoom,
  fetchRoom,
  updateRoomAvailability,
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
    bot.sendMessage(
      chatId,
      `🎉 *Welcome to the Random Match Arena\\!* 🎮  
      
      🔹 *Create a New Room*: Be the host and wait for others to join\\.  
      🔹 *Join Randomly*: Instantly jump into an existing room and start the fun\\.`,
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
    try {
      const roomId = uuidv4();
      await createRoom("random", roomId, {
        telegramId: userId,
        username,
        isCreator: true,
      });
      bot.sendMessage(
        chatId,
        `🎉 *Room Created Successfully\\!* 🏠  
        
        🔑 Room ID: ||${roomId}||  
        
        Share this room with others or wait for a random player\\.  
        You can start the game as the host when ready\\. 🚀`,
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
      bot.sendMessage(chatId, "⚠️ Unable to create room. Please try again.");
    }
  } else if (data === "multi_join_random") {
    try {
      const room = await fetchRoom({ type: "random", isAvailable: true });
      if (room) {
        await addPlayerToRoom(room._id, { telegramId: userId, username });
        await updateRoomAvailability(room._id, false);
        bot.sendMessage(
          chatId,
          `🎉 *You joined a random match\\!* 🏠  
          
          Room ID: ||${room._id}||  
          
          Waiting for the host to start\\. 🚀`,
          { parse_mode: "MarkdownV2" }
        );
        bot.sendMessage(
          room.players[0].telegramId,
          `👤 *A new player has joined your room\\!* 🎉  
          
          Room ID: ||${room._id}||  
          
          Start the game when you're ready\\. 🚀`,
          { parse_mode: "MarkdownV2" }
        );
      } else {
        bot.sendMessage(chatId, "⚠️ No rooms available. Create one instead!");
      }
    } catch (error) {
      bot.sendMessage(
        chatId,
        "⚠️ Unable to join random match. Please try again."
      );
    }
  } else if (data === "multi_friend_match") {
    bot.sendMessage(
      chatId,
      `👥 *Friend Match\\!* 🎮  

      🔹 *Create a Room*: Get a unique code to share with friends\\.  
      🔹 *Join a Room*: Enter a shared code to join your friends' match\\.`,
      {
        parse_mode: "MarkdownV2",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🆕 Create Room",
                callback_data: "multi_create_room_friend",
              },
              { text: "🔑 Join Room", callback_data: "multi_join_friend" },
            ],
            [{ text: "🏘 Home", callback_data: "restart_game" }],
          ],
        },
      }
    );
  } else if (data === "multi_create_room_friend") {
    try {
      const roomKey = uuidv4().split("-")[0];
      await createRoom("friend", roomKey, {
        telegramId: userId,
        username,
        isCreator: true,
      });
      bot.sendMessage(
        chatId,
        `👥 *Room Created Successfully\\!* 🏠  

        Share this code with your friends to join: ||${roomKey}||  
        
        You can start the game once everyone has joined\\. 🚀`,
        {
          parse_mode: "MarkdownV2",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "🚀 Start Game",
                  callback_data: `multi_random_start_game_${roomKey}`,
                },
                { text: "🏘 Home", callback_data: "restart_game" },
              ],
            ],
          },
        }
      );
    } catch (error) {
      bot.sendMessage(chatId, "⚠️ Unable to create room. Please try again.");
    }
  } else if (data === "multi_join_friend") {
    bot.sendMessage(chatId, "🔑 Enter the room code shared by your friend:");
    // Logic to handle friend code input
  } else if (data.startsWith("multi_random_start_game_")) {
    const roomId = data.split("_")[2];
    const room = await fetchRoom({ _id: roomId });
    if (room && room.players[0].telegramId === userId.toString()) {
      bot.sendMessage(
        chatId,
        "🚀 The game has started! Good luck to all players!"
      );
    } else {
      bot.sendMessage(chatId, "⚠️ Only the room creator can start the game.");
    }
  }
};
