import { useEffect, useRef } from "react";

export const UserInput = ({
  userInput,
  setUserInput,
  gameOver,
  setStartTime,
  promptText,
  setGameOver,
}: {
  userInput: string;
  setUserInput: React.Dispatch<React.SetStateAction<string>>;
  gameOver: boolean;
  setStartTime: React.Dispatch<React.SetStateAction<number | null>>;
  promptText: string;
  setGameOver: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameOver) return;
    const value = e.target.value;

    if (!userInput) {
      setStartTime(Date.now());
    }

    setUserInput(value);
    if (value.length >= promptText.length) {
      setGameOver(true);
    }
  };
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
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
  );
};
