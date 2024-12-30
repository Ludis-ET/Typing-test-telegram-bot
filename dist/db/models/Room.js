"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const roomSchema = new mongoose_1.default.Schema({
    _id: { type: String, required: true },
    type: { type: String, enum: ["random", "friend"], required: true },
    players: [
        {
            telegramId: { type: String, required: true },
            username: { type: String },
            isCreator: { type: Boolean, default: false },
        },
    ],
    isAvailable: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    gameSettings: {
        difficulty: { type: String, enum: ["easy", "medium", "hard", "nightmare"] },
        mode: { type: String, enum: ["time", "word_count"] },
        value: { type: Number },
    },
    expiresAt: { type: Date, index: { expires: 30 } },
});
exports.default = mongoose_1.default.model("Room", roomSchema);
