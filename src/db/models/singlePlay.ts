import mongoose from "mongoose";

const SinglePlaySchema = new mongoose.Schema({
  chatId: { type: Number, required: true },
  difficulty: { type: String, required: true },
  duration: { type: Number, required: true },
  timeTaken: { type: Number, required: true },
  adjustedWpm: { type: Number, required: true },
  rawWpm: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  missedChars: { type: Number, required: true },
  newChars: { type: Number, required: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const SinglePlay = mongoose.model("SinglePlay", SinglePlaySchema);

export default SinglePlay;
