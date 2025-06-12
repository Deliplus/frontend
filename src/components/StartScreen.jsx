// frontend/src/components/StartScreen.jsx
import React from "react";
import "./StartScreen.css";

const StartScreen = ({ onStart }) => {
  return (
    <div className="start-screen">
      <h1 className="game-title">🌸Translate Arena🌸</h1>
      <button className="start-button" onClick={onStart}>
        Start Game
      </button>
    </div>
  );
};

export default StartScreen;
