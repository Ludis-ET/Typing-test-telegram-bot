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
  bot.deleteMessage(chatId, query.message!.message_id).catch(() => {});

  if (data === "multi_random_match") {
    bot.sendMessage(chatId, "🎉 *Random Match Arena Coming Soon\\!* 🚧", {
      parse_mode: "MarkdownV2",
      reply_markup: {
        inline_keyboard: [[{ text: "🏘 Home", callback_data: "restart_game" }]],
      },
    });
  } else if (data === "multi_create_room_friend") {
    try {
      const roomKey = uuidv4().split("-")[0]; // Generate a short, readable room ID
      await createRoom("friend", roomKey, {
        telegramId: userId,
        username,
        isCreator: true,
      });

      bot.sendMessage(
        chatId,
        `👥 *Room Created Successfully\\!* 🏠  

        Share this room ID with your friends to join:  
        \`\`\`${roomKey}\`\`\`  
        
        You can start the game once everyone has joined\\. 🚀`,
        {
          parse_mode: "MarkdownV2",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "🚀 Start Game",
                  callback_data: `multi_start_game_${roomKey}`,
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
    bot.sendMessage(chatId, "🔑 Please enter the Room ID to join:");
    bot.once("message", async (msg) => {
      if (!msg.text) return;

      const roomKey = msg.text.trim();
      const room = await fetchRoom({ _id: roomKey });

      if (!room) {
        bot.sendMessage(chatId, "⚠️ Invalid Room ID. Please try again.");
        return;
      }

      if (room.players.find((player) => player.telegramId === userId.toString())) {
        bot.sendMessage(chatId, "⚠️ You are already in this room!");
        return;
      }

      if (room.players.length >= 10) {
        bot.sendMessage(chatId, "⚠️ This room is full. Please join another.");
        return;
      }

      await addPlayerToRoom(roomKey, { telegramId: userId, username });

      // Notify all members of the room about the new player
      room.players.forEach((player) => {
        bot.sendMessage(
          player.telegramId,
          `👤 *${username}* has joined your room! 🎉  
          
          Room ID: \`\`\`${roomKey}\`\`\``,
          { parse_mode: "MarkdownV2" }
        );
      });

      bot.sendMessage(
        chatId,
        `🎉 *You joined the room successfully\\!* 🏠  

        Room ID: \`\`\`${roomKey}\`\`\`  
        
        Wait for the creator to start the game\\. 🚀`,
        { parse_mode: "MarkdownV2" }
      );
    });
  } else if (data.startsWith("multi_start_game_")) {
    const roomId = data.split("_")[2];
    const room = await fetchRoom({ _id: roomId });

    if (!room) {
      bot.sendMessage(chatId, "⚠️ Room not found. Please try again.");
      return;
    }

    if (room.players[0].telegramId !== userId.toString()) {
      bot.sendMessage(chatId, "⚠️ Only the room creator can start the game.");
      return;
    }

    bot.sendMessage(
      chatId,
      "🚀 The game has started! Good luck to all players!"
    );

    // Notify all players
    room.players.forEach((player) => {
      bot.sendMessage(
        player.telegramId,
        "🎮 *The game has started\\!* Good luck!",
        { parse_mode: "MarkdownV2" }
      );
    });
  }
};
