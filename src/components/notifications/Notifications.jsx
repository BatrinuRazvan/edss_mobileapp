// Inside Notifications.jsx

import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import GeneralNotifications from "./GeneralNotifications";
import LocalNotifications from "./LocalNotifications";

const Notifications = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Notifications</h2>
      <nav>
        <Link to="/notifications/general">General</Link> |{" "}
        <Link to="/notifications/local">Local</Link>
      </nav>
      <Routes>
        <Route path="/general" element={<GeneralNotifications />} />
        <Route path="/local" element={<LocalNotifications />} />
      </Routes>
    </div>
  );
};

export default Notifications;
