import TelegramBot, { CallbackQuery } from "node-telegram-bot-api";


export const multiPlayerCallbacks = (
  bot: TelegramBot,
  query: CallbackQuery,
  chatId: number,
  data: string
) => {
  if (!data) return;

};ac