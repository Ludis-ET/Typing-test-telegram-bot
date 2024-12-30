"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bot = void 0;
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const handleStart_1 = require("./start/handleStart");
const setupCallbackQueryListener_1 = require("./start/setupCallbackQueryListener");
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token)
    throw new Error("TELEGRAM_BOT_TOKEN is not defined in environment variables");
exports.bot = new node_telegram_bot_api_1.default(token, { polling: true });
exports.bot.onText(/\/start/, (msg) => (0, handleStart_1.handleHomeCallback)(exports.bot, msg));
(0, setupCallbackQueryListener_1.setupCallbackQueryListener)(exports.bot);
