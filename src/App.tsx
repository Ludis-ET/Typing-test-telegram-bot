// App.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaKeyboard, FaLock, FaPuzzlePiece, FaRocket } from "react-icons/fa";
import { GameCard } from "./components";

const games = [
  {
    title: "Typing Test",
    description: "Test your typing speed and accuracy!",
    icon: <FaKeyboard className="text-purple-darker text-6xl" />,
    available: true,
  },
  {
    title: "Memory Match",
    description: "Match pairs as quickly as possible!",
    icon: <FaPuzzlePiece className="text-purple-darker text-6xl" />,
    available: true,
  },
  {
    title: "Puzzle Challenge",
    description: "Solve puzzles to train your brain.",
    icon: <FaRocket className="text-purple-darker text-6xl" />,
    available: true,
  },
  {
    title: "Speed Clicker",
    description: "How fast can you click? Coming soon!",
    icon: <FaLock className="text-purple-darker text-6xl" />,
    available: false,
  },
];

const App: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleDragEnd = (_: MouseEvent | TouchEvent, info: { offset: { x: number } }) => {
    if (info.offset.x < -100) {
      setSelectedIndex((prev) => (prev + 1) % games.length);
    } else if (info.offset.x > 100) {
      setSelectedIndex((prev) => (prev - 1 + games.length) % games.length);
    }
  };

  const selectedGame = games[selectedIndex];

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-purple-start to-purple-end text-gray-900 font-sans p-6">
      <h1 className="text-4xl font-bold mb-4 text-purple-darker">
        LeoTYPE Games
      </h1>
      <p className="text-sm text-center mb-6 text-purple-dark">
        Discover games to test your skills! Swipe to explore.
      </p>

      <div className="w-full flex items-center justify-center absolute bottom-0">
        <motion.div
          className="w-full cursor-pointer"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          whileDrag={{ rotate: selectedIndex % 2 === 0 ? -15 : 15 }}
          animate={{ rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <GameCard game={selectedGame} />
        </motion.div>
      </div>

      <div className="absolute bottom-0 w-full h-[40vh] bg-gradient-to-t from-purple-darker to-transparent rounded-t-full shadow-lg"></div>
    </div>
  );
};

export default App;
