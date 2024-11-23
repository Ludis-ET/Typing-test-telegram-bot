import TelegramBot from "node-telegram-bot-api";
import { handleMessage } from "./handlers";
import { handleHomeCallback } from "./start/handleStart";
import { setupCallbackQueryListener } from "./start/setupCallbackQueryListener";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token)
  throw new Error("TELEGRAM_BOT_TOKEN is not defined in environment variables");

export const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => handleHomeCallback(bot, msg));
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const buttonText = msg.text;

  if (buttonText) {
    handleMessage(bot, chatId, buttonText);
  }
});

setupCallbackQueryListener(bot);
