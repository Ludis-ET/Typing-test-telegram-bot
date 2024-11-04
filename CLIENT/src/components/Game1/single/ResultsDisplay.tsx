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
  <div className="flex flex-col items-center justify-center p-6 max-w-[90vw] mx-auto bg-gradient-to-r from-red-500 to-red-700 rounded-lg shadow-2xl text-white">
    <h2 className="text-3xl font-extrabold mb-4 text-center tracking-wider">
      Game Over
    </h2>
    {wpm !== null && accuracy !== null && (
      <>
        <p className="text-lg mb-2">Your Results:</p>
        <p className="text-lg">WPM: {wpm.toFixed(2)}</p>
        <p className="text-lg">Accuracy: {accuracy}</p>
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
