import { motion } from "framer-motion";
import { GameCardProps } from "../types/Games";

export const GameCard = ({ game }: GameCardProps) => {
  return (
    <motion.div
      className="w-full h-[40vh] rounded-t-full bg-white flex flex-col items-center justify-center p-4 text-center border-b-4 border-purple-darker shadow-lg absolute bottom-0"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute top-[-40px] text-purple-darker">{game.icon}</div>
      <h2 className="text-xl font-bold mb-2 text-purple-dark">{game.title}</h2>
      <p className="text-sm text-purple-dark">
        {game.available ? game.description : "Coming Soon..."}
      </p>
    </motion.div>
  );
};
