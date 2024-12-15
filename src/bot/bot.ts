import TelegramBot from "node-telegram-bot-api";
import { handleHomeCallback } from "./start/handleStart";
import { setupCallbackQueryListener } from "./start/setupCallbackQueryListener";

const token = process.env.TELEGRAM_BOT_TOKEN;
const serverUrl = process.env.SERVER_URL;

if (!token || !serverUrl) {
  throw new Error(
    "TELEGRAM_BOT_TOKEN and SERVER_URL must be defined in environment variables"
  );
}

export const bot = new TelegramBot(token, { webHook: true });
bot.setWebHook(`${serverUrl}/`);

bot.onText(/\/start/, (msg) => handleHomeCallback(bot, msg));
setupCallbackQueryListener(bot);
