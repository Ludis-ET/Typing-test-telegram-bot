import express from "express";
import TelegramBot, { Message } from "node-telegram-bot-api";
import dotenv from "dotenv";

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  throw new Error(
    "TELEGRAM_BOT_TOKEN is not defined in the environment variables"
  );
}
const bot = new TelegramBot(token, { polling: true });

app.use(express.json());

