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
exports.handleHomeCallback = void 0;
const user_1 = __importDefault(require("../../db/models/user"));
const messages_1 = require("../messages");
const handleHomeCallback = (bot, msg) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = msg.chat.id;
    const { id: telegramId, username, first_name: firstName, last_name: lastName, } = msg.from;
    yield user_1.default.findOneAndUpdate({ telegramId }, { username, firstName, lastName }, { upsert: true, new: true });
    const sentMessage = yield bot.sendPhoto(chatId, "https://i.ibb.co/Z6XNt56/IMG-20241122-200510-961.png", {
        caption: (0, messages_1.welcomeMessageCaption)(firstName || "Player"),
        parse_mode: "MarkdownV2",
        reply_markup: {
            inline_keyboard: [
                [{ text: "🎮 Single Player", callback_data: "single_player" }],
                [{ text: "👥 Multiplayer", callback_data: "multiplayer" }],
            ],
        },
    });
    if (sentMessage.message_id) {
        bot.on("callback_query", (query) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            if (((_a = query.message) === null || _a === void 0 ? void 0 : _a.message_id) === sentMessage.message_id) {
                yield bot.deleteMessage(chatId, sentMessage.message_id);
            }
        }));
    }
});
exports.handleHomeCallback = handleHomeCallback;
