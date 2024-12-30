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
exports.GameStart = void 0;
const generateP_1 = require("../utils/generateP");
const generateWPM_1 = require("../utils/generateWPM");
const GameStart = (bot, players, settings) => __awaiter(void 0, void 0, void 0, function* () {
    const { difficulty, mode, value } = settings;
    const paragraph = (0, generateP_1.generateParagraph)(difficulty, {
        textCount: mode === "word_count" ? value.toString() : undefined,
        duration: mode === "time" ? value.toString() : undefined,
    });
    const playerStatuses = {};
    players.forEach((player) => {
        playerStatuses[player.telegramId] = { finished: false };
    });
    const countdownMessages = yield Promise.all(players.map((player) => bot.sendMessage(player.telegramId, `⏳ *Get Ready*\\! Game starts in 3 seconds\\!`, { parse_mode: "MarkdownV2" })));
    for (let i = 3; i >= 1; i--) {
        yield new Promise((resolve) => setTimeout(resolve, 1000));
        yield Promise.all(countdownMessages.map((msg, index) => bot.editMessageText(`⏳ *${i}*`, {
            chat_id: players[index].telegramId,
            message_id: msg.message_id,
            parse_mode: "MarkdownV2",
        })));
    }
    yield Promise.all(countdownMessages.map((msg, index) => bot.editMessageText(`🏁 *Go\\!*`, {
        chat_id: players[index].telegramId,
        message_id: msg.message_id,
        parse_mode: "MarkdownV2",
    })));
    const gameTextMessages = yield Promise.all(players.map((player) => bot.sendMessage(player.telegramId, `${paragraph}`, {
        parse_mode: "MarkdownV2",
        disable_web_page_preview: true,
        disable_notification: true,
        protect_content: true,
    })));
    const timerStart = Date.now();
    const finishGame = () => __awaiter(void 0, void 0, void 0, function* () {
        const leaderboard = Object.entries(playerStatuses)
            .map(([telegramId, status]) => {
            var _a;
            const username = ((_a = players.find((p) => p.telegramId === telegramId)) === null || _a === void 0 ? void 0 : _a.username) ||
                "Unknown";
            const typedText = status.typedText || "No input";
            const timeTaken = status.timeTaken || Infinity;
            const missedChars = (0, generateWPM_1.calculateMissedChars)(typedText, paragraph);
            const newChars = (0, generateWPM_1.calculateNewChars)(typedText, paragraph);
            const accuracy = (0, generateWPM_1.calculateAccuracy)(typedText, paragraph);
            const wpm = timeTaken === Infinity
                ? 0
                : (0, generateWPM_1.calculateWPM)(typedText, paragraph, timeTaken, difficulty, parseInt(accuracy));
            return {
                telegramId,
                username,
                timeTaken,
                typedText,
                missedChars,
                newChars,
                accuracy,
                wpm,
            };
        })
            .sort((a, b) => a.timeTaken - b.timeTaken);
        const leaderboardMessage = `\uD83D\uDCCA *Leaderboard*\n\n${leaderboard
            .map((entry, index) => `${index + 1} ${entry.username} \\- ${entry.timeTaken === Infinity
            ? "*DNF*"
            : `*${entry.timeTaken}s* \\(${entry.wpm[1]} WPM\\)`}\n` +
            `Accuracy: ${parseInt(entry.accuracy)}\\%\n` +
            `Missed Characters: ${entry.missedChars}\n` +
            `New Characters: ${entry.newChars}\n` +
            `Raw WPM: ${entry.wpm[0]}`)
            .join("\n\n")}`;
        yield Promise.all(players.map((player) => bot.sendMessage(player.telegramId, leaderboardMessage, {
            parse_mode: "MarkdownV2",
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "\uD83D\uDD04 Replay", callback_data: "replay" },
                        { text: "\uD83C\uDFE0 Home", callback_data: "restart_game" },
                    ],
                ],
            },
        })));
        bot.once("callback_query", (callbackQuery) => __awaiter(void 0, void 0, void 0, function* () {
            const { data } = callbackQuery;
            if (data === "replay") {
                yield bot.answerCallbackQuery(callbackQuery.id);
                (0, exports.GameStart)(bot, players, settings);
            }
            else if (data === "restart_friend_game") {
                console.log("restart_friend_game");
                yield bot.answerCallbackQuery(callbackQuery.id);
                (0, exports.GameStart)(bot, players, settings);
            }
        }));
    });
    const interval = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        const elapsed = Math.floor((Date.now() - timerStart) / 1000);
        if (mode === "time" && elapsed >= value) {
            clearInterval(interval);
            yield finishGame();
            return;
        }
        if (Object.values(playerStatuses).every((p) => p.finished)) {
            clearInterval(interval);
            yield finishGame();
            return;
        }
        yield Promise.all(gameTextMessages.map((msg, index) => {
            if (!playerStatuses[players[index].telegramId].finished) {
                return bot.editMessageText(`${paragraph}\n\n${mode === "time"
                    ? `\u231B *Time Left: ${value - elapsed}s*`
                    : `\u23F1 *Elapsed Time: ${elapsed}s*`}`, {
                    chat_id: players[index].telegramId,
                    message_id: msg.message_id,
                    parse_mode: "MarkdownV2",
                });
            }
        }));
    }), 1000);
    bot.on("message", (msg) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const playerId = msg.chat.id.toString();
        if ((_a = playerStatuses[playerId]) === null || _a === void 0 ? void 0 : _a.finished)
            return;
        const typedText = msg.text || "";
        const timeTaken = Math.floor((Date.now() - timerStart) / 1000);
        playerStatuses[playerId] = { finished: true, timeTaken, typedText };
        bot.sendMessage(playerId, `\uD83C\uDF89 *You finished in ${timeTaken}s\\!* Please wait for others to finish\\.`, { parse_mode: "MarkdownV2" });
        if (Object.values(playerStatuses).every((p) => p.finished)) {
            clearInterval(interval);
            yield finishGame();
        }
    }));
});
exports.GameStart = GameStart;
