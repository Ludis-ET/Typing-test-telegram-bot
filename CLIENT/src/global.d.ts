interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  phone_number?: string; // Add other properties as needed
}

interface TelegramWebApp {
  initDataUnsafe: {
    user: TelegramUser;
    query_id: string; // Include other properties from initDataUnsafe if needed
  };
}

interface Window {
  Telegram: {
    WebApp: TelegramWebApp;
  };
}
