"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    telegramId: { type: String, unique: true, required: true },
    username: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    createdAt: { type: Date, default: Date.now },
});
exports.default = mongoose_1.default.model("User", userSchema);
