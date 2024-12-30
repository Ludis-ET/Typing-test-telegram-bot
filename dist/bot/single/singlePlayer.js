"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupCallbackQueryListener2 = exports.singlePlayerHandler = exports.startTime = exports.userAnswers = exports.userChoices = exports.gameState = void 0;
const messages_1 = require("../messages");
const start_1 = require("./start");
const handleStart_1 = require("../start/handleStart");
exports.gameState = {};
exports.userChoices = {};
exports.userAnswers = {};
exports.startTime = {};
const singlePlayerHandler = (bot, chatId) => {
    bot.sendMessage(chatId, (0, messages_1.SinglePlayerMessage)(), {
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
exports.singlePlayerHandler = singlePlayerHandler;
const setupCallbackQueryListener2 = (bot, query, chatId, data) => {
    var _a;
    if (!data)
        return;
    if (["easy", "medium", "hard", "nightmare"].includes(data)) {
        if (!exports.userChoices[chatId])
            exports.userChoices[chatId] = {
                difficulty: "",
                textCount: undefined,
                duration: undefined,
            };
        exports.userChoices[chatId].difficulty = data;
        bot.deleteMessage(chatId, query.message.message_id).catch(() => { });
        bot.sendMessage(chatId, "🎯 Great choice\\! Choose the challenge mode:", {
            parse_mode: "MarkdownV2",
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "⌨️ Word Count", callback_data: "word_count_mode" },
                        { text: "🕰 Duration", callback_data: "duration_mode" },
                    ],
                ],
            },
        });
    }
    else if (data === "word_count_mode") {
        bot.deleteMessage(chatId, query.message.message_id).catch(() => { });
        bot.sendMessage(chatId, "🔢 Select the number of words:", {
            parse_mode: "MarkdownV2",
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "20 words 📝", callback_data: "20" },
                        { text: "40 words 📝", callback_data: "40" },
                    ],
                    [
                        { text: "60 words 📝", callback_data: "60" },
                        { text: "100 words 📝", callback_data: "100" },
                    ],
                    [{ text: "🏠 Home", callback_data: "restart_game" }],
                ],
            },
        });
    }
    else if (data === "duration_mode") {
        bot.deleteMessage(chatId, query.message.message_id).catch(() => { });
        bot.sendMessage(chatId, "⏱ Select the challenge duration:", {
            parse_mode: "MarkdownV2",
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "15 seconds ⏱️", callback_data: "15sec" },
                        { text: "30 seconds ⏱️", callback_data: "30sec" },
                    ],
                    [
                        { text: "1 minute 🕐", callback_data: "1min" },
                        { text: "3 minutes 🕒", callback_data: "3min" },
                    ],
                    [{ text: "🏠 Home", callback_data: "restart_game" }],
                ],
            },
        });
    }
    else if (["20", "40", "60", "100"].includes(data)) {
        exports.userChoices[chatId].textCount = data;
        bot.deleteMessage(chatId, query.message.message_id).catch(() => { });
        (0, start_1.startTextCountChallenge)(bot, chatId, { textCount: data }, exports.userChoices[chatId].difficulty);
    }
    else if (["15sec", "30sec", "1min", "3min"].includes(data)) {
        exports.userChoices[chatId].duration = data;
        bot.deleteMessage(chatId, query.message.message_id).catch(() => { });
        (0, start_1.startDurationChallenge)(bot, chatId, { duration: data }, exports.userChoices[chatId].difficulty);
    }
    else if (data === "stop_challenge") {
        if ((_a = exports.gameState[chatId]) === null || _a === void 0 ? void 0 : _a.intervalId)
            clearInterval(exports.gameState[chatId].intervalId);
        exports.gameState[chatId] = { intervalId: undefined, gameOver: true };
        const userChoice = exports.userChoices[chatId];
        bot.deleteMessage(chatId, query.message.message_id).catch(() => { });
        bot.sendMessage(chatId, "⏹ Challenge stopped\\. What would you like to do next\\?", {
            parse_mode: "MarkdownV2",
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "🔄 Restart", callback_data: "restart_challenge" },
                        { text: "🏘 Home", callback_data: "restart_game" },
                    ],
                ],
            },
        });
    }
    else if (data === "restart_challenge") {
        const userChoice = exports.userChoices[chatId];
        bot.deleteMessage(chatId, query.message.message_id).catch(() => { });
        if (!userChoice.textCount && !userChoice.duration) {
            bot.sendMessage(chatId, "❌ unable to restart\\!");
            (0, handleStart_1.handleHomeCallback)(bot, query.message);
        }
        if (userChoice.textCount) {
            (0, start_1.startTextCountChallenge)(bot, chatId, { textCount: userChoice.textCount }, userChoice.difficulty);
        }
        else if (userChoice.duration) {
            (0, start_1.startDurationChallenge)(bot, chatId, { duration: userChoice.duration }, userChoice.difficulty);
        }
    }
};
exports.setupCallbackQueryListener2 = setupCallbackQueryListener2;
