import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DraggableBubble from "../costumizable/DraggableBubble";
import "../Components.css"; // Ensure CSS is properly imported
import NavBar from "../costumizable/NavBar";
import { FaBiohazard, FaWind } from "react-icons/fa"; // Example icons
import { RiEarthquakeLine } from "react-icons/ri";
import { MdOutlineFlood } from "react-icons/md";

const DisasterComponent = () => {
  const navigate = useNavigate();
  const [expand, setExpand] = useState({});

  // Define disaster scenarios with icons
  const scenarios = [
    {
      id: "earthquake",
      diameter: 100,
      minimumSeparation: 10,
      icon: <RiEarthquakeLine size={50} />,
    },
    {
      id: "epidemic",
      diameter: 100,
      minimumSeparation: 10,
      icon: <FaBiohazard size={50} />,
    },
    {
      id: "hurricane",
      diameter: 100,
      minimumSeparation: 10,
      icon: <FaWind size={50} />,
    },
    {
      id: "flood",
      diameter: 100,
      minimumSeparation: 10,
      icon: <MdOutlineFlood size={50} />,
    },
  ];

  const navigateToScenario = (scenarioId) => {
    setExpand({ [scenarioId]: true });
    setTimeout(() => {
      navigate(`/${scenarioId}`, {
        state: { animation: "startChatTransition" },
      });
    }, 1000); // Optional delay for aesthetic purposes
  };

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
    <div>
      <NavBar />
      <div className="center-container">
        {scenarios.map((scenario, index) => (
          <DraggableBubble
            key={scenario.id}
            scenario={scenario.id}
            diameter={scenario.diameter}
            minimumSeparation={scenario.minimumSeparation}
            initialPos={initialPositions[index]}
            onClick={() => navigateToScenario(scenario.id)}
            className={`scenario-bubble ${scenario.id} ${
              expand[scenario.id] ? "expand" : ""
            }`}
          >
            {scenario.icon}
            <span className="button-text">
              {scenario.id.charAt(0).toUpperCase() + scenario.id.slice(1)}
            </span>
          </DraggableBubble>
        ))}
      </div>
    </div>
  );
};

export default DisasterComponent;
