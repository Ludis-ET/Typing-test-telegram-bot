"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiPlayerHandler = void 0;
const messages_1 = require("../messages");
const multiPlayerHandler = (bot, chatId) => {
    bot.sendMessage(chatId, (0, messages_1.MultiplayerMessage)(), {
        parse_mode: "MarkdownV2",
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "🔀 Random Match", callback_data: "multi_random_match" },
                    { text: "👥 Friend Match", callback_data: "multi_friend_match" },
                ],
                [{ text: "🏘 Home", callback_data: "restart_game" }],
            ],
        },
    });
};
exports.multiPlayerHandler = multiPlayerHandler;
