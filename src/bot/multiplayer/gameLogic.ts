import TelegramBot from "node-telegram-bot-api";
import { fetchRoom, saveGameSettings } from "../../db/RoomManagement";
import { GameStart } from "./start";

export const startGame = async (
  bot: TelegramBot,
  chatId: number,
  roomId: string,
  userId: number
) => {
  try {
    const room = await fetchRoom({ _id: roomId });

    if (!room) {
      bot.sendMessage(chatId, "⚠️ Room not found\\. Please try again\\.", {
        parse_mode: "MarkdownV2",
        reply_markup: {
          inline_keyboard: [
            [{ text: "🏘 Home", callback_data: "restart_game" }],
          ],
        },
      });
      return;
    }

    if (room.players[0].telegramId !== userId.toString()) {
      bot.sendMessage(
        chatId,
        "⚠️ Only the room creator can start the game\\.",
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

    if (room.players.length < 2) {
      bot.sendMessage(
        chatId,
        "⚠️ At least two players are required to start the game\\.",
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

    const difficultyMessage = await bot.sendMessage(
      chatId,
      "🎯 *Select Difficulty Level*\n\nChoose how challenging the game should be\\:",
      {
        parse_mode: "MarkdownV2",
        reply_markup: {
          inline_keyboard: [
            [
              { text: "🟢 Easy", callback_data: "difficulty_easy" },
              { text: "🟡 Medium", callback_data: "difficulty_medium" },
            ],
            [
              { text: "🔴 Hard", callback_data: "difficulty_hard" },
              { text: "⚫ Nightmare", callback_data: "difficulty_nightmare" },
            ],
          ],
        },
      }
    );

    bot.once("callback_query", async (difficultyQuery) => {
      bot.deleteMessage(chatId, difficultyMessage.message_id).catch(() => {});
      const difficulty = (difficultyQuery.data?.split("_")[1] || "medium") as
        | "easy"
        | "medium"
        | "hard"
        | "nightmare";

      const modeMessage = await bot.sendMessage(
        chatId,
        "⌛ *Select Game Mode*\n\nDo you want to play by time or word count\\?",
        {
          parse_mode: "MarkdownV2",
          reply_markup: {
            inline_keyboard: [
              [
                { text: "⏳ Time", callback_data: "game_mode_time" },
                { text: "📝 Word Count", callback_data: "game_mode_words" },
              ],
            ],
          },
        }
      );

      bot.once("callback_query", async (modeQuery) => {
        bot.deleteMessage(chatId, modeMessage.message_id).catch(() => {});
        const mode: "time" | "word_count" =
          modeQuery.data === "game_mode_time" ? "time" : "word_count";

        const optionsMessage = await bot.sendMessage(
          chatId,
          mode === "time"
            ? "⏳ *Select Duration*\n\nHow long should the game last\\?"
            : "📝 *Select Word Count*\n\nHow many words should the game include\\?",
          {
            parse_mode: "MarkdownV2",
            reply_markup: {
              inline_keyboard:
                mode === "time"
                  ? [
                      [
                        { text: "15 seconds", callback_data: "duration_15" },
                        { text: "30 seconds", callback_data: "duration_30" },
                      ],
                      [
                        { text: "1 minute", callback_data: "duration_60" },
                        { text: "3 minutes", callback_data: "duration_180" },
                        { text: "5 minutes", callback_data: "duration_300" },
                      ],
                    ]
                  : [
                      [
                        { text: "20 words", callback_data: "words_20" },
                        { text: "50 words", callback_data: "words_50" },
                      ],
                      [
                        { text: "80 words", callback_data: "words_80" },
                        { text: "100 words", callback_data: "words_100" },
                      ],
                    ],
            },
          }
        );

        bot.once("callback_query", async (optionQuery) => {
          bot.deleteMessage(chatId, optionsMessage.message_id).catch(() => {});
          const value = parseInt(optionQuery.data?.split("_")[1] || "60", 10);

          const settings = { difficulty, mode, value };

          try {
            await saveGameSettings(roomId, settings);
            GameStart(bot, room.players, settings);
          } catch {
            bot.sendMessage(
              chatId,
              "⚠️ Unable to start the game\\. Please try again\\.",
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
      });
    });
  } catch {
    bot.sendMessage(chatId, "⚠️ An error occurred\\. Please try again\\.", {
      parse_mode: "MarkdownV2",
      reply_markup: {
        inline_keyboard: [[{ text: "🏘 Home", callback_data: "restart_game" }]],
      },
    });
  }
};
