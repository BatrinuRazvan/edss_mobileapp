import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDisastersDropdownOpen, setIsDisastersDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const disasterOptions = [
    { name: "Earthquake", path: "earthquake" },
    { name: "Epidemic", path: "epidemic" },
    { name: "Hurricane", path: "hurricane" },
    { name: "Flood", path: "flood" },
  ];

  const navigateToPage = (page) => {
    navigate(`/${page}`);
    setIsMenuOpen(false);
    setIsDisastersDropdownOpen(false);
  };

  const toggleDisastersDropdown = () => {
    setIsDisastersDropdownOpen(!isDisastersDropdownOpen);
  };

  return (
    <div>
      <nav className="navbar">
        <span className="navbar-title" onClick={() => navigateToPage("")}>
          Disaster Assistance
        </span>
        <div
          className={`burger-menu ${isMenuOpen ? "open" : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className="burger-line top"></div>
          <div className="burger-line middle"></div>
          <div className="burger-line bottom"></div>
        </div>
      </nav>
      <div className={`sidebar ${isMenuOpen ? "open" : ""}`}>
        <button onClick={() => navigateToPage("diagnostics")}>
          Diagnostics
        </button>
        <button onClick={toggleDisastersDropdown}>Disasters</button>
        <div
          className={`disasters-dropdown ${
            isDisastersDropdownOpen ? "active" : ""
          }`}
        >
          {disasterOptions.map((option) => (
            <button
              key={option.path}
              onClick={() => navigateToPage(option.path)}
              className="disaster-option"
            >
              {option.name}
            </button>
          ))}
        </div>
        <button onClick={() => navigateToPage("notifications")}>
          Notifications
        </button>
        <button onClick={() => navigateToPage("map")}>Map</button>
        <button onClick={() => navigateToPage("manageaccount")}>
          Manage account
        </button>
      </div>
      {isMenuOpen && (
        <div className="backdrop" onClick={() => setIsMenuOpen(false)} />
      )}
    </div>
  );
};

export default NavBar;
