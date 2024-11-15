import React, { useState } from "react";

const App: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<string>("normal");
  const [selectedDuration, setSelectedDuration] = useState<string>("15s");

  const handleMultiplayerClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDifficultyChange = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
  };

  const handleDurationChange = (duration: string) => {
    setSelectedDuration(duration);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-amber-50 text-gray-900 font-poppins max-w-[100vw] overflow-x-hidden px-8">
      <h1 className="text-4xl font-bold mb-6">Typing Contest</h1>
      <div className="flex space-x-4 mb-6 mx-2">
        <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-full transition">
          Single Player
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition"
          onClick={handleMultiplayerClick}
        >
          Multiplayer
        </button>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full">
            <h2 className="text-2xl font-semibold mb-4">Multiplayer Game</h2>
            <p className="mb-4 text-center text-lg text-gray-600 animate-pulse">
              🚧 Coming Soon 🚧
            </p>
            <p className="mb-6 text-center text-sm text-gray-500">
              We are working hard to bring multiplayer gameplay to you!
            </p>
            <button
              className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full"
              onClick={handleCloseModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-row-reverse gap-4 space-x-4 p-5">
        <label className="relative flex items-center cursor-pointer">
          <input
            className="sr-only peer"
            name="difficulty-radio"
            type="radio"
            value="hard"
            checked={selectedDifficulty === "hard"}
            onChange={() => handleDifficultyChange("hard")}
          />
          <div className="w-6 h-6 bg-transparent border-2 border-red-500 rounded-full peer-checked:bg-red-500 peer-checked:border-red-500 peer-hover:shadow-lg peer-hover:shadow-red-500/50 peer-checked:shadow-lg peer-checked:shadow-red-500/50 transition duration-300 ease-in-out"></div>
          <span className="ml-2 text-red-500">Hard</span>
        </label>
        <label className="relative flex items-center cursor-pointer">
          <input
            className="sr-only peer"
            name="difficulty-radio"
            type="radio"
            value="normal"
            checked={selectedDifficulty === "normal"}
            onChange={() => handleDifficultyChange("normal")}
          />
          <div className="w-6 h-6 bg-transparent border-2 border-yellow-500 rounded-full peer-checked:bg-yellow-500 peer-checked:border-yellow-500 peer-hover:shadow-lg peer-hover:shadow-yellow-500/50 peer-checked:shadow-lg peer-checked:shadow-yellow-500/50 transition duration-300 ease-in-out"></div>
          <span className="ml-2 text-yellow-700">Normal</span>
        </label>
        <label className="relative flex items-center cursor-pointer">
          <input
            className="sr-only peer"
            name="difficulty-radio"
            type="radio"
            value="easy"
            checked={selectedDifficulty === "easy"}
            onChange={() => handleDifficultyChange("easy")}
          />
          <div className="w-6 h-6 bg-transparent border-2 border-green-500 rounded-full peer-checked:bg-green-500 peer-checked:border-green-500 peer-hover:shadow-lg peer-hover:shadow-green-500/50 peer-checked:shadow-lg peer-checked:shadow-green-500/50 transition duration-300 ease-in-out"></div>
          <span className="ml-2 text-green-600">Easy</span>
        </label>
      </div>
      <div className="container flex flex-col gap-4 items-center justify-center">
        <div className="de">
          <div className="den">
            <hr className="line" />
            <hr className="line" />
            <hr className="line" />

            <div className="switch">
              <label htmlFor="duration_15s">
                <span>15s</span>
              </label>
              <label htmlFor="duration_30s">
                <span>30s</span>
              </label>
              <label htmlFor="duration_90s">
                <span>90s</span>
              </label>
              <label htmlFor="duration_1m">
                <span>1m</span>
              </label>
              <label htmlFor="duration_3m">
                <span>3m</span>
              </label>
              <label htmlFor="duration_5m">
                <span>5m</span>
              </label>

              <input
                type="radio"
                name="duration"
                id="duration_15s"
                checked={selectedDuration === "15s"}
                onChange={() => handleDurationChange("15s")}
              />
              <input
                type="radio"
                name="duration"
                id="duration_30s"
                checked={selectedDuration === "30s"}
                onChange={() => handleDurationChange("30s")}
              />
              <input
                type="radio"
                name="duration"
                id="duration_90s"
                checked={selectedDuration === "90s"}
                onChange={() => handleDurationChange("90s")}
              />
              <input
                type="radio"
                name="duration"
                id="duration_1m"
                checked={selectedDuration === "1m"}
                onChange={() => handleDurationChange("1m")}
              />
              <input
                type="radio"
                name="duration"
                id="duration_3m"
                checked={selectedDuration === "3m"}
                onChange={() => handleDurationChange("3m")}
              />
              <input
                type="radio"
                name="duration"
                id="duration_5m"
                checked={selectedDuration === "5m"}
                onChange={() => handleDurationChange("5m")}
              />

              <div className="light">
                <span></span>
              </div>

              <div className="dot">
                <span></span>
              </div>

              <div className="dene">
                <div className="denem">
                  <div className="deneme"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button className="button mt-4">Start</button>
    </div>
  );
};

export default App;
