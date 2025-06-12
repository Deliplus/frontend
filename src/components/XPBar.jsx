// frontend/src/components/XPBar.jsx
import React from "react";
import "./XPBar.css";

const XPBar = ({ xp, level }) => {
  const maxXP = 1000;
  const percentage = (xp % maxXP) / maxXP * 100;

  return (
    <div className="xp-bar-container">
      <span>🌟 Level {level}</span>
      <div className="xp-bar">
        <div className="xp-fill" style={{ width: `${percentage}%` }}></div>
      </div>
      <span>{xp % maxXP} / {maxXP} XP</span>
    </div>
  );
};

export default XPBar;
