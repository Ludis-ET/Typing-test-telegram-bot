import { Route, Routes } from "react-router-dom";
import { Home, Game1 } from "./components";
import { motion } from "framer-motion";
import { useEffect } from "react";

const App = () => {
  useEffect(() => {
    const sendTelegramStartMessage = async () => {
      const botToken = "7854564916:AAG18QJt5EM7_zCl-IE1wg6YKNwfiPLBqSU";
      const message = "Bot has started! The web app is deployed and running.";

      try {
        // Step 1: Retrieve the chat_id from recent updates
        const updatesResponse = await fetch(
          `https://api.telegram.org/bot${botToken}/getUpdates`
        );
        const updatesData = await updatesResponse.json();

        if (updatesData.result.length > 0) {
          // Get the latest chat_id from the updates
          const chatId = updatesData.result[0].message.chat.id;

          // Step 2: Send the start message to the retrieved chat_id
          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              chat_id: chatId,
              text: message,
            }),
          });
        } else {
          console.log(
            "No recent chat_id found. Have a user message the bot first."
          );
        }
      } catch (error) {
        console.error("Error sending start message to Telegram:", error);
      }
    };

    sendTelegramStartMessage();
  }, []);

  return (
    <div className="relative h-screen overflow-hidden flex flex-col items-center justify-start font-sans text-purple-light p-6">
      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:#000;]"></div>
      <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden">
        <div className="relative h-full w-full [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
          {[...Array(100)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full opacity-70"
              style={{
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{ y: ["0%", "20%", "0%"] }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
      </div>
      <Routes>
        <Route path="*" element={<Home />} />
        <Route path="/game1" element={<Game1 />} />
      </Routes>
    </div>
  );
};

export default App;
