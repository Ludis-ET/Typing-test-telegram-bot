import { useState } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { SinglePlayer } from "./SinglePlayer";
import { Mode } from "./Select";

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
    <div className="flex flex-col items-center justify-center max-h-screen text-white p-4">
      {/* <h1 className="text-4xl font-bold mb-3 text-center mt-5 drop-shadow-lg">
        Galactic Game Setup
      </h1> */}
      <Link to="/">
        <FaArrowLeft className="text-3xl absolute text-white z-[9999] top-3 left-3" />
      </Link>
      <div>
        <div className="flex flex-col gap-8 items-center justify-center">
          <p className="text-xl font-bold">Single Player</p>
          <Mode />
          <p className="text-xl font-bold">Multiplayer</p>
        </div>
        <div>
          
        </div>
      </div>
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
