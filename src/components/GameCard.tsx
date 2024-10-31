import { motion } from "framer-motion";
import { GameCardProps } from "../types/Games";

export const GameCard = ({ game }: GameCardProps) => {
  return (
    <motion.div
      className="w-full h-[40vh] rounded-t-full bg-white flex flex-col items-center justify-center text-center border-b-4 border-purple-darker shadow-lg absolute bottom-0"
      initial={{ rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      <div className="absolute top-[-40px] text-purple-darker">{game.icon}</div>
      <h2 className="text-2xl font-bold mb-2 text-purple-dark">{game.title}</h2>
      <p className="text-sm text-purple-dark">
        {game.available ? game.description : "Coming Soon..."}
      </p>
    </motion.div>
  );
};
