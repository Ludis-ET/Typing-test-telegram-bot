import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  _id: { type: String, required: true }, 
  type: { type: String, enum: ["random", "friend"], required: true },
  players: [
    {
      telegramId: { type: String, required: true }, 
      username: { type: String },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});


export default mongoose.model("Room", roomSchema);
