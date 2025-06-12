// frontend/src/components/NameInput.jsx
import React, { useState } from "react";
import "./NameInput.css";

const NameInput = ({ onSubmit }) => {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className="name-input-screen">
      <h2 className="name-title">🌸Name your tree🌸</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="name-input"
      />
      <button onClick={handleSubmit} className="name-submit-button">
        Begin Adventure
      </button>
    </div>
  );
};

export default NameInput;
