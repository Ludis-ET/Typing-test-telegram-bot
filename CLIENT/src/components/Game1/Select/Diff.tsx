import React, { useState } from "react";
import { motion } from "framer-motion";

const difficultyOptions = [
  { label: "Easy", icon: "🌼" }, // You can replace with actual icons
  { label: "Medium", icon: "🌱" },
  { label: "Hard", icon: "🌿" },
  { label: "Nightmare", icon: "🔥" },
];

export const Diff: React.FC = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");

  const handleDifficultySelect = (label: string) => {
    setSelectedDifficulty(label);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col space-y-2">
        {difficultyOptions.map((option) => (
          <motion.div
            key={option.label}
            className={`flex items-center p-2 border rounded-lg cursor-pointer transition-transform transform hover:scale-105 ${
              selectedDifficulty === option.label
                ? "border-blue-500"
                : "border-gray-300"
            }`}
            onClick={() => handleDifficultySelect(option.label)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-2xl mr-2">{option.icon}</span>
            <span className="text-md">{option.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
