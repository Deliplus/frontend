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
  const [showWrongBonus, setShowWrongBonus] = useState(false); 
  const [pendingRating, setPendingRating] = useState(null);    

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

  const handleTranslationSelect = async (id) => {
    setSelectedId(id);
    const isCorrect = id === correctId;
  
    //  Always submit evaluation, even if incorrect
    try {
      await fetch("https://backend-r5dx.onrender.com/submit-evaluation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: username,
          source: sourceText,
          chosen_id: id,
          adequacy: isCorrect ? 5 : 0,  
          fluency: isCorrect ? 5 : 0,    
          correct_id: correctId          
        }),
      });
    } catch (err) {
      console.error("❌ Error submitting evaluation:", err);
    }
  
    // Game flow
    if (isCorrect) {
      const baseXP = 10;
      const newXP = xp + baseXP;
      setXp(newXP);
      setLevel(Math.floor(newXP / 100) + 1);
      setShowBonus(true);
    } else {
      setShowWrongBonus(true);
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
          chosen_id: selectedId,
          adequacy,
          fluency,
          correct_id: correctId
        }),
      });

      const data = await res.json();
      if (data.status === "ok") {
        const { adequacy_xp, fluency_xp, total } = data;

        setXp((prev) => {
          const newXp = prev + total;
          setLevel(Math.floor(newXp / 100) + 1);
          return newXp;
        });

        setBonusScores({
          adequacy: adequacy_xp,
          fluency: fluency_xp,
          total: total,
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
        mode= "correct"
      />
      <BonusModal
        show={showWrongBonus}
        scores={bonusScores}
        onSubmit={handleBonusSubmit}
        onClose={() => {
          setShowWrongBonus(false);
          setSelectedId(null);
          loadTranslation();
        }}
        defaultScores={{ adequacy: 0, fluency: 0, total: 5 }}
        mode="incorrect" //  prop for message change
      />
    </div>
  );
}

export default App;
