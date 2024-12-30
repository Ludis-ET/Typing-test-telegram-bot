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
exports.setupCallbackQueryListener = void 0;
const singlePlayer_1 = require("../single/singlePlayer");
const handleStart_1 = require("./handleStart");
const multiplayer_1 = require("../multiplayer");
const setupCallbackQueryListener = (bot) => {
    bot.on("callback_query", (query) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const chatId = (_a = query.message) === null || _a === void 0 ? void 0 : _a.chat.id;
        const data = query.data;
        if (!chatId || !data)
            return;
        if (data === "single_player") {
            (0, singlePlayer_1.singlePlayerHandler)(bot, chatId);
        }
        else if (data === "multiplayer") {
            (0, multiplayer_1.multiPlayerHandler)(bot, chatId);
        }
        else if (data === "restart_game") {
            bot.deleteMessage(chatId, query.message.message_id).catch(() => { });
            (0, handleStart_1.handleHomeCallback)(bot, query.message);
        }
        else if (data.startsWith("multi_")) {
            (0, multiplayer_1.multiPlayerCallbacks)(bot, query, chatId, data);
        }
        else {
            (0, singlePlayer_1.setupCallbackQueryListener2)(bot, query, chatId, data);
        }
    }));
};
exports.setupCallbackQueryListener = setupCallbackQueryListener;
