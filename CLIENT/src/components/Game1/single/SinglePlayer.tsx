import { useState, useEffect, useRef } from "react";
import { generateRandomPrompt } from "../../../utils/GenerateP";
import { calculateWPMAndAccuracy } from "../../../utils/CalculateWPM";
import { PromptDisplay } from "./PromptDisplay";
import { UserInput } from "./UserInput";
import { ResultsDisplay } from "./ResultsDisplay";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { BiRefresh } from "react-icons/bi";

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
  const [accuracy, setAccuracy] = useState<string | null>(null);

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
      const timeTaken = startTime ? (endTime - startTime) / 1000 : 0;
      const { wpm: calculatedWPM, accuracy: calculatedAccuracy } =
        calculateWPMAndAccuracy(userInput, promptText, timeTaken, diff);

      setWPM(calculatedWPM);
      setAccuracy(calculatedAccuracy);
    }
  }, [gameOver, userInput, promptText, startTime, diff]);

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
      <ResultsDisplay
        wpm={wpm}
        accuracy={accuracy}
        handlePlayAgain={handlePlayAgain}
        home={home}
        duration={duration}
        difficulty={diff}
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 max-w-[90vw] mx-auto bg-transparent rounded-lg shadow-2xl text-white">
      <h2 className="text-3xl font-extrabold mb-4 text-center tracking-wider flex gap-4">
        Good Luck{" "}
        <BiRefresh className="cursor-pointer" onClick={handlePlayAgain} />
      </h2>
      <Link to="/">
        <FaArrowLeft className="text-3xl absolute text-white z-[9999] top-3 left-3" />
      </Link>
      <div className="mb-6 text-lg tracking-wide font-medium">
        Time Left: <span className="text-yellow-300">{timeLeft} sec</span>
      </div>
      <div
        ref={textContainerRef}
        className="bg-gray-900 w-[90vw] p-4 rounded-md outline-none max-h-[60vh] overflow-y-scroll"
      >
        <UserInput
          userInput={userInput}
          setUserInput={setUserInput}
          gameOver={gameOver}
          setStartTime={setStartTime}
          promptText={promptText}
          setGameOver={setGameOver}
        />
        <PromptDisplay promptText={promptText} userInput={userInput} />
      </div>
    </div>
  );
};
