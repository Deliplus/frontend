// frontend/src/components/TranslationCard.jsx
import React from "react";
import "./TranslationCard.css";

const TranslationCard = ({ id, text, selected, onClick }) => {
  return (
    <div
      className={`translation-card ${selected ? "selected" : ""}`}
      onClick={() => onClick(id)}
    >
      <p>{text}</p>
    </div>
  );
};

export default TranslationCard;
