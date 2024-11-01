import { useState } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

export const Game1 = () => {
  const [gameMode, setGameMode] = useState<string | null>(null);
  const [roomOption, setRoomOption] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [roomCode, setRoomCode] = useState<string>("");

  const handleSelect = (type: string, value: string) => {
    if (type === "mode") {
      setGameMode(value);
      setRoomOption(null);
      setDifficulty(null);
      setRoomCode("");
    } else if (type === "room") {
      setRoomOption(value);
      setDifficulty(null);
    } else if (type === "difficulty") {
      setDifficulty(value);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center max-h-[80vh] bg-transparent text-white p-4">
      <h1 className="text-4xl font-bold mb-3 text-center mt-5">
        Choose Your Game Settings
      </h1>
      <Link to="/">
        <FaArrowLeft className="text-3xl absolute text-white z-[9999] top-3 left-3" />
      </Link>

      {!gameMode ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {["Single Player", "Multiplayer"].map((mode) => (
            <motion.div
              key={mode}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleSelect("mode", mode)}
              className="card cursor-pointer w-full h-[30vh] md:h-48 rounded-2xl flex items-center justify-center text-xl md:text-2xl font-semibold shadow-lg transition-all duration-200 ease-in-out hover:shadow-2xl"
              style={{
                backgroundColor:
                  mode === "Single Player" ? "#3b82f6" : "#a855f7",
              }}
            >
              {mode}
            </motion.div>
          ))}
        </motion.div>
      ) : gameMode === "Multiplayer" && !roomOption ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-xl mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {["Join Room", "Create Room"].map((option) => (
            <motion.div
              key={option}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleSelect("room", option)}
              className="card cursor-pointer w-full h-[20vh] md:h-40 rounded-2xl flex items-center justify-center text-lg md:text-xl font-semibold shadow-lg transition-all duration-200 ease-in-out hover:shadow-2xl"
              style={{
                backgroundColor: option === "Join Room" ? "#34d399" : "#f59e0b",
              }}
            >
              {option}
            </motion.div>
          ))}
        </motion.div>
      ) : gameMode === "Multiplayer" && roomOption === "Join Room" ? (
        <motion.div
          className="mt-8 w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-center text-purple-300">
            Enter Room Code
          </h2>
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            placeholder="Room Code"
            className="w-full px-4 py-2 rounded-lg text-gray-900 text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={() => handleSelect("difficulty", "Room Confirmed")}
            className="mt-4 w-full py-2 rounded-md bg-purple-500 text-white hover:bg-purple-600"
          >
            Confirm Room Code
          </button>
        </motion.div>
      ) : !difficulty ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-3 w-full max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {["Easy", "Medium", "Hard"].map((level) => (
            <motion.div
              key={level}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleSelect("difficulty", level)}
              className="card cursor-pointer w-full h-[15vh] md:h-40 rounded-2xl flex items-center justify-center text-lg md:text-xl font-semibold shadow-lg transition-all duration-200 ease-in-out hover:shadow-2xl"
              style={{
                backgroundColor:
                  level === "Easy"
                    ? "#22c55e"
                    : level === "Medium"
                    ? "#facc15"
                    : "#ef4444",
              }}
            >
              {level}
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="status mt-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-[#33334d] p-6 md:p-8 rounded-2xl shadow-lg max-w-lg text-center w-[90vw]">
            <h2 className="text-3xl font-bold mb-4 text-purple-300">
              Game Status
            </h2>
            <p className="text-xl mb-2">
              Mode:{" "}
              <span className="font-semibold text-blue-400">{gameMode}</span>
            </p>
            {roomOption === "Join Room" && (
              <p className="text-xl mb-2">
                Room Code:{" "}
                <span className="font-semibold text-yellow-400">
                  {roomCode}
                </span>
              </p>
            )}
            <p className="text-xl">
              Difficulty:{" "}
              <span className="font-semibold text-yellow-400">
                {difficulty}
              </span>
            </p>
            <button className="button">{roomOption ? "Create Room" : "Start Game"}</button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
