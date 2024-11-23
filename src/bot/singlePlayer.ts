import TelegramBot, { CallbackQuery } from "node-telegram-bot-api";
import SinglePlay from "../db/models/singlePlay";
import { generateParagraph } from "./utils/generateP";
import { generateWPM } from "./utils/generateWPM";
import { forwardText, SinglePlayerMessage } from "./messages";

const botUsername = process.env.BOT_USERNAME || "TypingChallengeBot";

const gameState: {
  [key: number]: { intervalId?: NodeJS.Timeout; gameOver: boolean };
} = {};
const userChoices: { [key: number]: { difficulty: string; duration: string } } =
  {};
const userAnswers: { [key: number]: string } = {};
const startTime: { [key: number]: number } = {};

const startCountdown = (bot: TelegramBot, chatId: number, duration: string) => {
  let timeRemaining: number;
  switch (duration) {
    case "15sec":
      timeRemaining = 15;
      break;
    case "30sec":
      timeRemaining = 30;
      break;
    case "1min":
      timeRemaining = 60;
      break;
    case "3min":
      timeRemaining = 180;
      break;
    default:
      timeRemaining = 15;
  }
  let messageId: number | undefined;
  gameState[chatId] = { intervalId: undefined, gameOver: false };
  const intervalId = setInterval(() => {
    if (timeRemaining <= 0) {
      clearInterval(intervalId);
      if (messageId) bot.deleteMessage(chatId, messageId).catch(() => {});
      const endTime = new Date().getTime();
      const timeSpent = (endTime - startTime[chatId]) / 1000;
      if (!gameState[chatId].gameOver) {
        gameState[chatId].gameOver = true;
        generateWPM(
          bot,
          chatId,
          userChoices[chatId].difficulty,
          userChoices[chatId].duration,
          userAnswers[chatId],
          "",
          timeSpent
        );
        bot.sendMessage(chatId, "🎴 Game over.").catch(() => {});
      }
    } else {
      if (!messageId) {
        bot
          .sendMessage(
            chatId,
            `⏰ ${timeRemaining} seconds left...(send it before the timer ends)`,
            {
              reply_markup: {
                inline_keyboard: [
                  [{ text: "🔄 Restart", callback_data: "restart_game" }],
                ],
              },
            }
          )
          .then((sentMessage) => (messageId = sentMessage.message_id))
          .catch(() => {});
      } else {
        bot
          .editMessageText(
            `⏰ ${timeRemaining} seconds left...(send it before the timer ends)`,
            {
              chat_id: chatId,
              message_id: messageId,
              reply_markup: {
                inline_keyboard: [
                  [{ text: "🔄 Restart", callback_data: "restart_game" }],
                ],
              },
            }
          )
          .catch(() => {});
      }
      timeRemaining -= 1;
    }
  }, 1000);
  gameState[chatId].intervalId = intervalId;
  bot.once("message", (msg) => {
    if (msg.chat.id === chatId && msg.text) {
      const typedMessage = msg.text.trim();
      const endTime = new Date().getTime();
      const timeSpent = (endTime - startTime[chatId]) / 1000;
      clearInterval(intervalId);
      if (!gameState[chatId].gameOver) {
        generateWPM(
          bot,
          chatId,
          userChoices[chatId].difficulty,
          userChoices[chatId].duration,
          userAnswers[chatId],
          typedMessage,
          timeSpent
        );
        if (typedMessage === userAnswers[chatId]) {
          gameState[chatId].gameOver = true;
          bot
            .sendMessage(chatId, "✅ You completed the challenge! Game over.")
            .catch(() => {});
        } else {
          gameState[chatId].gameOver = true;
          bot
            .sendMessage(chatId, "⏰ Time's up! Challenge over.")
            .catch(() => {});
        }
      }
    }
  });
};

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
      userChoices[chatId] = { difficulty: "", duration: "" };

    userChoices[chatId].difficulty = data;
    bot.deleteMessage(chatId, query.message!.message_id).catch(() => {});

    bot.sendMessage(
      chatId,
      "🎯 Great choice\\! Would you like the challenge by *time* or *words*\\?",
      {
        parse_mode: "MarkdownV2",
        reply_markup: {
          inline_keyboard: [
            [
              { text: "⏱ Time", callback_data: "time" },
              { text: "📝 Words", callback_data: "words" },
            ],
            [{ text: "🏘 Home", callback_data: "restart_game" }],
          ],
        },
      }
    );
  } else if (["time", "words"].includes(data)) {
    bot.deleteMessage(chatId, query.message!.message_id).catch(() => {});

    if (data === "time") {
      bot.sendMessage(chatId, "Select a duration:", {
        reply_markup: {
          inline_keyboard: [
            [{ text: "15 seconds ⏳", callback_data: "15sec" }],
            [{ text: "30 seconds ⏳", callback_data: "30sec" }],
            [{ text: "1 minute ⏰", callback_data: "1min" }],
            [{ text: "3 minutes ⏰", callback_data: "3min" }],
          ],
        },
      });
    } else {
      bot.sendMessage(chatId, "Select the number of words:", {
        reply_markup: {
          inline_keyboard: [
            [{ text: "20 words", callback_data: "20" }],
            [{ text: "40 words", callback_data: "40" }],
            [{ text: "60 words", callback_data: "60" }],
            [{ text: "100 words", callback_data: "100" }],
          ],
        },
      });
    }
  } else if (["15sec", "30sec", "1min", "3min"].includes(data)) {
    const handleDurationSelection =
      (bot: TelegramBot) => (query: TelegramBot.CallbackQuery) => {
        const chatId = query.message!.chat.id;
        userChoices[chatId].duration = query.data!;
        bot.deleteMessage(chatId, query.message!.message_id).catch(() => {});
        const paragraph = generateParagraph(
          userChoices[chatId].difficulty,
          userChoices[chatId].duration
        );
        bot.sendMessage(chatId, paragraph, {
          protect_content: true,
          disable_web_page_preview: true,
        });
        userAnswers[chatId] = paragraph;
        startTime[chatId] = new Date().getTime();
        startCountdown(bot, chatId, userChoices[chatId].duration);
      };
    handleDurationSelection(bot)(query);
  } else if (["20", "40", "60", "100"].includes(data)) {
    const handleWordSelection =
      (bot: TelegramBot) => (query: TelegramBot.CallbackQuery) => {
        const chatId = query.message!.chat.id;
        userChoices[chatId].duration = query.data!;
        bot.deleteMessage(chatId, query.message!.message_id).catch(() => {});
        const paragraph = generateParagraph(
          userChoices[chatId].difficulty,
          userChoices[chatId].duration
        );
        bot.sendMessage(chatId, paragraph, {
          protect_content: true,
          disable_web_page_preview: true,
        });
        userAnswers[chatId] = paragraph;
        startTime[chatId] = new Date().getTime();
        startCountdown(bot, chatId, userChoices[chatId].duration);
      };
    handleWordSelection(bot)(query);
  } else if (data === "restart_game") {
    if (gameState[chatId]?.intervalId)
      clearInterval(gameState[chatId].intervalId);
    gameState[chatId] = { intervalId: undefined, gameOver: false };
    bot.deleteMessage(chatId, query.message!.message_id).catch(() => {});
    const paragraph = generateParagraph(
      userChoices[chatId].difficulty,
      userChoices[chatId].duration
    );
    bot.sendMessage(chatId, "_🔄 Restarting the game..._", {
      parse_mode: "MarkdownV2",
    });
    bot.sendMessage(chatId, paragraph, {
      protect_content: true,
      disable_web_page_preview: true,
    });
    userAnswers[chatId] = paragraph;
    startTime[chatId] = new Date().getTime();
    startCountdown(bot, chatId, userChoices[chatId].duration);
  }
};
