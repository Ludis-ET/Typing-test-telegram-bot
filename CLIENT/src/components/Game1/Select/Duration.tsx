import { motion } from "framer-motion";

export const Duration = ({
  dur,
  setdur,
}: {
  dur: string;
  setdur: (dur: string | null) => void;
}) => {
  const durations = [15, 30, 60, 180, 300];

  const handleDurationSelect = (duration: number) => {
    setdur(duration < 60 ? `${duration} sec` : `${duration / 60} min`);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mt-4 flex space-x-2">
        {durations.map((duration) => (
          <motion.button
            key={duration}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              dur === (duration < 60 ? `${duration} sec` : `${duration / 60} min`)
                ? "bg-purple-500 text-white"
                : "bg-gray-300 text-black"
            }`}
            onClick={() => handleDurationSelect(duration)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {duration < 60 ? `${duration} sec` : `${duration / 60} min`}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
