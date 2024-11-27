import TelegramBot, { CallbackQuery, Message } from "node-telegram-bot-api";
import { SinglePlayerMessage } from "../messages";
import { startDurationChallenge, startTextCountChallenge } from "./start";
import { handleHomeCallback } from "../start/handleStart";

export const gameState: {
  [key: number]: { intervalId?: NodeJS.Timeout; gameOver: boolean };
} = {};
export const userChoices: {
  [key: number]: { difficulty: string; textCount?: string; duration?: string };
} = {};
export const userAnswers: { [key: number]: string } = {};
export const startTime: { [key: number]: number } = {};

export const singlePlayerHandler = (bot: TelegramBot, chatId: number) => {
  bot.sendMessage(chatId, SinglePlayerMessage(), {
    parse_mode: "MarkdownV2",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🟢 Easy", callback_data: "easy" },
          { text: "🟡 Medium", callback_data: "medium" },
        ],
        [
          { text: "🔴 Hard", callback_data: "hard" },
          { text: "🔥 Nightmare", callback_data: "nightmare" },
        ],
        [{ text: "🏘 Home", callback_data: "restart_game" }],
      ],
    },
  });
};

export const setupCallbackQueryListener2 = (
  bot: TelegramBot,
  query: CallbackQuery,
  chatId: number,
  data: string
) => {
  if (!data) return;

  if (["easy", "medium", "hard", "nightmare"].includes(data)) {
    if (!userChoices[chatId])
      userChoices[chatId] = {
        difficulty: "",
        textCount: undefined,
        duration: undefined,
      };

    userChoices[chatId].difficulty = data;
    bot.deleteMessage(chatId, query.message!.message_id).catch(() => {});
    bot.sendMessage(chatId, "🎯 Great choice\\! Choose the challenge mode:", {
      parse_mode: "MarkdownV2",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "⌨️ Word Count", callback_data: "word_count_mode" },
            { text: "🕰 Duration", callback_data: "duration_mode" },
          ],
        ],
      },
    });
  } else if (data === "word_count_mode") {
    bot.deleteMessage(chatId, query.message!.message_id).catch(() => {});
    bot.sendMessage(chatId, "🔢 Select the number of words:", {
      parse_mode: "MarkdownV2",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "20 words 📝", callback_data: "20" },
            { text: "40 words 📝", callback_data: "40" },
          ],
          [
            { text: "60 words 📝", callback_data: "60" },
            { text: "100 words 📝", callback_data: "100" },
          ],
          [{ text: "🏠 Home", callback_data: "restart_game" }],
        ],
      },
    });
  } else if (data === "duration_mode") {
    bot.deleteMessage(chatId, query.message!.message_id).catch(() => {});
    bot.sendMessage(chatId, "⏱ Select the challenge duration:", {
      parse_mode: "MarkdownV2",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "15 seconds ⏱️", callback_data: "15sec" },
            { text: "30 seconds ⏱️", callback_data: "30sec" },
          ],
          [
            { text: "1 minute 🕐", callback_data: "1min" },
            { text: "3 minutes 🕒", callback_data: "3min" },
          ],
          [{ text: "🏠 Home", callback_data: "restart_game" }],
        ],
      },
    });
  } else if (["20", "40", "60", "100"].includes(data)) {
    userChoices[chatId].textCount = data;
    bot.deleteMessage(chatId, query.message!.message_id).catch(() => {});
    startTextCountChallenge(
      bot,
      chatId,
      { textCount: data },
      userChoices[chatId].difficulty
    );
  } else if (["15sec", "30sec", "1min", "3min"].includes(data)) {
    userChoices[chatId].duration = data;
    bot.deleteMessage(chatId, query.message!.message_id).catch(() => {});
    startDurationChallenge(
      bot,
      chatId,
      { duration: data },
      userChoices[chatId].difficulty
    );
  } else if (data === "stop_challenge") {
    if (gameState[chatId]?.intervalId)
      clearInterval(gameState[chatId].intervalId);
    gameState[chatId] = { intervalId: undefined, gameOver: true };

    const userChoice = userChoices[chatId];
    bot.deleteMessage(chatId, query.message!.message_id).catch(() => {});
    bot.sendMessage(
      chatId,
      "⏹ Challenge stopped\\. What would you like to do next\\?",
      {
        parse_mode: "MarkdownV2",
        reply_markup: {
          inline_keyboard: [
            [
              { text: "🔄 Restart", callback_data: "restart_challenge" },
              { text: "🏘 Home", callback_data: "restart_game" },
            ],
          ],
        },
      }
    );
  } else if (data === "restart_challenge") {
    const userChoice = userChoices[chatId];
    bot.deleteMessage(chatId, query.message!.message_id).catch(() => {});
    if (!userChoice.textCount && !userChoice.duration) {
      bot.sendMessage(chatId, "❌ unable to restart\\!");
      handleHomeCallback(bot, query.message as Message);
    }
    if (userChoice.textCount) {
      startTextCountChallenge(
        bot,
        chatId,
        { textCount: userChoice.textCount },
        userChoice.difficulty
      );
    } else if (userChoice.duration) {
      startDurationChallenge(
        bot,
        chatId,
        { duration: userChoice.duration },
        userChoice.difficulty
      );
    }
  }
};
