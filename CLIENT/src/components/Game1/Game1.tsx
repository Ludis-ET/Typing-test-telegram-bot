import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { SinglePlayer } from "./single/SinglePlayer";
import { Diff, Duration, Mode } from "./Select";

export const Game1 = () => {
  const [roomOption, setRoomOption] = useState<string>("single");
  const [difficulty, setDifficulty] = useState<string>("easy");
  const [duration, setDuration] = useState<string>("1 min");
  const [multi, setMulti] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [display, setDisplay] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userData = window.localStorage.getItem("telegramUser");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = () => {
    // Redirect the user to the Telegram login page
    const telegramLoginUrl = `https://telegram.me/leotypebot?start=login`;
    window.open(telegramLoginUrl, "_self"); // or "_blank" for a new tab
  };

  const handleSubmit = () => {
    setLoading(true);
    const timer = setTimeout(() => {
      setDisplay(1);
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
    return (
      <SinglePlayer
        duration={duration as string}
        diff={difficulty as string}
        home={goHome}
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center max-h-screen text-white p-4">
      {currentUser ? (
        <h1 className="text-center text-3xl">
          Logged in as {currentUser}
        </h1>
      ) : (
        <h1 className="text-center text-3xl">Not logged in</h1>
      )}
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
        <Duration dur={duration as string} setdur={setDuration} />
      </div>
      {roomOption === "single" && (
        <button onClick={handleSubmit} className="button m-8">
          Start Game
        </button>
      )}
      {multi === "join" && roomOption === "multi" && (
        <div className="flex items-center bg-gray-800 rounded-full p-1 w-fit mt-8">
          <input
            type="text"
            name="text"
            className="bg-gray-800 text-white placeholder-gray-400 rounded-l-full px-4 h-8 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="xyz1234"
          />
          <button className="bg-white text-black font-medium rounded-r-full flex items-center justify-center w-24 h-full relative transition-all duration-300 hover:bg-gray-300">
            Join
          </button>
        </div>
      )}
      <div className="flex gap-4 my-8 items-center">
        {roomOption === "multi" && (
          <>
            <button className="button mb-2" onClick={() => setMulti("join")}>
              Join
            </button>
            <button className="button mb-2" onClick={() => setMulti("create")}>
              New
            </button>
          </>
        )}
      </div>

      {/* Telegram Login Button */}
      <button onClick={handleLogin} className="button mb-4">
        Log in with Telegram
      </button>

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
