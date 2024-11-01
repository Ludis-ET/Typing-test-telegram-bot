import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { calculateWPMAndAccuracy } from "./algorithm";

export const SinglePlayer = ({
  duration,
  diff,
}: {
  duration: string;
  diff: string;
}) => {
  const [userInput, setUserInput] = useState<string>("");
  const [promptText] = useState<string>(
    "The quick brown fox jumps over the lazy dog."
  );
  const [timeLeft, setTimeLeft] = useState<number>(
    parseInt(duration.split(" ")[0]) *
      (duration.split(" ")[1] === "min" ? 60 : 1)
  );
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<string>("0/0");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 || userInput === promptText) {
      // Calculate WPM and accuracy when the game ends
      const { wpm, accuracy } = calculateWPMAndAccuracy(userInput, promptText);
      setWpm(wpm);
      setAccuracy(accuracy);
      setGameOver(true);
    }
  }, [timeLeft, userInput, promptText, gameOver]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);
    if (!isTyping) setIsTyping(true);
  };

  const renderTextWithColors = () => {
    return (
      <label
        htmlFor="input"
        className="text-2xl tracking-wide whitespace-pre-wrap"
      >
        {promptText.split("").map((char, idx) => {
          let colorClass = "";
          if (userInput[idx] === char) {
            colorClass = "text-green-500";
          } else if (userInput[idx] && userInput[idx] !== char) {
            colorClass = "text-red-500";
          } else {
            colorClass = "text-gray-400";
          }
          return (
            <motion.span
              key={idx}
              className={colorClass}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1 }}
            >
              {char}
            </motion.span>
          );
        })}
      </label>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 max-w-[90vw] mx-auto bg-gradient-to-br from-indigo-600 to-purple-700 rounded-lg shadow-2xl text-white">
      <h2 className="text-3xl font-extrabold mb-4 text-center tracking-wider">
        Typing Mastery - {diff} Mode
      </h2>
      <div className="mb-6 text-lg tracking-wide font-medium">
        Time Left: <span className="text-yellow-300">{timeLeft} sec</span>
      </div>
      <div className="mb-6 text-lg tracking-wide font-medium">
        WPM:{" "}
        <span className="text-yellow-300">
          {isTyping && !gameOver ? wpm : 0}
        </span>
      </div>
      <div className="mb-6 text-lg tracking-wide font-medium">
        Accuracy:{" "}
        <span className="text-yellow-300">
          {isTyping && !gameOver ? accuracy : "0/0"}
        </span>
      </div>

      <div className="bg-gray-900 w-full p-4 rounded-md outline-none">
        {renderTextWithColors()}
        <input
          type="text"
          id="input"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Start typing here..."
          autoFocus
          autoComplete="off"
          autoCapitalize="off"
          className="opacity-0"
        />
      </div>
      {gameOver && (
        <div className="mt-4 text-red-300">
          Game Over! Your WPM: {wpm}, Accuracy: {accuracy}
        </div>
      )}
    </div>
  );
};
