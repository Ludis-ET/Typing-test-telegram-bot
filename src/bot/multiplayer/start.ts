import TelegramBot from "node-telegram-bot-api";
import { generateParagraph } from "../utils/generateP";
import {
  calculateAccuracy,
  calculateMissedChars,
  calculateNewChars,
  calculateWPM,
} from "../utils/generateWPM";

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

  const playerStatuses: Record<
    string,
    { finished: boolean; timeTaken?: number; typedText?: string }
  > = {};
  players.forEach((player) => {
    playerStatuses[player.telegramId] = { finished: false };
  });

  const countdownMessages = await Promise.all(
    players.map((player) =>
      bot.sendMessage(
        player.telegramId,
        `⏳ *Get Ready*\\! Game starts in 3 seconds\\!`,
        { parse_mode: "MarkdownV2" }
      )
    )
  );

  for (let i = 3; i >= 1; i--) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await Promise.all(
      countdownMessages.map((msg, index) =>
        bot.editMessageText(`⏳ *${i}*`, {
          chat_id: players[index].telegramId,
          message_id: msg.message_id,
          parse_mode: "MarkdownV2",
        })
      )
    );
  }

  await Promise.all(
    countdownMessages.map((msg, index) =>
      bot.editMessageText(`🏁 *Go\\!*`, {
        chat_id: players[index].telegramId,
        message_id: msg.message_id,
        parse_mode: "MarkdownV2",
      })
    )
  );

  const gameTextMessages = await Promise.all(
    players.map((player) =>
      bot.sendMessage(player.telegramId, `${paragraph}`, {
        parse_mode: "MarkdownV2",
        disable_web_page_preview: true,
        disable_notification: true,
        protect_content: true,
      })
    )
  );

  const timerStart = Date.now();
  const finishGame = async () => {
    const leaderboard = Object.entries(playerStatuses)
      .map(([telegramId, status]) => {
        const username =
          players.find((p) => p.telegramId === telegramId)?.username ||
          "Unknown";
        const typedText = status.typedText || "No input";
        const timeTaken = status.timeTaken || Infinity;

        const missedChars = calculateMissedChars(typedText, paragraph);
        const newChars = calculateNewChars(typedText, paragraph);
        const accuracy = calculateAccuracy(typedText, paragraph);
        const wpm =
          timeTaken === Infinity
            ? 0
            : calculateWPM(
                typedText,
                paragraph,
                timeTaken,
                difficulty,
                parseInt(accuracy)
              );

        return {
          telegramId,
          username,
          timeTaken,
          typedText,
          missedChars,
          newChars,
          accuracy,
          wpm,
        };
      })
      .sort((a, b) => a.timeTaken - b.timeTaken);

    const leaderboardMessage = `\uD83D\uDCCA *Leaderboard*\n\n${leaderboard
      .map(
        (entry, index) =>
          `${index + 1} ${entry.username} \\- ${
            entry.timeTaken === Infinity
              ? "*DNF*"
              : `*${entry.timeTaken}s* \\(${
                  (entry.wpm as [number, number])[1]
                } WPM\\)`
          }\n` +
          `Accuracy: ${parseInt(entry.accuracy)}\\%\n` +
          `Missed Characters: ${entry.missedChars}\n` +
          `New Characters: ${entry.newChars}\n` +
          `Raw WPM: ${(entry.wpm as [number, number])[0]}`
      )
      .join("\n\n")}`;

    await Promise.all(
      players.map((player) =>
        bot.sendMessage(player.telegramId, leaderboardMessage, {
          parse_mode: "MarkdownV2",
          reply_markup: {
            inline_keyboard: [
              [
                { text: "\uD83D\uDD04 Replay", callback_data: "replay" },
                { text: "\uD83C\uDFE0 Home", callback_data: "restart_game" },
              ],
            ],
          },
        })
      )
    );

    bot.once("callback_query", async (callbackQuery) => {
      const { data } = callbackQuery;
      if (data === "replay") {
        await bot.answerCallbackQuery(callbackQuery.id);
        GameStart(bot, players, settings);
      } else if (data === "restart_friend_game") {
        console.log("restart_friend_game");
        await bot.answerCallbackQuery(callbackQuery.id);
        GameStart(bot, players, settings);
      }
    });
  };

  const interval = setInterval(async () => {
    const elapsed = Math.floor((Date.now() - timerStart) / 1000);

    if (mode === "time" && elapsed >= value) {
      clearInterval(interval);
      await finishGame();
      return;
    }

    if (Object.values(playerStatuses).every((p) => p.finished)) {
      clearInterval(interval);
      await finishGame();
      return;
    }

    await Promise.all(
      gameTextMessages.map((msg, index) => {
        if (!playerStatuses[players[index].telegramId].finished) {
          return bot.editMessageText(
            `${paragraph}\n\n${
              mode === "time"
                ? `\u231B *Time Left: ${value - elapsed}s*`
                : `\u23F1 *Elapsed Time: ${elapsed}s*`
            }`,
            {
              chat_id: players[index].telegramId,
              message_id: msg.message_id,
              parse_mode: "MarkdownV2",
            }
          );
        }
      })
    );
  }, 1000);

  bot.on("message", async (msg) => {
    const playerId = msg.chat.id.toString();
    if (playerStatuses[playerId]?.finished) return;

    const typedText = msg.text || "";
    const timeTaken = Math.floor((Date.now() - timerStart) / 1000);

    playerStatuses[playerId] = { finished: true, timeTaken, typedText };

    bot.sendMessage(
      playerId,
      `\uD83C\uDF89 *You finished in ${timeTaken}s\\!* Please wait for others to finish\\.`,
      { parse_mode: "MarkdownV2" }
    );

    if (Object.values(playerStatuses).every((p) => p.finished)) {
      clearInterval(interval);
      await finishGame();
    }
  });
};
