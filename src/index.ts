import dotenv from "dotenv";

dotenv.config();

import app from "./app";
import "./bot/bot";

const PORT = process.env.PORT || 5000;

app
  .listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  })
  .on("error", (err) => {
    console.error("Error starting server:", err);
  });
