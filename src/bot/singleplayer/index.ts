import TelegramBot from "node-telegram-bot-api";
import { SinglePlayerMessage } from "../messages";
import { generateParagraph } from "../utils/generateP";

const userChoices: { [key: number]: { difficulty: string; duration: string } } =
  {};

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

  const intervalId = setInterval(() => {
    if (timeRemaining <= 0) {
      clearInterval(intervalId);
      bot
        .sendMessage(chatId, "⏰ Time's up! Challenge over.")
        .catch((error) => {
          console.log("Error sending message: 1");
        });
    } else {
      // Delete the previous message if it's available
      if (messageId) {
        bot.deleteMessage(chatId, messageId).catch((error) => {
          console.log("Error deleting message: 2");
        });
      }

      // Send a new message with the updated countdown and save the messageId
      bot
        .sendMessage(chatId, `Time left: ${timeRemaining} seconds`)
        .then((sentMessage) => {
          messageId = sentMessage.message_id; // Store the new message ID
        })
        .catch((error) => {
          console.log("Error sending message: 3");
        });

      timeRemaining -= 5;
    }
  }, 5000);
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

    bot.deleteMessage(chatId, query.message!.message_id); // Delete the current message
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

    bot.deleteMessage(chatId, query.message!.message_id); // Delete the current message
    bot.sendMessage(
      chatId,
      `🎉 You have selected:\n\nDifficulty: *${userChoices[chatId].difficulty}*\nDuration: *${userChoices[chatId].duration}*\n\nGet ready to start the challenge! 💥`
    );

    // Generate paragraph and send it
    const paragraph = generateParagraph(
      userChoices[chatId].difficulty,
      userChoices[chatId].duration
    );
    bot.sendMessage(chatId, paragraph);

    // Start the countdown
    startCountdown(bot, chatId, userChoices[chatId].duration);
  };

