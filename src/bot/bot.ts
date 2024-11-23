import TelegramBot from "node-telegram-bot-api";
import { handleMessage } from "./handlers";
import { handleStart } from "./start/handleStart";
import { setupCallbackQueryListener } from "./singlePlayer";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token)
  throw new Error("TELEGRAM_BOT_TOKEN is not defined in environment variables");

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, handleStart(bot));
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const buttonText = msg.text;

  if (buttonText) {
    handleMessage(bot, chatId, buttonText);
  }
});

setupCallbackQueryListener(bot);