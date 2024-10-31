// App.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import GameCard from "./GameCard";
import { FaKeyboard, FaLock, FaPuzzlePiece, FaRocket } from "react-icons/fa";

const games = [
  {
    title: "Typing Test",
    description: "Test your typing speed and accuracy!",
    icon: <FaKeyboard className="text-purple-darker text-4xl" />,
    available: true,
  },
  {
    title: "Memory Match",
    description: "Match pairs as quickly as possible!",
    icon: <FaPuzzlePiece className="text-purple-darker text-4xl" />,
    available: true,
  },
  {
    title: "Puzzle Challenge",
    description: "Solve puzzles to train your brain.",
    icon: <FaRocket className="text-purple-darker text-4xl" />,
    available: true,
  },
  {
    title: "Speed Clicker",
    description: "How fast can you click? Coming soon!",
    icon: <FaLock className="text-purple-darker text-4xl" />,
    available: false,
  },
];

const App: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleDragEnd = (_, info) => {
    if (info.offset.x < -100) {
      setSelectedIndex((prev) => (prev + 1) % games.length); // Swipe left, next game
    } else if (info.offset.x > 100) {
      setSelectedIndex((prev) => (prev - 1 + games.length) % games.length); // Swipe right, previous game
    }
  };

  const selectedGame = games[selectedIndex];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-start to-purple-end text-gray-900 font-sans p-6">
      <h1 className="text-4xl font-bold mb-4 text-purple-darker">
        LeoTYPE Games
      </h1>
      <p className="text-sm text-center mb-6 text-purple-dark">
        Discover games to test your skills! Swipe to explore.
      </p>

      <motion.div
        className="flex items-center justify-center w-full cursor-pointer"
        drag="x"
        onDragEnd={handleDragEnd}
        dragConstraints={{ left: 0, right: 0 }}
      >
        <GameCard game={selectedGame} />
      </motion.div>
    </div>
  );
};

export default App;
