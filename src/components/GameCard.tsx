import { motion } from "framer-motion";
import { GameCardProps } from "../types/Games";

export const GameCard = ({ game }: GameCardProps) => {
  return (
    <motion.div
      className="w-64 h-80 rounded-lg shadow-lg bg-white flex flex-col items-center justify-center p-4 text-center"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-purple-darker text-6xl mb-4">{game.icon}</div>
      <h2 className="text-2xl font-bold mb-2 text-purple-dark">{game.title}</h2>
      <p className="text-sm text-purple-dark">
        {game.available ? game.description : "Coming Soon..."}
      </p>
    </motion.div>
  );
};