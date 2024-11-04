import { useState } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { SinglePlayer } from "./SinglePlayer";

export const Game1 = () => {
  const [gameMode, setGameMode] = useState<string | null>(null);
  const [roomOption, setRoomOption] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [roomCode, setRoomCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [display, setDisplay] = useState<number>(0);

  const handleSelect = (type: string, value: string) => {
    if (type === "mode") {
      setGameMode(value);
      setRoomOption(null);
      setDifficulty(null);
      setDuration(null);
      setRoomCode("");
    } else if (type === "room") {
      setRoomOption(value);
      setDifficulty(null);
      setDuration(null);
    } else if (type === "difficulty") {
      setDifficulty(value);
    } else if (type === "duration") {
      setDuration(value);
    }
  };

  const handleSubmit = () => {
    if (gameMode) {
      setLoading(true);
      const timer = setTimeout(() => {
        setDisplay(1);
        setLoading(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  };

  const goHome = () => {
    setGameMode(null);
    setRoomOption(null);
    setDifficulty(null);
    setDuration(null);
    setDisplay(0);
  };

  if (display === 1) {
    return (
      <SinglePlayer
        duration={duration as string}
        diff={difficulty as string}
        home={goHome}
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center max-h-screen overflow-y-scroll text-white p-4">
      <h1 className="text-4xl font-bold mb-3 text-center mt-5 drop-shadow-lg">
        Galactic Game Setup
      </h1>
      <Link to="/">
        <FaArrowLeft className="text-3xl absolute text-white z-[9999] top-3 left-3" />
      </Link>
      {/* Game Mode Selection */}
      <div className="flex flex-col items-center mt-5">
        <h2 className="text-2xl mb-3">Select Game Mode</h2>
        <div className="flex space-x-4">
          {["Single Player", "Multiplayer"].map((mode) => (
            <motion.button
              key={mode}
              onClick={() => handleSelect("mode", mode)}
              className="relative w-32 h-32 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300"
              whileHover={{ rotateY: 10 }}
            >
              <span className="text-xl font-semibold">{mode}</span>
            </motion.button>
          ))}
        </div>
      </div>
      {/* Room Option Selection */}
      {gameMode === "Multiplayer" && (
        <div className="flex flex-col items-center mt-5">
          <h2 className="text-2xl mb-3">Room Option</h2>
          <div className="flex space-x-4">
            {["Join Room", "Create Room"].map((option) => (
              <motion.button
                key={option}
                onClick={() => handleSelect("room", option)}
                className="relative w-32 h-32 rounded-full bg-gradient-to-r from-green-600 to-blue-600 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300"
                whileHover={{ rotateY: 10 }}
              >
                <span className="text-xl font-semibold">{option}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}
      {/* Enter Room Code */}
      {gameMode === "Multiplayer" && roomOption === "Join Room" && (
        <motion.div className="mt-8 w-full max-w-md">
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
            className="mt-4 w-full py-2 rounded-md bg-purple-500 text-white hover:bg-purple-600 transition-transform transform hover:scale-105"
          >
            Confirm Room Code
          </button>
        </motion.div>
      )}
      {/* Difficulty Selection with 3D Card Effect */}
      {!difficulty && !roomOption && (
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-3 w-full max-w-xl">
          {["Easy", "Medium", "Hard"].map((level) => (
            <motion.div
              key={level}
              whileHover={{ scale: 1.1, rotateX: 10 }}
              onClick={() => handleSelect("difficulty", level.toLowerCase())}
              className="card perspective w-full h-40 rounded-3xl flex items-center justify-center transition-transform duration-300"
              style={{
                backgroundColor:
                  level === "Easy"
                    ? "#22c55e"
                    : level === "Medium"
                    ? "#facc15"
                    : "#ef4444",
                transformStyle: "preserve-3d",
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.5)",
              }}
            >
              <motion.div
                className="card-inner rounded-3xl bg-gray-800 w-full h-full flex items-center justify-center shadow-lg"
                style={{ backfaceVisibility: "hidden" }}
              >
                <span className="text-lg md:text-xl font-semibold text-white">
                  {level}
                </span>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      )}
      {/* Duration Selection */}
      {difficulty && (
        <div className="flex flex-col items-center mt-5">
          <h2 className="text-2xl mb-3">Select Duration</h2>
          <div className="flex space-x-4">
            {["1 Minute", "2 Minutes", "5 Minutes"].map((durationOption) => (
              <motion.button
                key={durationOption}
                onClick={() => handleSelect("duration", durationOption)}
                className="relative w-32 h-32 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300"
              >
                <span className="text-xl font-semibold">{durationOption}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}
      {/* Start Game Button */}
      {duration && (
        <button
          onClick={handleSubmit}
          className="mt-10 py-2 px-4 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-transform transform hover:scale-105"
        >
          Start Game
        </button>
      )}
      {/* Loading Animation */}
      {loading && (
        <motion.div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black opacity-75 z-50">
          <div className="flex flex-col items-center">
            <div className="loader"></div>
            <span className="mt-2 text-white">Loading...</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};
