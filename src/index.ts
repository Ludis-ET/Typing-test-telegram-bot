import dotenv from "dotenv";
import app from "./app";
import "./bot/bot";

dotenv.config();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
