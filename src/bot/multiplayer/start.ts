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

  // Send countdown to all players
  const countdownMessages = await Promise.all(
    players.map((player) => {
      return bot.sendMessage(
        player.telegramId,
        `⏳ *Get Ready*\\! Game starts in 3 seconds\\!`,
        { parse_mode: "MarkdownV2" }
      );
    })
  );

  // Update countdown for each player simultaneously
  for (let i = 3; i >= 1; i--) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const countdownUpdates = countdownMessages.map((msg, index) => {
      return bot.editMessageText(`⏳ *${i}*`, {
        chat_id: players[index].telegramId,
        message_id: msg.message_id,
        parse_mode: "MarkdownV2",
      });
    });
    await Promise.all(countdownUpdates);
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Send the game text to all players
  const gameTextPromises = players.map((player) => {
    return bot.sendMessage(player.telegramId, `${paragraph}`, {
      parse_mode: "MarkdownV2",
      disable_web_page_preview: true,
      disable_notification: true,
      protect_content: true,
    });
  });

  const gameTextMessages = await Promise.all(gameTextPromises);

  // Start time counter for each player
  if (mode === "time") {
    const timeCounterPromises = players.map((player) => {
      return new Promise(async (resolve) => {
        let remaining = value;
        while (remaining > 0) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const message = gameTextMessages.find(
            (msg) => msg.chat.id.toString() === player.telegramId
          );
          if (!message) {
            throw new Error(`Message not found for player ${player.telegramId}`);
          }
          const messageId = message.message_id;
          bot.editMessageText(`⌛ *Time Left: ${remaining--}s*`, {
            chat_id: player.telegramId,
            message_id: messageId,
            parse_mode: "MarkdownV2",
          });
        }
        resolve(void 0);
      });
    });
    await Promise.all(timeCounterPromises);
  } else {
    const typingTimerPromises = players.map((player) => {
      const message = gameTextMessages.find(
        (msg) => msg.chat.id.toString() === player.telegramId
      );
      if (!message) {
        throw new Error(`Message not found for player ${player.telegramId}`);
      }
      const messageId = message.message_id;
      return bot.editMessageText(
        `⏱ *Timer Started*\nType the text as fast as you can\\!`,
        {
          chat_id: player.telegramId,
          message_id: messageId,
          parse_mode: "MarkdownV2",
        }
      );
    });
    await Promise.all(typingTimerPromises);
  }

  // Record each player's response and time taken
  for (const player of players) {
    const startTime = Date.now();

    // Mock player response, you need to get this from the actual input
    const playerText = "player's typed text"; // Capture this from the player’s response

    const endTime = Date.now();
    const timeTaken =
      mode === "word_count" ? Math.floor((endTime - startTime) / 1000) : value;

    console.log(`Player ${player.telegramId}:`);
    console.log(`Typed Text: ${playerText}`);
    console.log(`Time Taken: ${timeTaken}s`);
    console.log(`Game Properties:`, settings);
    console.log(`Paragraph:`, paragraph);
  }
};
