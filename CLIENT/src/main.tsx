import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter as Router } from "react-router-dom";
import { initConfig } from "@joyid/evm";

import App from "./App.tsx";
import "./index.css";

initConfig({
  name: "Ludis",
  logo: "https://imgs.search.brave.com/2hutqGpt34IVl3dFLakp14qVy4vjfDZmwgS5wminJWo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZXJy/aWFtLXdlYnN0ZXIu/Y29tL2Fzc2V0cy9t/dy9pbWFnZXMvcXVp/ei9xdWl6LWdsb2Jh/bC1mb290ZXItcmVj/aXJjL2RvZy1oYXJk/LWhhdC1oYW1tZXIt/MTA4MDYtYjVlYjIw/MmNjNGM0OWQ5NmE1/MDI5YmQyNWQ5YzEy/MjJAMXguanBn",
  joyidAppURL: "https://bot-two-livid.vercel.app/",
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
