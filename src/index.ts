import dotenv from "dotenv";

dotenv.config();

import app from "./app";
import "./bot/bot";

const PORT =  5000;

app.use("/", (req, res) => {
  res.send("Welcome to the Typing test");
});


app
  .listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  })
  .on("error", (err) => {
    console.error("Error starting server:", err);
  });

  