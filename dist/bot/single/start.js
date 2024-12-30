"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startDurationChallenge = exports.startTextCountChallenge = void 0;
const generateP_1 = require("../utils/generateP");
const singlePlayer_1 = require("./singlePlayer");
const generateWPM_1 = require("../utils/generateWPM");
const addNewLines = (text, wordsPerLine) => {
    const words = text.split(" ");
    return words
        .map((word, index) => index % wordsPerLine === 0 && index !== 0 ? "\n\n" + word : word)
        .join(" ");
};
const startTextCountChallenge = (bot, chatId, options, difficulty) => __awaiter(void 0, void 0, void 0, function* () {
    const wordCount = parseInt(options.textCount);
    let typedWordsCount = 0;
    let messageId;
    const sentMessage = yield bot.sendMessage(chatId, "Starting in... 3", {
        protect_content: true,
    });
    for (let i = 2; i >= 0; i--) {
        yield new Promise((resolve) => setTimeout(resolve, 1000));
        if (i === 0) {
            yield bot.editMessageText("Go!", {
                chat_id: chatId,
                message_id: sentMessage.message_id,
            });
        }
        else {
            yield bot.editMessageText(`Starting in... ${i}`, {
                chat_id: chatId,
                message_id: sentMessage.message_id,
            });
        }
    }
    const paragraph = (0, generateP_1.generateParagraph)(difficulty, options);
    const formattedParagraph = addNewLines(paragraph, 20);
    bot.sendMessage(chatId, formattedParagraph, {
        protect_content: true,
        disable_web_page_preview: true,
    });
    singlePlayer_1.userAnswers[chatId] = "";
    singlePlayer_1.startTime[chatId] = new Date().getTime();
    singlePlayer_1.gameState[chatId] = { intervalId: undefined, gameOver: false };
    const intervalId = setInterval(() => {
        const currentTime = new Date().getTime();
        const elapsedTime = Math.floor((currentTime - singlePlayer_1.startTime[chatId]) / 1000);
        const timerMessage = `⏱ Time elapsed: ${elapsedTime} seconds. Type the paragraph and send it!`;
        if (!messageId) {
            bot
                .sendMessage(chatId, timerMessage, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "⏹ Stop Challenge", callback_data: "stop_challenge" }],
                    ],
                },
            })
                .then((sentMessage) => (messageId = sentMessage.message_id))
                .catch(() => { });
        }
        else {
            bot
                .editMessageText(timerMessage, {
                chat_id: chatId,
                message_id: messageId,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "⏹ Stop Challenge", callback_data: "stop_challenge" }],
                    ],
                },
            })
                .catch(() => { });
        }
        if (singlePlayer_1.userAnswers[chatId]) {
            typedWordsCount = singlePlayer_1.userAnswers[chatId].length;
            if (typedWordsCount >= wordCount) {
                clearInterval(intervalId);
                bot.sendMessage(chatId, "✅ You completed the challenge! Game over.");
                singlePlayer_1.gameState[chatId].gameOver = true;
            }
        }
    }, 1000);
    singlePlayer_1.gameState[chatId].intervalId = intervalId;
    bot.once("message", (msg) => {
        if (msg.chat.id === chatId && msg.text) {
            const typedMessage = msg.text.trim();
            const endTime = new Date().getTime();
            const timeSpent = (endTime - singlePlayer_1.startTime[chatId]) / 1000;
            clearInterval(intervalId);
            if (!singlePlayer_1.gameState[chatId].gameOver) {
                (0, generateWPM_1.generateWPM)(bot, chatId, difficulty, options, formattedParagraph, typedMessage, timeSpent);
                if (typedMessage === singlePlayer_1.userAnswers[chatId]) {
                    singlePlayer_1.gameState[chatId].gameOver = true;
                    bot.sendMessage(chatId, "✅ You completed the challenge! Game over.");
                }
                else {
                    singlePlayer_1.gameState[chatId].gameOver = true;
                    bot.sendMessage(chatId, "❌ Challenge over. Try again!");
                }
            }
        }
    });
});
exports.startTextCountChallenge = startTextCountChallenge;
const startDurationChallenge = (bot, chatId, options, difficulty) => __awaiter(void 0, void 0, void 0, function* () {
    const sentMessage = yield bot.sendMessage(chatId, "Starting in... 3", {
        protect_content: true,
    });
    for (let i = 2; i >= 0; i--) {
        yield new Promise((resolve) => setTimeout(resolve, 1000));
        if (i === 0) {
            yield bot.editMessageText("Go!", {
                chat_id: chatId,
                message_id: sentMessage.message_id,
            });
        }
        else {
            yield bot.editMessageText(`Starting in... ${i}`, {
                chat_id: chatId,
                message_id: sentMessage.message_id,
            });
        }
    }
    const durationInSeconds = (0, generateWPM_1.getDutation)(options.duration);
    let remainingTime = durationInSeconds;
    let messageId;
    const paragraph = (0, generateP_1.generateParagraph)(difficulty, options);
    const formattedParagraph = addNewLines(paragraph, 20);
    bot.sendMessage(chatId, formattedParagraph, {
        protect_content: true,
        disable_web_page_preview: true,
    });
    singlePlayer_1.userAnswers[chatId] = formattedParagraph;
    singlePlayer_1.startTime[chatId] = new Date().getTime();
    singlePlayer_1.gameState[chatId] = { intervalId: undefined, gameOver: false };
    const intervalId = setInterval(() => {
        if (remainingTime <= 0) {
            clearInterval(intervalId);
            bot.sendMessage(chatId, "❌ Challenge over. Time's up!");
            singlePlayer_1.gameState[chatId].gameOver = true;
            const endTime = new Date().getTime();
            const timeSpent = (endTime - singlePlayer_1.startTime[chatId]) / 1000;
            (0, generateWPM_1.generateWPM)(bot, chatId, difficulty, options, singlePlayer_1.userAnswers[chatId], "", timeSpent);
        }
        else {
            const timerMessage = `⏱ Time remaining: ${remainingTime} seconds. Type the paragraph and send it!`;
            if (!messageId) {
                bot
                    .sendMessage(chatId, timerMessage, {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "⏹ Stop Challenge", callback_data: "stop_challenge" }],
                        ],
                    },
                })
                    .then((sentMessage) => (messageId = sentMessage.message_id))
                    .catch(() => { });
            }
            else {
                bot
                    .editMessageText(timerMessage, {
                    chat_id: chatId,
                    message_id: messageId,
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "⏹ Stop Challenge", callback_data: "stop_challenge" }],
                        ],
                    },
                })
                    .catch(() => { });
            }
            remainingTime--;
        }
    }, 1000);
    singlePlayer_1.gameState[chatId].intervalId = intervalId;
    bot.once("message", (msg) => {
        if (msg.chat.id === chatId && msg.text) {
            const typedMessage = msg.text.trim();
            const endTime = new Date().getTime();
            const timeSpent = (endTime - singlePlayer_1.startTime[chatId]) / 1000;
            clearInterval(intervalId);
            if (!singlePlayer_1.gameState[chatId].gameOver) {
                (0, generateWPM_1.generateWPM)(bot, chatId, difficulty, options, singlePlayer_1.userAnswers[chatId], typedMessage, timeSpent);
                if (typedMessage === singlePlayer_1.userAnswers[chatId]) {
                    singlePlayer_1.gameState[chatId].gameOver = true;
                    bot.sendMessage(chatId, "✅ You completed the challenge! Game over.");
                }
            }
        }
    });
});
exports.startDurationChallenge = startDurationChallenge;
