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

  const playerStatuses: Record<
    string,
    { finished: boolean; timeTaken?: number }
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

  if (mode === "time") {
    const interval = setInterval(async () => {
      const remaining = value - Math.floor((Date.now() - timerStart) / 1000);

      if (
        remaining <= 0 ||
        Object.values(playerStatuses).every((p) => p.finished)
      ) {
        clearInterval(interval);
        finishGame(bot, players, playerStatuses, paragraph, settings);
        return;
      }

      await Promise.all(
        gameTextMessages.map((msg, index) => {
          if (!playerStatuses[players[index].telegramId].finished) {
            return bot.editMessageText(
              `${paragraph}\n\n⌛ *Time Left: ${remaining}s*`,
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
  } else if (mode === "word_count") {
    const countUpInterval = setInterval(async () => {
      const elapsed = Math.floor((Date.now() - timerStart) / 1000);

      if (Object.values(playerStatuses).every((p) => p.finished)) {
        clearInterval(countUpInterval);
        finishGame(bot, players, playerStatuses, paragraph, settings);
        return;
      }

      await Promise.all(
        gameTextMessages.map((msg, index) => {
          if (!playerStatuses[players[index].telegramId].finished) {
            return bot.editMessageText(
              `${paragraph}\n\n⏱ *Elapsed Time: ${elapsed}s*`,
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
  }

  bot.on("message", async (msg) => {
    const playerId = msg.chat.id.toString();
    if (!playerStatuses[playerId]?.finished) {
      const timeTaken = Math.floor((Date.now() - timerStart) / 1000);

      playerStatuses[playerId] = { finished: true, timeTaken };

      bot.sendMessage(
        playerId,
        `🎉 *You finished in ${timeTaken}s\\!* Please wait for your friends to finish\\.`,
        { parse_mode: "MarkdownV2" }
      );

      if (Object.values(playerStatuses).every((p) => p.finished)) {
        finishGame(bot, players, playerStatuses, paragraph, settings);
      }
    }
  });
};

const finishGame = async (
  bot: TelegramBot,
  players: { telegramId: string; username?: string }[],
  playerStatuses: Record<string, { finished: boolean; timeTaken?: number }>,
  paragraph: string,
  settings: { difficulty: string; mode: string; value: number }
) => {
  const leaderboard = Object.entries(playerStatuses)
    .map(([telegramId, status]) => ({
      telegramId,
      timeTaken: status.timeTaken || Infinity,
    }))
    .sort((a, b) => a.timeTaken - b.timeTaken);

  await Promise.all(
    players.map((player) =>
      bot.sendMessage(player.telegramId, `📊 *Calculating Leaderboard...*`, {
        parse_mode: "MarkdownV2",
        reply_markup: {
          inline_keyboard: [
            [
              { text: "🔄 Replay", callback_data: "replay" },
              { text: "🏠 Home", callback_data: "restart_game" },
            ],
          ],
        },
      })
    )
  );

  bot.on("callback_query", async (callbackQuery) => {
    if (callbackQuery.data === "replay") {
      await bot.answerCallbackQuery(callbackQuery.id);
      GameStart(bot, players, settings);
    }
  });
};
