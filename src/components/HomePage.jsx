import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Components.css"; // Ensure your CSS file is correctly imported

const HomePage = () => {
  const navigate = useNavigate();
  const [expand, setExpand] = useState({}); // Use an object to track which button is expanded

  const navigateToScenario = (scenarioPath) => {
    setExpand({ [scenarioPath]: true }); // Set the specific button to expand
    setTimeout(() => navigate(`/${scenarioPath}`), 500); // Delay navigation for the animation
  };

  return (
    <div className="center-container">
      <button
        className={`circle-button ${expand.earthquake ? "full-screen" : ""}`}
        onClick={() => navigateToScenario("earthquake")}
      >
        Earthquake
      </button>
      <button
        className={`circle-button ${expand.epidemic ? "full-screen" : ""}`}
        onClick={() => navigateToScenario("epidemic")}
      >
        Epidemic
      </button>
      <button
        className={`circle-button ${expand.hurricane ? "full-screen" : ""}`}
        onClick={() => navigateToScenario("hurricane")}
      >
        Hurricane
      </button>
    </div>
  );
};

export default HomePage;
