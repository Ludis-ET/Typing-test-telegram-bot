import { Route, Routes } from "react-router-dom";
import { Home, Game1 } from "./components";

const App = () => {
  return (
    <div className="relative h-screen overflow-hidden flex flex-col items-center justify-start font-sans text-purple-light p-6">
      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:#000;]"></div>

      <Routes>
        <Route path="*" element={<Home />} />
        <Route path="/game1" element={<Game1 />} />
      </Routes>
    </div>
  );
};

export default App;
