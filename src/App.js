import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import Earthquake from "./components/disasters/Earthquake";
import Epidemic from "./components/disasters/Epidemic";
import Hurricane from "./components/disasters/Hurricane";
import Notifications from "./components/notifications/Notifications";
import Permissions from "./components/notifications/Permissions";
import Login from "./components/Login";
import Flood from "./components/disasters/Flood";
import CityMap from "./components/CityMap";
import DSUpage from "./components/specialUsers/DSUpage";
import DisastersComponent from "./components/DisasterComponent";
// Removed APIclient and NotificationPermission imports as they're no longer needed here

function App() {
  useEffect(() => {
    // Only keep the Service Worker registration logic
    if ("serviceWorker" in navigator) {
      // Register the service worker
      navigator.serviceWorker
        .register(`${process.env.PUBLIC_URL}/sw.js`)
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        })
        .catch((err) => {
          console.error("Service Worker registration failed:", err);
        });
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/earthquake" element={<Earthquake />} />
        <Route path="/epidemic" element={<Epidemic />} />
        <Route path="/hurricane" element={<Hurricane />} />
        <Route path="/flood" element={<Flood />} />
        <Route path="/notifications/*" element={<Notifications />} />
        <Route path="/permissions" element={<Permissions />} />
        <Route path="/map" element={<CityMap />} />
        <Route path="/dsu" element={<DSUpage />} />
        <Route path="/disasters" element={<DisastersComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
