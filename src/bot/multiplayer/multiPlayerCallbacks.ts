import { v4 as uuidv4 } from "uuid";
import {
  createRoom,
  addPlayerToRoom,
  fetchRoom,
} from "../../db/RoomManagement";
import TelegramBot, { CallbackQuery } from "node-telegram-bot-api";
import { startGame } from "./gameLogic";

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
    bot.sendMessage(chatId, "🎉 Random Match Arena Coming Soon 🚧", {
      parse_mode: "MarkdownV2",
      reply_markup: {
        inline_keyboard: [[{ text: "🏘 Home", callback_data: "restart_game" }]],
      },
    });
  } else if (data === "multi_friend_match") {
    bot.sendMessage(
      chatId,
      "👥 Friend Match Options 🎮\n\n🔹 Create a Room: Start a private match and invite friends\n🔹 Join a Room: Enter a Room ID to join an existing match",
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
        telegramId: userId.toString(),
        username,
        isCreator: true,
      });

      bot.sendMessage(
        chatId,
        `👥 Room Created Successfully 🏠\n\nShare this room ID with your friends to join:\n\n\`${roomKey}\`\n\nYou can start the game once everyone has joined 🚀`,
        {
          parse_mode: "MarkdownV2",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "🚀 Start Game",
                  callback_data: `multi_start_game_${roomKey}`,
                },
              ],
              [{ text: "🏘 Home", callback_data: "restart_game" }],
            ],
          },
        }
      );
    } catch {
      bot.sendMessage(
        chatId,
        "⚠️ Unable to create room\\. Please try again\\.",
        {
          parse_mode: "MarkdownV2",
          reply_markup: {
            inline_keyboard: [
              [{ text: "🏘 Home", callback_data: "restart_game" }],
            ],
          },
        }
      );
    }
  } else if (data === "multi_join_friend") {
    bot.sendMessage(chatId, "🔑 Please enter the Room ID to join:");

    bot.once("message", async (msg) => {
      if (!msg.text) {
        bot.sendMessage(chatId, "⚠️ Please provide a valid Room ID\\.", {
          parse_mode: "MarkdownV2",
          reply_markup: {
            inline_keyboard: [
              [{ text: "🏘 Home", callback_data: "restart_game" }],
            ],
          },
        });
        return;
      }

      const roomKey = msg.text.trim();
      try {
        const room = await fetchRoom({ _id: roomKey });

        if (!room) {
          bot.sendMessage(chatId, "⚠️ Invalid Room ID\\. Please try again\\.", {
            parse_mode: "MarkdownV2",
            reply_markup: {
              inline_keyboard: [
                [{ text: "🏘 Home", callback_data: "restart_game" }],
              ],
            },
          });
          return;
        }

        if (
          room.players.some((player) => player.telegramId === userId.toString())
        ) {
          bot.sendMessage(chatId, "⚠️ You are already in this room\\!", {
            parse_mode: "MarkdownV2",
            reply_markup: {
              inline_keyboard: [
                [{ text: "🏘 Home", callback_data: "restart_game" }],
              ],
            },
          });
          return;
        }

        if (room.players.length >= 10) {
          bot.sendMessage(
            chatId,
            "⚠️ This room is full\\. Please join another\\.",
            {
              parse_mode: "MarkdownV2",
              reply_markup: {
                inline_keyboard: [
                  [{ text: "🏘 Home", callback_data: "restart_game" }],
                ],
              },
            }
          );
          return;
        }

        await addPlayerToRoom(roomKey, { telegramId: userId.toString(), username, isCreator: false });

        room.players.forEach((player) => {
          bot.sendMessage(
            player.telegramId,
            `👤 ${username} has joined your room\\! 🎉\n\nRoom ID: \`${roomKey}\``,
            {
              parse_mode: "MarkdownV2",
            }
          );
        });

        bot.sendMessage(
          chatId,
          `🎉 You joined the room successfully\\! 🏠\n\nRoom ID: \`${roomKey}\`\n\nWait for the creator to start the game\\. 🚀`,
          {
            parse_mode: "MarkdownV2",
            reply_markup: {
              inline_keyboard: [
                [{ text: "🏘 Home", callback_data: "restart_game" }],
              ],
            },
          }
        );
      } catch {
        bot.sendMessage(
          chatId,
          "⚠️ Unable to join the room\\. Please try again\\.",
          {
            parse_mode: "MarkdownV2",
            reply_markup: {
              inline_keyboard: [
                [{ text: "🏘 Home", callback_data: "restart_game" }],
              ],
            },
          }
        );
      }
    });
  } else if (data.startsWith("multi_start_game_")) {
    const roomId = data.split("_")[3];
    await startGame(bot, chatId, roomId, userId);
  }
};
