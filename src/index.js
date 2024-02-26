import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import { AdminContextProvider } from "./context/AdminContext";
import { GameContextProvider } from "./context/GameContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <AdminContextProvider>
        <GameContextProvider>
          <App />
        </GameContextProvider>
      </AdminContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
