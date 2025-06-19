// frontend/src/components/GameScreen.jsx
import React from "react";
import XPBar from "./XPBar";
import TranslationCard from "./TranslationCard";
import TreeVisual from "./TreeVisual";
import "./GameScreen.css";

const GameScreen = ({
  xp,
  level,
  sourceText,
  options,
  onSelectTranslation,
  selectedId,
  username
}) => {
  return (
    <div className="game-container">
      <XPBar xp={xp} level={level} />
      <TreeVisual level={level} treeName={username} />

      <div className="source-text">
        <h2>Select the published  translation and watch your tree blossom </h2>
        <p>{sourceText}</p>
      </div>

      <div className="translation-options">
        {options.map((option) => (
          <TranslationCard
            key={option.id}
            id={option.id}
            text={option.text}
            selected={selectedId === option.id}
            onClick={() => onSelectTranslation(option.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default GameScreen;
