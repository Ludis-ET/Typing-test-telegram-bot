import { Route, Routes } from "react-router-dom";
import { Home, Game1 } from "./components";
import { motion } from "framer-motion";
import { connect, getConnectedAddress } from "@joyid/evm";
import { useEffect, useState } from "react";

const App = () => {
  const [address, setAddress] = useState(getConnectedAddress());
  useEffect(() => {
    const onConnect = async () => {
      try {
        const res = await connect();
        setAddress(res);
      } catch (error) {
        console.log(error);
      }
    };
    onConnect();
  }, []);
  console.log(address)
  return (
    <div className="relative h-screen overflow-hidden flex flex-col items-center justify-start font-sans text-purple-light p-6">
      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:#000;]"></div>
      <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden">
        <div className="relative h-full w-full [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
          {[...Array(100)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full opacity-70"
              style={{
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{ y: ["0%", "20%", "0%"] }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
      </div>
      <Routes>
        <Route path="*" element={<Home />} />
        <Route path="/game1" element={<Game1 />} />
      </Routes>
    </div>
  );
};

export default App;
