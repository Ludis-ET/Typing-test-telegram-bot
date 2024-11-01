import { motion } from "framer-motion";
import { GameCardProps } from "../types/Games";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export const GameCard = ({ game }: GameCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setIsExpanded(true);
  };

  useEffect(() => {
    if (isExpanded) {
      const timer = setTimeout(() => {
        navigate("/game1");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isExpanded, navigate]);

  return (
    <motion.div
      className={`w-full ${
        isExpanded ? "h-screen" : "h-[40vh]"
      } rounded-t-full bg-[#0a0a0a] bg-opacity-90 flex flex-col items-center justify-center text-center border-b-4 border-[#63e] shadow-lg absolute bottom-0 
                 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]`}
      initial={{ rotate: 0 }}
      animate={{
        scale: isExpanded ? 1 : 1,
        transition: { duration: 0.5 },
      }}
    >
      {isExpanded ? (
        <motion.div
          key={isExpanded ? "expanded" : "collapsed"}
          className="flex flex-col items-center justify-center h-full relative z-[9999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <h2 className="text-4xl font-bold text-white mb-4">{game.title}</h2>
          <p className="text-lg text-gray-300">{game.description}</p>
          <div className="loader mt-4"></div>
        </motion.div>
      ) : (
        <>
          <h1
            onClick={game.available ? handleClick : undefined}
            className="absolute top-[-40px] text-white hover:bg-[#63e] hover:text-white flex items-center justify-center p-2 rounded-full transition-transform duration-300 ease-in-out transform hover:scale-110 z-[999]"
          >
            {game.icon}
          </h1>
          <h2 className="text-2xl font-bold mb-2 text-white">{game.title}</h2>
          <p className="text-sm text-gray-300">
            {game.available ? game.description : "Coming Soon..."}
          </p>
        </>
      )}
    </motion.div>
  );
};