// frontend/src/App.jsx
import React, { useState, useEffect } from "react";
import "./App.css";
import StartScreen from "./components/StartScreen";
import NameInput from "./components/NameInput";
import GameScreen from "./components/GameScreen";
import BonusModal from "./components/BonusModal";
import "./components/BonusModal.css";
import "./components/TranslationCard.css";
import "./components/GameScreen.css";
import "./components/StartScreen.css";
import "./components/NameInput.css";

function App() {
  const [stage, setStage] = useState("start");
  const [username, setUsername] = useState("");
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [sourceText, setSourceText] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [correctId, setCorrectId] = useState("");
  const [showBonus, setShowBonus] = useState(false);
  const [bonusScores, setBonusScores] = useState({ adequacy: 0, fluency: 0, total: 0 });

  const loadTranslation = async () => {
    const res = await fetch("https://backend-r5dx.onrender.com/translation-duel");
    const data = await res.json();
    setSourceText(data.source);
    setOptions(data.options);
    setCorrectId(data.correct_id); 
    setSelectedId(null);
    setBonusScores({ adequacy: 0, fluency: 0, total: 0 });
  };

  useEffect(() => {
    if (stage === "game") {
      loadTranslation();
    }
  }, [stage]);

  const handleTranslationSelect = (id) => {
    setSelectedId(id);
    if (id === correctId) {
      const baseXP = 10;
      const newXP = xp + baseXP;
      setXp(newXP);
      setLevel(Math.floor(newXP / 100) + 1);
      setShowBonus(true);
    } else {
      alert("You missed!");
      setTimeout(() => loadTranslation(), 800);
    }
  };

  const handleBonusSubmit = async ({ adequacy, fluency }) => {
    try {
      const res = await fetch("https://backend-r5dx.onrender.com/submit-evaluation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: username,
          source: sourceText,
          chosen_id: selectedId,  // <-- make sure this is set
          adequacy,
          fluency,
        }),
      });

    const data = await res.json();

      if (data.status === "ok") {
        const { adequacy_xp, fluency_xp, bonus } = data;
        const bonusXP = bonus?.xp_awarded || 0;

        setXp((prev) => {
  const updated = prev + bonusXP;
  setLevel(Math.floor(updated / 100) + 1);
  return updated;
});

setBonusScores({
  adequacy: adequacy_xp,
  fluency: fluency_xp,
  total: bonusXP
});

      } else {
        console.error("Server responded but not OK:", data);
      }
    } catch (err) {
      console.error("Error submitting evaluation:", err);
    }
  };



  const handleCloseBonus = () => {
    setShowBonus(false);
    setSelectedId(null);
    loadTranslation();
  };

  return (
    <div className="App">
      {stage === "start" && <StartScreen onStart={() => setStage("name")} />}
      {stage === "name" && (
        <NameInput
          onSubmit={(name) => {
            setUsername(name);
            setStage("game");
          }}
        />
      )}
      {stage === "game" && (
        <GameScreen
          xp={xp}
          level={level}
          username={username}
          sourceText={sourceText}
          options={options}
          selectedId={selectedId}
          onSelectTranslation={handleTranslationSelect}
        />
      )}
      <BonusModal
        show={showBonus}
        scores={bonusScores}
        onSubmit={handleBonusSubmit}
        onClose={handleCloseBonus}
        defaultScores={bonusScores}
      />
    </div>
  );
}

export default App;
