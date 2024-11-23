import TelegramBot from "node-telegram-bot-api";
import SinglePlay from "../db/models/singlePlay";
import { bot } from "./bot";
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
  timeRemaining -= 5;

  const intervalId = setInterval(() => {
    if (timeRemaining <= 0) {
      clearInterval(intervalId);
      if (messageId) {
        bot.deleteMessage(chatId, messageId).catch(() => {});
      }

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
          .sendMessage(chatId, `⏰ ${timeRemaining} seconds left...`, {
            reply_markup: {
              inline_keyboard: [
                [{ text: "🔄 Restart", callback_data: "restart_game" }],
              ],
            },
          })
          .then((sentMessage) => {
            messageId = sentMessage.message_id;
          })
          .catch(() => {});
      } else {
        bot
          .editMessageText(`⏰ ${timeRemaining} seconds left...`, {
            chat_id: chatId,
            message_id: messageId,
            reply_markup: {
              inline_keyboard: [
                [{ text: "🔄 Restart", callback_data: "restart_game" }],
              ],
            },
          })
          .catch(() => {});
      }

      timeRemaining -= 5;
    }
  }, 5000);

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
        [{ text: "🟢 Easy", callback_data: "easy" }],
        [{ text: "🟡 Medium", callback_data: "medium" }],
        [{ text: "🔴 Hard", callback_data: "hard" }],
        [{ text: "🔥 Nightmare", callback_data: "nightmare" }],
      ],
    },
  });
};

export const handleDifficultySelection =
  (bot: TelegramBot) => (query: TelegramBot.CallbackQuery) => {
    const chatId = query.message!.chat.id;
    const { data } = query;

    if (!userChoices[chatId]) {
      userChoices[chatId] = { difficulty: "", duration: "" };
    }

    if (data) {
      userChoices[chatId].difficulty = data;
    }

    bot.deleteMessage(chatId, query.message!.message_id);
    bot.sendMessage(
      chatId,
      "🎯 Great choice! Now, select the duration for the challenge ⏱️:",
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "15 seconds ⏳", callback_data: "15sec" }],
            [{ text: "30 seconds ⏳", callback_data: "30sec" }],
            [{ text: "1 minute ⏰", callback_data: "1min" }],
            [{ text: "3 minutes ⏰", callback_data: "3min" }],
          ],
        },
      }
    );
  };

export const handleDurationSelection =
  (bot: TelegramBot) => (query: TelegramBot.CallbackQuery) => {
    const chatId = query.message!.chat.id;
    const { data } = query;

    if (!userChoices[chatId]) {
      userChoices[chatId] = { difficulty: "", duration: "" };
    }

    if (data) {
      userChoices[chatId].duration = data;
    }

    bot.deleteMessage(chatId, query.message!.message_id);

    if (gameState[chatId]?.intervalId) {
      clearInterval(gameState[chatId].intervalId);
    }

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

export const setupCallbackQueryListener = (bot: TelegramBot) => {
  bot.on("callback_query", async (query) => {
    const { data, message } = query;

    if (message && data) {
      const chatId = message.chat.id;

      if (["easy", "medium", "hard", "nightmare"].includes(data)) {
        handleDifficultySelection(bot)(query);
      } else if (["15sec", "30sec", "1min", "3min"].includes(data)) {
        handleDurationSelection(bot)(query);
      } else if (data === "restart_game") {
        if (gameState[chatId]?.intervalId) {
          clearInterval(gameState[chatId].intervalId);
        }
        gameState[chatId] = { intervalId: undefined, gameOver: false };

        bot.deleteMessage(chatId, query.message!.message_id).catch(() => {});
        const paragraph = generateParagraph(
          userChoices[chatId].difficulty,
          userChoices[chatId].duration
        );

        bot.sendMessage(chatId, "_🔄 Restarting the game\\.\\.\\._", {
          parse_mode: "MarkdownV2",
        });

        bot.sendMessage(chatId, paragraph, {
          protect_content: true,
          disable_web_page_preview: true,
        });

        userAnswers[chatId] = paragraph;
        startTime[chatId] = new Date().getTime();

        startCountdown(bot, chatId, userChoices[chatId].duration);
        return;
      } else if (data && data.startsWith("share_")) {
        const playId = data.split("_")[1];

        const singlePlay = await SinglePlay.findById(playId);
        if (!singlePlay) {
          return bot.sendMessage(
            message.chat.id,
            "Could not find the challenge data."
          );
        }

        const { difficulty, duration, wpm } = singlePlay;

        // Send a message with the challenge details and a button to join.
        const forwardedMessage = await bot.sendMessage(
          message.chat.id,
          forwardText(difficulty, duration, wpm, botUsername),
          {
            parse_mode: "MarkdownV2",
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Join the Challenge!",
                    url: `https://t.me/${botUsername}?start=${playId}`,
                  },
                ],
              ],
            },
          }
        );

        // Provide the share link with an appropriate call to action to share with friends.
        return bot.sendMessage(
          message.chat.id,
          "Click below to share this challenge with your friends! 🎉",
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Share with friends",
                    url: `https://t.me/${botUsername}?start=${playId}`,
                  },
                ],
              ],
            },
          }
        );
      }




    }
  });
};
