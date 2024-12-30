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
exports.startGame = void 0;
const RoomManagement_1 = require("../../db/RoomManagement");
const start_1 = require("./start");
const startGame = (bot, chatId, roomId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const room = yield (0, RoomManagement_1.fetchRoom)({ _id: roomId });
        if (!room) {
            bot.sendMessage(chatId, "⚠️ Room not found\\. Please try again\\.", {
                parse_mode: "MarkdownV2",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "🏘 Home", callback_data: "restart_game" }],
                    ],
                },
            });
            return;
        }
        if (room.players[0].telegramId !== userId.toString()) {
            bot.sendMessage(chatId, "⚠️ Only the room creator can start the game\\.", {
                parse_mode: "MarkdownV2",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "🏘 Home", callback_data: "restart_game" }],
                    ],
                },
            });
            return;
        }
        if (room.players.length < 2) {
            bot.sendMessage(chatId, "⚠️ At least two players are required to start the game\\.", {
                parse_mode: "MarkdownV2",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "🏘 Home", callback_data: "restart_game" }],
                    ],
                },
            });
            return;
        }
        const difficultyMessage = yield bot.sendMessage(chatId, "🎯 *Select Difficulty Level*\n\nChoose how challenging the game should be\\:", {
            parse_mode: "MarkdownV2",
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "🟢 Easy", callback_data: "difficulty_easy" },
                        { text: "🟡 Medium", callback_data: "difficulty_medium" },
                    ],
                    [
                        { text: "🔴 Hard", callback_data: "difficulty_hard" },
                        { text: "⚫ Nightmare", callback_data: "difficulty_nightmare" },
                    ],
                ],
            },
        });
        bot.once("callback_query", (difficultyQuery) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            bot.deleteMessage(chatId, difficultyMessage.message_id).catch(() => { });
            const difficulty = (((_a = difficultyQuery.data) === null || _a === void 0 ? void 0 : _a.split("_")[1]) || "medium");
            const modeMessage = yield bot.sendMessage(chatId, "⌛ *Select Game Mode*\n\nDo you want to play by time or word count\\?", {
                parse_mode: "MarkdownV2",
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: "⏳ Time", callback_data: "game_mode_time" },
                            { text: "📝 Word Count", callback_data: "game_mode_words" },
                        ],
                    ],
                },
            });
            bot.once("callback_query", (modeQuery) => __awaiter(void 0, void 0, void 0, function* () {
                bot.deleteMessage(chatId, modeMessage.message_id).catch(() => { });
                const mode = modeQuery.data === "game_mode_time" ? "time" : "word_count";
                const optionsMessage = yield bot.sendMessage(chatId, mode === "time"
                    ? "⏳ *Select Duration*\n\nHow long should the game last\\?"
                    : "📝 *Select Word Count*\n\nHow many words should the game include\\?", {
                    parse_mode: "MarkdownV2",
                    reply_markup: {
                        inline_keyboard: mode === "time"
                            ? [
                                [
                                    { text: "15 seconds", callback_data: "duration_15" },
                                    { text: "30 seconds", callback_data: "duration_30" },
                                ],
                                [
                                    { text: "1 minute", callback_data: "duration_60" },
                                    { text: "3 minutes", callback_data: "duration_180" },
                                    { text: "5 minutes", callback_data: "duration_300" },
                                ],
                            ]
                            : [
                                [
                                    { text: "20 words", callback_data: "words_20" },
                                    { text: "50 words", callback_data: "words_50" },
                                ],
                                [
                                    { text: "80 words", callback_data: "words_80" },
                                    { text: "100 words", callback_data: "words_100" },
                                ],
                            ],
                    },
                });
                bot.once("callback_query", (optionQuery) => __awaiter(void 0, void 0, void 0, function* () {
                    var _a;
                    bot.deleteMessage(chatId, optionsMessage.message_id).catch(() => { });
                    const value = parseInt(((_a = optionQuery.data) === null || _a === void 0 ? void 0 : _a.split("_")[1]) || "60", 10);
                    const settings = { difficulty, mode, value };
                    try {
                        yield (0, RoomManagement_1.saveGameSettings)(roomId, settings);
                        (0, start_1.GameStart)(bot, room.players.map(player => ({
                            telegramId: player.telegramId,
                            username: player.username || undefined,
                        })), settings);
                    }
                    catch (_b) {
                        bot.sendMessage(chatId, "⚠️ Unable to start the game\\. Please try again\\.", {
                            parse_mode: "MarkdownV2",
                            reply_markup: {
                                inline_keyboard: [
                                    [{ text: "🏘 Home", callback_data: "restart_game" }],
                                ],
                            },
                        });
                    }
                }));
            }));
        }));
    }
    catch (_a) {
        bot.sendMessage(chatId, "⚠️ An error occurred\\. Please try again\\.", {
            parse_mode: "MarkdownV2",
            reply_markup: {
                inline_keyboard: [[{ text: "🏘 Home", callback_data: "restart_game" }]],
            },
        });
    }
});
exports.startGame = startGame;
