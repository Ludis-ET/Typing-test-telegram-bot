import TelegramBot from "node-telegram-bot-api";

export const GameStart = (
  bot: TelegramBot,
  players: { telegramId: string }[],
  settings: { difficulty: string; mode: string; value: number }
) => {
  const { difficulty, mode, value } = settings;
  players.forEach((player) => {
    bot.sendMessage(
      player.telegramId,
      `🎮 *Game Starting Soon\\!*\n\n*Difficulty:* ${difficulty}\n*Mode:* ${mode}\n*Value:* ${value}`,
      { parse_mode: "MarkdownV2" }
    );
  });
};
