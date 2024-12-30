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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWPM = exports.calculateAccuracy = exports.calculateNewChars = exports.calculateMissedChars = exports.calculateWPM = exports.getDutation = void 0;
const singlePlay_1 = __importDefault(require("../../db/models/singlePlay"));
const messages_1 = require("../messages");
const getDutation = (duration) => {
    switch (duration) {
        case "15sec":
            return 15;
        case "30sec":
            return 30;
        case "1min":
            return 60;
        case "3min":
            return 180;
        default:
            return 0;
    }
};
exports.getDutation = getDutation;
const calculateWPM = (typedText, promptText, timeTaken, difficulty, accuracy) => {
    const normalizeText = (text) => text.replace(/\s+/g, " ").trim().split(" ");
    const typedWords = normalizeText(typedText);
    const promptWords = normalizeText(promptText);
    let correctChars = 0;
    let totalChars = 0;
    promptWords.forEach((word, index) => {
        const typedWord = typedWords[index] || "";
        const minLength = Math.min(word.length, typedWord.length);
        for (let i = 0; i < minLength; i++) {
            if (word[i] === typedWord[i]) {
                correctChars++;
            }
        }
        totalChars += word.length;
    });
    const rawWPM = typedText.replace(/\s+/g, " ").trim().split(" ").length / (timeTaken / 60);
    const acc = accuracy / 100;
    const realWPM = Math.round(rawWPM * acc);
    return [Math.round(rawWPM), Math.max(realWPM, 0)];
};
exports.calculateWPM = calculateWPM;
const calculateMissedChars = (generated, prompt) => {
    let missed = 0;
    const length = Math.min(generated.length, prompt.length);
    for (let i = 0; i < length; i++) {
        if (generated[i] !== prompt[i])
            missed++;
    }
    missed += Math.max(0, prompt.length - generated.length);
    return missed;
};
exports.calculateMissedChars = calculateMissedChars;
const calculateNewChars = (generated, prompt) => {
    let newC = 0;
    const length = Math.min(generated.length, prompt.length);
    for (let i = 0; i < length; i++) {
        if (generated[i] !== prompt[i])
            newC++;
    }
    return newC;
};
exports.calculateNewChars = calculateNewChars;
const calculateAccuracy = (generated, prompt) => {
    let correct = 0;
    for (let i = 0; i < Math.min(generated.length, prompt.length); i++) {
        if (generated[i] === prompt[i])
            correct++;
    }
    return prompt.length > 0 ? ((correct / prompt.length) * 100).toFixed(2) : "0";
};
exports.calculateAccuracy = calculateAccuracy;
const generateWPM = (bot, chatId, difficulty, options, generatedText, promptText, timeTaken) => __awaiter(void 0, void 0, void 0, function* () {
    const duration = options.duration ? parseInt(options.duration) : 0;
    const missedChars = (0, exports.calculateMissedChars)(generatedText, promptText);
    const newChars = (0, exports.calculateNewChars)(generatedText, promptText);
    const accuracyValue = parseFloat((0, exports.calculateAccuracy)(generatedText, promptText));
    const accuracy = isNaN(accuracyValue) ? 0 : accuracyValue;
    const wpm = (0, exports.calculateWPM)(promptText, generatedText, timeTaken, difficulty, accuracy);
    try {
        const status = accuracy > 80 ? "Success" : "Fail";
        yield singlePlay_1.default.create({
            chatId,
            difficulty,
            duration: (0, exports.getDutation)(options.duration),
            timeTaken,
            adjustedWpm: wpm[1],
            rawWpm: wpm[0],
            accuracy,
            missedChars,
            newChars,
            status,
        });
    }
    catch (error) {
        console.error("Error saving game data:", error);
    }
    bot.sendPhoto(chatId, "https://i.ibb.co/4j2wHQH/IMG-20241122-200539-983.jpg", {
        caption: (0, messages_1.gameOverCaption)(wpm[0], wpm[1], accuracy, missedChars, newChars, timeTaken, difficulty, (0, exports.getDutation)(options.duration) || 0),
        parse_mode: "MarkdownV2",
        reply_markup: {
            inline_keyboard: [
                [{ text: "🔄 Restart Game", callback_data: "restart_challenge" }],
                [{ text: "🏘 Home", callback_data: "restart_game" }],
            ],
        },
    });
});
exports.generateWPM = generateWPM;
