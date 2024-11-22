import TelegramBot from "node-telegram-bot-api";
import { handleStart, handleCallbackQuery } from "./handlers";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token)
  throw new Error("TELEGRAM_BOT_TOKEN is not defined in environment variables");

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, handleStart(bot));
bot.on("callback_query", handleCallbackQuery(bot));
