import React from "react";
import { Transition } from "@headlessui/react";
import { LightningBoltIcon, LockClosedIcon } from "@heroicons/react/solid";
import TypingTest from "./components/TypingTest"; // This will be your active game component

const games = [
  {
    title: "Typing Test",
    description: "Test your typing speed and accuracy!",
    icon: <LightningBoltIcon className="w-8 h-8 text-white" />,
    available: true,
  },
  {
    title: "Memory Match",
    description: "Match pairs as quickly as possible!",
    icon: <LockClosedIcon className="w-8 h-8 text-white" />,
    available: false,
  },
  {
    title: "Puzzle Challenge",
    description: "Solve puzzles to train your brain.",
    icon: <LockClosedIcon className="w-8 h-8 text-white" />,
    available: false,
  },
  {
    title: "Speed Clicker",
    description: "How fast can you click? Coming soon!",
    icon: <LockClosedIcon className="w-8 h-8 text-white" />,
    available: false,
  },
];

const App: React.FC = () => {
  const [selectedGame, setSelectedGame] = React.useState<string | null>(null);

  const handleSelectGame = (title: string, available: boolean) => {
    if (available) setSelectedGame(title);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-800 via-purple-600 to-purple-400 text-white font-sans">
      <h1 className="text-4xl font-bold mb-6 text-center">LeoTYPE Games</h1>
      <p className="text-lg mb-8 text-center max-w-md">
        Choose a game to play! Test your typing skills or stay tuned for more
        exciting games coming soon.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 w-full max-w-2xl">
        {games.map((game) => (
          <div
            key={game.title}
            onClick={() => handleSelectGame(game.title, game.available)}
            className={`p-6 rounded-xl shadow-lg cursor-pointer transform transition-transform ${
              game.available
                ? "bg-purple-500 hover:scale-105 hover:bg-purple-600"
                : "bg-gray-500 cursor-not-allowed"
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center bg-purple-700 rounded-full p-3">
                {game.icon}
              </div>
              <div>
                <h2 className="text-2xl font-semibold">{game.title}</h2>
                <p className="mt-2 text-sm">{game.description}</p>
                {!game.available && (
                  <p className="mt-1 text-xs italic text-gray-300">
                    Coming soon...
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Game Overlay */}
      <Transition
        show={Boolean(selectedGame)}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full relative">
            <button
              onClick={() => setSelectedGame(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4">{selectedGame}</h3>
            {selectedGame === "Typing Test" && (
              <TypingTest level={1} timeLimit={60} />
            )}
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default App;
