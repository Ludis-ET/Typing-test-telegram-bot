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

    const startTime = Date.now(); // Capture the start time

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

    if (mode === "time") {
      let remaining = value;
      while (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        bot.editMessageText(`⌛ *Time Left: ${remaining--}s*`, {
          chat_id: telegramId,
          message_id: gameText.message_id,
          parse_mode: "MarkdownV2",
        });
      }
    } else {
      await bot.editMessageText(
        `⏱ *Timer Started*\nType the text as fast as you can!`,
        {
          chat_id: telegramId,
          message_id: gameText.message_id,
          parse_mode: "MarkdownV2",
        }
      );
    }

    const endTime = Date.now();
    const timeTaken =
      mode === "word_count" ? Math.floor((endTime - startTime) / 1000) : value;

    const playerText = "player's typed text"; // Capture this from the player’s response.

    console.log(`Player ${telegramId}:`);
    console.log(`Typed Text: ${playerText}`);
    console.log(`Time Taken: ${timeTaken}s`);
    console.log(`Game Properties:`, settings);

    // playerStats[telegramId] = { rawWPM, WPM, accuracy, timeTaken };

    // await bot.sendMessage(
    //   telegramId,
    //   `🎉 *Game Over\\!* Your results:\n\n` +
    //     `💬 *Raw WPM:* ${rawWPM}\n` +
    //     `✅ *Accuracy:* ${accuracy}%\n` +
    //     `🔥 *Adjusted WPM:* ${WPM}\n` +
    //     `${
    //       mode === "word_count"
    //         ? `⏱ *Time Taken:* ${timeTaken}s`
    //         : `⌛ *Duration:* ${value}s`
    //     }`,
    //   { parse_mode: "MarkdownV2" }
    // );
  }
};
