import express from "express";
import "./db/connect";
import { bot } from "./bot/bot";

const app = express();
app.use(express.json());


app.post("/", (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200); 
});

app.get("/", (req, res) => {
  res.send("Bot is running! This is the health check endpoint.");
});

export default app;
