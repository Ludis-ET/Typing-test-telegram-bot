import { motion } from "framer-motion";
import {
  FaKeyboard,
  FaLock,
  FaPuzzlePiece,
  FaRocket,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { Game } from "../types/Games";
import { useState } from "react";
import { GameCard } from "./GameCard";

const games: Game[] = [
  {
    title: "Typing Test",
    description: "Test your typing speed and accuracy!",
    icon: <FaKeyboard className="text-6xl" />,
    available: true,
  },
  {
    title: "Memory Match",
    description: "Match pairs as quickly as possible!",
    icon: <FaPuzzlePiece className="text-6xl" />,
    available: false,
  },
  {
    title: "Puzzle Challenge",
    description: "Solve puzzles to train your brain.",
    icon: <FaRocket className="text-6xl" />,
    available: false,
  },
  {
    title: "Speed Clicker",
    description: "How fast can you click? Coming soon!",
    icon: <FaLock className="text-6xl" />,
    available: false,
  },
];

export const Home = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [rotateTo, setRotateTo] = useState(false);

  const handleLeftClick = () => {
    setRotateTo(false);
    setSelectedIndex((prev) => (prev - 1 + games.length) % games.length);
  };

  const handleRightClick = () => {
    setRotateTo(true);
    setSelectedIndex((prev) => (prev + 1) % games.length);
  };

  const selectedGame = games[selectedIndex];

  return (
    <>
      <h1 className="text-4xl font-bold my-4 text-white">LeoTYPE Games</h1>
      <p className="text-sm text-center mb-6 text-gray-400">
        Discover games to test your skills! Click the arrows to explore.
      </p>

      

      <div className="flex items-center justify-center w-full absolute bottom-0">
        <div className="aboslute bottom-[50vh] z-[99]">
          <button
            onClick={handleLeftClick}
            className="text-white p-2 rounded-full hover:bg-purple-700 transition-colors duration-300"
          >
            <FaArrowLeft className="text-3xl" />
          </button>

          <button
            onClick={handleRightClick}
            className="text-white p-2 rounded-full hover:bg-purple-700 transition-colors duration-300"
          >
            <FaArrowRight className="text-3xl" />
          </button>
        </div>
        <motion.div
          className="w-full mx-4 absolute bottom-0  "
          animate={{ rotate: rotateTo ? 360 : -360 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <GameCard game={selectedGame} />
        </motion.div>
      </div>

      <div className="absolute bottom-0 w-full h-[40vh] bg-gradient-to-t from-purple-darker to-transparent rounded-t-full shadow-lg"></div>
    </>
  );
};
