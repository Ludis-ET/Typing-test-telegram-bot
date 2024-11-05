import { useState } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { SinglePlayer } from "./single/SinglePlayer";
import { Diff, Duration, Mode } from "./Select";
import { MultiPlayerChoose } from "./multi/MultiPlayerChoose";
import { MultiPlayer } from "./multi/MultiPlayer";

export const Game1 = () => {
  const [roomOption, setRoomOption] = useState<string>("single");
  const [difficulty, setDifficulty] = useState<string>("easy");
  const [duration, setDuration] = useState<string>("1 min");
  const [loading, setLoading] = useState<boolean>(false);
  const [display, setDisplay] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [roomType, setRoomType] = useState<string>("");

  const handleSubmit = (n: number) => {
    setLoading(true);
    const timer = setTimeout(() => {
      setDisplay(n);
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  };

  const goHome = () => {
    setRoomOption("single");
    setDifficulty("easy");
    setDuration("1 min");
    setDisplay(0);
  };

  if (display === 1) {
    return <SinglePlayer duration={duration} diff={difficulty} home={goHome} />;
  } else if (display === 2) {
    return (
      <MultiPlayer
        diff={difficulty}
        duration={duration}
        home={goHome}
        roomtype={roomType}
        selected={selectedOption}
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center max-h-screen overflow-y-auto overflow-x-hidden text-white p-4">
      <Link to="/">
        <FaArrowLeft className="text-3xl absolute text-white z-[9999] top-3 left-3" />
      </Link>
      <div className="flex w-full gap-8 my-3">
        <div className="flex flex-col gap-8 items-center justify-center">
          <p className="text-xl font-bold text-center">Single Player</p>
          <Mode room={roomOption} setroom={setRoomOption} />
          <p className="text-xl font-bold text-center">Multiplayer</p>
        </div>
        <div>
          <Diff diff={difficulty} setdiff={setDifficulty} />
        </div>
      </div>
      <div>
        <Duration dur={duration} setdur={setDuration} />
      </div>
      {roomOption === "single" && (
        <button onClick={() => handleSubmit(1)} className="button m-8">
          Start Game
        </button>
      )}
      {roomOption === "multi" && (
        <MultiPlayerChoose
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          roomType={roomType}
          setRoomType={setRoomType}
          submit={handleSubmit}
        />
      )}
      {loading && (
        <motion.div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black opacity-75 z-50">
          <div className="flex flex-col items-center">
            <div className="loader"></div>
            <span className="mt-2 text-white">Loading...</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};
