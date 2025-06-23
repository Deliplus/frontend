// frontend/src/components/BonusModal.jsx
import React, { useState, useEffect } from "react";
import "./BonusModal.css";

const StarRating = ({ label, value, onChange }) => (
  <div className="rating-section">
    <p>{label}</p>
    <div className="stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= value ? "filled" : ""}`}
          onClick={() => onChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  </div>
);

const BonusModal = ({
  show,
  onClose,
  onSubmit,
  defaultScores = { adequacy: 0, fluency: 0, total: 0 },
  mode= "correct"
}) => {
  const [adequacy, setAdequacy] = useState(0);
  const [fluency, setFluency] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (show) {
      setAdequacy(0);
      setFluency(0);
      setSubmitted(false);
    }
  }, [show]);

  const handleSubmit = () => {
    onSubmit({ adequacy, fluency });
    setSubmitted(true);
  };

  if (!show) return null;
  const title =
    mode === "correct"
      ? "🎉 Bonus Round"
      : "❌ Oops! Not quite, but don't leave empty-handed";
  const subtitle =
    mode === "correct"
      ? "Rate the winning translation:"
      : "Help us by rating this translation! You’ll still earn XP.";

  return (
    <div className="bonus-modal-overlay">
      <div className="bonus-modal">
         <h2 className="modal-title">{title}</h2>
         <p>{subtitle}</p>
         <StarRating label="📝 Adequacy" value={adequacy} onChange={setAdequacy} />
         <StarRating label="💬 Fluency" value={fluency} onChange={setFluency} />

        {!submitted ? (
          <button
            className="submit-rating-button"
            onClick={handleSubmit}
            disabled={adequacy === 0 || fluency === 0}
          >
            Submit Ratings
          </button>
        ) : (
          <>
            <div className="score-breakdown">
              <p>📝 Adequacy: <strong>+{defaultScores.adequacy}</strong> XP</p>
              <p>💬 Fluency: <strong>+{defaultScores.fluency}</strong> XP</p>
              <p>⭐ Total Bonus: <strong>+{defaultScores.total}</strong> XP</p>
            </div>
            <button onClick={onClose} className="close-button">Close</button>
          </>
        )}
      </div>
    </div>
  );
};

export default BonusModal;
