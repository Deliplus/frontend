// frontend/src/components/TreeVisual.jsx
import React from "react";
import "./TreeVisual.css";

const TreeVisual = ({ level, treeName }) => {
  const getTreeImage = () => {
    if (level >= 5) return "/trees/tree5.png";
    if (level >= 4) return "/trees/tree4.png";
    if (level >= 3) return "/trees/tree3.png";
    if (level >= 2) return "/trees/tree2.png";
    return "/trees/tree1.png";
  };

  return (
    <div className="tree-container">
      <h3 className="tree-name">🌸 {treeName}'s Tree🌸</h3>
      <img src={getTreeImage()} alt="Cherry Tree" className="tree-image" />
    </div>
  );
};

export default TreeVisual;
