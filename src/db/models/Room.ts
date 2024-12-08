import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  type: { type: String, enum: ["random", "friend"], required: true },
  players: [
    {
      telegramId: { type: String, required: true },
      username: { type: String },
      isCreator: { type: Boolean, default: false },
    },
  ],
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  gameSettings: {
    difficulty: { type: String, enum: ["easy", "medium", "hard", "nightmare"] },
    mode: { type: String, enum: ["time", "word_count"] },
    value: { type: Number },
  },
  expiresAt: { type: Date, index: { expires: 30 } },
});

export default mongoose.model("Room", roomSchema);
