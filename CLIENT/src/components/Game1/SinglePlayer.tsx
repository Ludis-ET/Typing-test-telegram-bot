import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { generateRandomPrompt } from "./GenerateP";
import { calculateWPMAndAccuracy } from "./CalculateWPM";

export const SinglePlayer = ({
  duration,
  diff,
  home,
}: {
  duration: string;
  diff: string;
  home: () => void;
}) => {
  const durationInSeconds =
    parseInt(duration.split(" ")[0]) *
    (duration.split(" ")[1] === "min" ? 60 : 1);

  const [userInput, setUserInput] = useState<string>("");
  const [promptText, setPromptText] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(durationInSeconds);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [wpm, setWPM] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);

  const textContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setPromptText(generateRandomPrompt(diff, durationInSeconds));
  }, [diff, durationInSeconds]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeLeft > 0 && !gameOver) {
        setTimeLeft((prev) => prev - 1);
      } else if (timeLeft <= 0) {
        setGameOver(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [gameOver, timeLeft]);

  useEffect(() => {
    if (gameOver) {
      const endTime = Date.now();
      const timeTakenMinutes = startTime ? (endTime - startTime) / 60000 : 0;
      const {
                netWPM,
        accuracy: calculatedAccuracy,
      } = calculateWPMAndAccuracy(promptText, userInput, timeTakenMinutes);

      setWPM(netWPM);
      setAccuracy(calculatedAccuracy);
    }
  }, [gameOver, userInput, promptText, startTime]);

  useEffect(() => {
    if (textContainerRef.current) {
      const inputIndex = userInput.length;
      const scrollToIndex = Math.max(0, inputIndex - 10);
      const targetElement = textContainerRef.current.children[scrollToIndex];
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [userInput, promptText]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameOver) return;
    const value = e.target.value;

    if (!startTime) {
      setStartTime(Date.now());
    }

    setUserInput(value);
    if (value.length >= promptText.length) {
      setGameOver(true);
    }
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

  const handlePlayAgain = () => {
    setGameOver(false);
    setUserInput("");
    setTimeLeft(durationInSeconds);
    setStartTime(null);
    setPromptText(generateRandomPrompt(diff, durationInSeconds));
    setWPM(null);
    setAccuracy(null);
  };

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center p-6 max-w-[90vw] mx-auto bg-gradient-to-r from-red-500 to-red-700 rounded-lg shadow-2xl text-white">
        <h2 className="text-3xl font-extrabold mb-4 text-center tracking-wider">
          Game Over
        </h2>
        {wpm !== null && accuracy !== null && (
          <>
            <p className="text-lg mb-2">Your Results:</p>
            <p className="text-lg">WPM: {wpm.toFixed(2)}</p>
            <p className="text-lg">Accuracy: {accuracy.toFixed(2)}%</p>
          </>
        )}
        <button onClick={handlePlayAgain} className="button">
          Play Again
        </button>
        <button onClick={home} className="button">
          Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 max-w-[90vw] mx-auto bg-transparent rounded-lg shadow-2xl text-white">
      <h2 className="text-3xl font-extrabold mb-4 text-center tracking-wider">
        Good Luck
      </h2>
      <div className="mb-6 text-lg tracking-wide font-medium">
        Time Left: <span className="text-yellow-300">{timeLeft} sec</span>
      </div>

      <div
        ref={textContainerRef}
        className="bg-gray-900 w-[90vw] p-4 rounded-md outline-none max-h-[60vh] overflow-y-scroll"
      >
        <input
          type="text"
          id="input"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Start typing here..."
          autoFocus
          autoComplete="off"
          autoCapitalize="off"
          className="opacity-0 absolute"
        />
        {renderTextWithColors()}
      </div>
    </div>
  );
};
