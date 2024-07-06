import React from "react";
import { Routes, Route, Link, useMatch } from "react-router-dom";
import GeneralNotifications from "./GeneralNotifications";
import LocalNotifications from "./LocalNotifications";
import NavBar from "../costumizable/NavBar";
import "./Notifications.css";

const Notifications = () => {
  const isGeneralActive = useMatch("/notifications/general");
  const isLocalActive = useMatch("/notifications/local");

  return (
    <div>
      <NavBar />
      <div className="notifications-container">
        <h2>Notifications</h2>
        <div className="links-container">
          <Link
            to="/notifications/general"
            className={isGeneralActive ? "active" : ""}
          >
            General
          </Link>
          <Link
            to="/notifications/local"
            className={isLocalActive ? "active" : ""}
          >
            Local
          </Link>
        </div>
        <Routes>
          <Route path="/general" element={<GeneralNotifications />} />
          <Route path="/local" element={<LocalNotifications />} />
        </Routes>
      </div>
    </div>
  );
};

export default Notifications;
