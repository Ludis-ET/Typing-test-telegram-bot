import { Route, Routes } from "react-router-dom";
import { Home } from "./components";

const App = () => {
  return (
    <div className="h-screen overflow-hidden flex flex-col items-center justify-start bg-gradient-to-br from-purple-start to-purple-end text-gray-900 font-sans p-6">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
};

export default App;
