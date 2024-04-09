import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DraggableBubble from "./DraggableBubble";
import "./Components.css"; // Ensure CSS is properly imported

const DisasterComponent = () => {
  const navigate = useNavigate();
  const [expand, setExpand] = useState({});

  // Define disaster scenarios
  const scenarios = [
    { id: "earthquake", diameter: 100, minimumSeparation: 10 },
    { id: "epidemic", diameter: 100, minimumSeparation: 10 },
    { id: "hurricane", diameter: 100, minimumSeparation: 10 },
    { id: "flood", diameter: 100, minimumSeparation: 10 },
  ];

  // Function to navigate to a specific scenario detail
  const navigateToScenario = (scenarioId) => {
    setExpand({ [scenarioId]: true }); // This could be used to trigger an animation or visual cue before navigation
    setTimeout(() => {
      navigate(`/${scenarioId}`, {
        state: { animation: "startChatTransition" },
      });
    }, 1000); // Optional delay for aesthetic purposes
  };

  // Calculate positions for a circular layout of scenarios
  const circleRadius = 150;
  const containerCenter = { x: 250, y: 250 };

  const initialPositions = scenarios.map((_, index) => {
    const angle = (index / scenarios.length) * 2 * Math.PI;
    return {
      x: containerCenter.x + circleRadius * Math.cos(angle) - 50, // Adjust for bubble size
      y: containerCenter.y + circleRadius * Math.sin(angle) - 50,
    };
  });

  return (
    <div className="center-container">
      {scenarios.map((scenario, index) => (
        <DraggableBubble
          key={scenario.id}
          scenario={scenario.id}
          diameter={scenario.diameter}
          minimumSeparation={scenario.minimumSeparation}
          initialPos={initialPositions[index]}
          className={`circle-button ${
            expand[scenario.id] ? "full-screen" : ""
          }`}
          onClick={() => navigateToScenario(scenario.id)}
        >
          <span className="button-text">
            {scenario.id.charAt(0).toUpperCase() + scenario.id.slice(1)}
          </span>
        </DraggableBubble>
      ))}
    </div>
  );
};

export default DisasterComponent;
