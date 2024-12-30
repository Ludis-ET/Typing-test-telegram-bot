"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SinglePlaySchema = new mongoose_1.default.Schema({
    chatId: { type: Number, required: true },
    difficulty: { type: String, required: true },
    duration: { type: Number, required: true },
    timeTaken: { type: Number, required: true },
    adjustedWpm: { type: Number, required: true },
    rawWpm: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    missedChars: { type: Number, required: true },
    newChars: { type: Number, required: true },
    status: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
const SinglePlay = mongoose_1.default.model("SinglePlay", SinglePlaySchema);
exports.default = SinglePlay;
