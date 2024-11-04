export const ResultsDisplay = ({
  wpm,
  accuracy,
  handlePlayAgain,
  home,
}: {
  wpm: number | null;
  accuracy: string | null;
  handlePlayAgain: () => void;
  home: () => void;
}) => (
  <div className="flex flex-col items-center justify-center p-6 max-w-[90vw] mx-auto bg-gradient-to-br from-red-500 to-red-700 rounded-lg shadow-2xl text-white">
    <h2 className="text-4xl font-extrabold mb-4 text-center tracking-wider drop-shadow-lg">
      Game Over
    </h2>
    {wpm !== null && accuracy !== null && (
      <>
        <p className="text-xl mb-2">Your Results:</p>
        <p className="text-xl font-semibold">
          WPM: <span className="text-yellow-300">{wpm.toFixed(2)}</span>
        </p>
        <p className="text-xl font-semibold">
          Accuracy: <span className="text-yellow-300">{accuracy}</span>
        </p>
      </>
    )}
    <div className="flex space-x-4 mt-6">
      <button
        onClick={handlePlayAgain}
        className="px-6 py-2 bg-yellow-400 text-gray-800 rounded-lg shadow hover:bg-yellow-500 transition duration-200"
      >
        Play Again
      </button>
      <button
        onClick={home}
        className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg shadow transition duration-200"
      >
        Home
      </button>
    </div>
  </div>
);
