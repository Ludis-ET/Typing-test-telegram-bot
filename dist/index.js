"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
require("./bot/bot");
const PORT = 5000;
app_1.default.use("/", (req, res) => {
    res.send("Welcome to the Typing test");
});
app_1.default
    .listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
    .on("error", (err) => {
    console.error("Error starting server:", err);
});
