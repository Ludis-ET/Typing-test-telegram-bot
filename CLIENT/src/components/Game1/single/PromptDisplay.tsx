import { motion } from "framer-motion";

export const PromptDisplay = ({
  promptText,
  userInput,
}: {
  promptText: string;
  userInput: string;
}) => {
  return (
    <label
      htmlFor="input"
      className="text-2xl tracking-wide whitespace-pre-wrap"
    >
      {promptText.split("").map((char, idx) => {
        let colorClass = "";
        if (userInput[idx] === char) {
          colorClass = "text-green-500";
        } else if (userInput[idx] && userInput[idx] !== char) {
          colorClass = "text-red-500";
        } else {
          colorClass = "text-gray-400";
        }
        return (
          <motion.span
            key={idx}
            className={colorClass}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
          >
            {char}
          </motion.span>
        );
      })}
    </label>
  );
};
