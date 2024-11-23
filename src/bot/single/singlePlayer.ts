import TelegramBot, { CallbackQuery } from "node-telegram-bot-api";
import { SinglePlayerMessage } from "../messages";
import { startTextChallenge } from "./start";

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
            { text: "By Word Count", callback_data: "word_count_mode" },
            { text: "By Duration", callback_data: "duration_mode" },
          ],
        ],
      },
    });
  } else if (data === "word_count_mode") {
    bot.sendMessage(chatId, "🔢 Select the number of words:", {
      parse_mode: "MarkdownV2",
      reply_markup: {
        inline_keyboard: [
          [{ text: "20 words", callback_data: "20" }],
          [{ text: "40 words", callback_data: "40" }],
          [{ text: "60 words", callback_data: "60" }],
          [{ text: "100 words", callback_data: "100" }],
        ],
      },
    });
  } else if (data === "duration_mode") {
    bot.sendMessage(chatId, "⏱ Select the challenge duration:", {
      parse_mode: "MarkdownV2",
      reply_markup: {
        inline_keyboard: [
          [{ text: "15 seconds", callback_data: "15sec" }],
          [{ text: "30 seconds", callback_data: "30sec" }],
          [{ text: "1 minute", callback_data: "1min" }],
          [{ text: "3 minutes", callback_data: "3min" }],
        ],
      },
    });
  } else if (["20", "40", "60", "100"].includes(data)) {
    userChoices[chatId].textCount = data;
    bot.deleteMessage(chatId, query.message!.message_id).catch(() => {});
    startTextChallenge(
      bot,
      chatId,
      { textCount: data },
      userChoices[chatId].difficulty
    );
  } else if (["15sec", "30sec", "1min", "3min"].includes(data)) {
    userChoices[chatId].duration = data;
    bot.deleteMessage(chatId, query.message!.message_id).catch(() => {});
    startTextChallenge(
      bot,
      chatId,
      { duration: data },
      userChoices[chatId].difficulty
    );
  } else if (data === "stop_challenge") {
    if (gameState[chatId]?.intervalId)
      clearInterval(gameState[chatId].intervalId);
    gameState[chatId] = { intervalId: undefined, gameOver: true };
    bot.deleteMessage(chatId, query.message!.message_id).catch(() => {});
    bot.sendMessage(chatId, "⏹ Challenge stopped. Try again later.");
  }
};
