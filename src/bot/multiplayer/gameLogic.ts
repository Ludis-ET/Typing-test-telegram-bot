import TelegramBot from "node-telegram-bot-api";
import { fetchRoom } from "../../db/RoomManagement";

export const startGame = async (
  bot: TelegramBot,
  chatId: number,
  roomId: string,
  userId: number
) => {
  try {
    const room = await fetchRoom({ _id: roomId });

    if (!room) {
      bot.sendMessage(chatId, "⚠️ Room not found. Please try again.", {
        reply_markup: {
          inline_keyboard: [
            [{ text: "🏘 Home", callback_data: "restart_game" }],
          ],
        },
      });
      return;
    }

    if (room.players[0].telegramId !== userId.toString()) {
      bot.sendMessage(chatId, "⚠️ Only the room creator can start the game.", {
        reply_markup: {
          inline_keyboard: [
            [{ text: "🏘 Home", callback_data: "restart_game" }],
          ],
        },
      });
      return;
    }

    bot.sendMessage(
      chatId,
      "🚀 The game has started! Good luck to all players!",
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "🏘 Home", callback_data: "restart_game" }],
          ],
        },
      }
    );

    room.players.forEach((player) => {
      bot.sendMessage(
        player.telegramId,
        "🎮 The game has started! Good luck!",
        {
          parse_mode: "MarkdownV2",
        }
      );
    });
  } catch (error) {
    console.error("Error starting game:", error);
    bot.sendMessage(chatId, "⚠️ Unable to start the game. Please try again.", {
      reply_markup: {
        inline_keyboard: [[{ text: "🏘 Home", callback_data: "restart_game" }]],
      },
    });
  }
};
