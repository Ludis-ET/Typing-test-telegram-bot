import TelegramBot from "node-telegram-bot-api";
import { generateParagraph } from "../utils/generateP";

export const GameStart = async (
  bot: TelegramBot,
  players: { telegramId: string; username?: string }[],
  settings: { difficulty: string; mode: string; value: number }
) => {
  const { difficulty, mode, value } = settings;

  const paragraph = generateParagraph(difficulty, {
    textCount: mode === "word_count" ? value.toString() : undefined,
    duration: mode === "time" ? value.toString() : undefined,
  });

  const playerStats: Record<
    string,
    { rawWPM: number; WPM: number; accuracy: number; timeTaken?: number }
  > = {};

  for (const player of players) {
    const { telegramId, username } = player;

    const countdownMessage = await bot.sendMessage(
      telegramId,
      `⏳ *Get Ready*\\! Game starts in 3 seconds\\!`,
      { parse_mode: "MarkdownV2" }
    );

    for (let i = 3; i >= 1; i--) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      bot.editMessageText(`⏳ *${i}*`, {
        chat_id: telegramId,
        message_id: countdownMessage.message_id,
        parse_mode: "MarkdownV2",
      });
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const startTime = Date.now();
    const gameText = await bot.sendMessage(
      telegramId,
      `🔤 *Your Text:*\n\n\`${paragraph}\``,
      {
        parse_mode: "MarkdownV2",
        disable_web_page_preview: true,
        disable_notification: true,
        protect_content: true,
      }
    );

    setTimeout(
      async () => {
        const timeTaken =
          mode === "word_count"
            ? Math.floor((Date.now() - startTime) / 1000)
            : value;
        const rawWPM = Math.floor(Math.random() * 50) + 50;
        const accuracy = Math.floor(Math.random() * 20) + 80;
        const WPM = Math.floor(rawWPM * (accuracy / 100));
        playerStats[telegramId] = { rawWPM, WPM, accuracy, timeTaken };

        await bot.sendMessage(
          telegramId,
          `🎉 *Game Over\\!* Your results:\n\n` +
            `💬 *Raw WPM:* ${rawWPM}\n` +
            `✅ *Accuracy:* ${accuracy}%\n` +
            `🔥 *Adjusted WPM:* ${WPM}\n` +
            `${
              mode === "word_count"
                ? `⏱ *Time Taken:* ${timeTaken}s`
                : `⌛ *Duration:* ${value}s`
            }`,
          { parse_mode: "MarkdownV2" }
        );

        if (Object.keys(playerStats).length === players.length) {
          const leaderboard = Object.entries(playerStats)
            .sort(([, a], [, b]) => b.WPM - a.WPM)
            .map(([id, stats], index) => {
              const player = players.find((p) => p.telegramId === id);
              return `*${index + 1}\\.* ${player?.username || "Player"}\\: 🔥 ${
                stats.WPM
              } WPM \\(💬 ${stats.rawWPM} WPM, ✅ ${
                stats.accuracy
              }% Accuracy, ${
                mode === "word_count" ? `⏱ ${stats.timeTaken}s` : `⌛ ${value}s`
              }\\)`;
            })
            .join("\n");

          players.forEach((player) => {
            bot.sendMessage(
              player.telegramId,
              `🏆 *Leaderboard*\n\n${leaderboard}`,
              { parse_mode: "MarkdownV2" }
            );
          });
        }
      },
      mode === "time" ? value * 1000 : 30000
    );
  }
};
