import { useEffect } from "react";
import { db } from "../../../firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useAuth } from "../../../context";

export const ResultsDisplay = ({
  wpm,
  accuracy,
  handlePlayAgain,
  home,
  duration,
  difficulty,
}: {
  wpm: number | null;
  accuracy: string | null;
  handlePlayAgain: () => void;
  home: () => void;
  duration: string;
  difficulty: string;
}) => {
  const { user } = useAuth();
  const maxWPM = 120;

  useEffect(() => {
    const saveGameResults = async () => {
      if (user && wpm !== null && accuracy !== null) {
        try {
          const singleplayerRef = collection(db, "singleplayers");

          await addDoc(singleplayerRef, {
            userId: user.id,
            username: user.username,
            duration,
            difficulty,
            wpm,
            accuracy,
            timestamp: serverTimestamp(),
          });
          console.log("Game results saved to Firestore!");
        } catch (error) {
          console.error("Error saving game results: ", error);
        }
      }
    };

    saveGameResults();
  }, [user, wpm, accuracy, duration, difficulty]);

  return (
    <div className="flex flex-col items-center w-full justify-center h-screen">
      <h1 className="text-2xl font-bold mb-8">YOUR RESULT.</h1>

      <div className="relative flex flex-col items-center justify-center w-56 h-56 mb-8 font-bold">
        <CircularProgressbar
          value={wpm ?? 0}
          maxValue={maxWPM}
          text={`${wpm?.toFixed(0) ?? 0} WPM`}
          styles={buildStyles({
            textSize: "16px",
            pathColor: "#000",
            textColor: "#fff",
            trailColor: "#d1d5db",
          })}
        />
      </div>
      <div className="flex flex-col w-full px-12 gap-2 mb-4">
        <div className="flex justify-around items-center">
          <div className="border-b pb-2 border-gray-500">
            <p className="text-lg font-bold text-white">Accuracy</p>
            <p className="text-gray-400 text-md">{accuracy}</p>
          </div>
          <div className="border-b pb-2 border-gray-500">
            <p className="text-lg font-bold text-white">Time Taken</p>
            <p className="text-gray-400 text-md">{duration}</p>
          </div>
        </div>
        <div className="flex justify-around items-center">
          <div className="border-b pb-2 border-gray-500">
            <p className="text-lg font-bold text-white">Difficulty</p>
            <p className="text-gray-400 text-md">{difficulty}</p>
          </div>
          <div className="border-b pb-2 border-gray-500">
            <p className="text-lg font-bold text-white">Others Av'</p>
            <p className="text-gray-400 text-md">40 WPM</p>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <button
          onClick={handlePlayAgain}
          className="px-4 py-2 bg-gray-800 text-white font-bold rounded-md shadow"
        >
          Play Again
        </button>
        <button
          onClick={home}
          className="px-4 py-2 bg-gray-800 text-white font-bold rounded-md shadow"
        >
          Home
        </button>
        <button className="px-4 py-2 bg-gray-800 text-white font-bold rounded-md shadow">
          Exit
        </button>
      </div>
    </div>
  );
};
