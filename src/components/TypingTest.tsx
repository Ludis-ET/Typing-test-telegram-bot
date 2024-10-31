import React, { useState, useEffect } from "react";
import { calculateWPM, calculateAccuracy } from "../utils/wpmCalculator";
import { generateParagraph } from "../utils/generator";

interface TypingTestProps {
  level: number;
  timeLimit: number;
}

const TypingTest: React.FC<TypingTestProps> = ({ level, timeLimit }) => {
  const [paragraph, setParagraph] = useState(generateParagraph(level));
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState({ wpm: 0, accuracy: 0 });

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endTest();
    }
  }, [isRunning, timeLeft]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (!isRunning) setIsRunning(true);
  };

  const endTest = () => {
    const wpm = calculateWPM(input.length, timeLimit - timeLeft);
    const accuracy = calculateAccuracy(input, paragraph);
    setResults({ wpm, accuracy });
    setIsRunning(false);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <p className="mb-4 text-lg">{paragraph}</p>
      <input
        type="text"
        className="w-full p-2 mb-4 border rounded"
        value={input}
        onChange={handleInputChange}
        disabled={timeLeft === 0}
        placeholder="Start typing here..."
      />
      <div>
        <p>Time Left: {timeLeft}s</p>
        <p>WPM: {results.wpm}</p>
        <p>Accuracy: {results.accuracy}%</p>
      </div>
      {timeLeft === 0 && (
        <button onClick={() => window.location.reload()}>Restart</button>
      )}
    </div>
  );
};

export default TypingTest;
