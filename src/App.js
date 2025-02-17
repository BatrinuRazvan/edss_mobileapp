import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import Earthquake from "./components/disasters/Earthquake";
import Epidemic from "./components/disasters/Epidemic";
import Hurricane from "./components/disasters/Hurricane";
import Notifications from "./components/notifications/Notifications";
import ManageAccount from "./components/notifications/ManageAccount";
import Login from "./components/Login";
import Flood from "./components/disasters/Flood";
import CityMap from "./components/CityMap";
import DSUpage from "./components/specialUsers/DSUpage";
import DSPpage from "./components/specialUsers/DSPpage";
import DisastersComponent from "./components/disasters/DisasterComponent";
import Diagnostics from "./components/diagnostics/Diagnostics";

function App() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
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
        <Route path="/map" element={<CityMap />} />
        <Route path="/dsu" element={<DSUpage />} />
        <Route path="/dsp" element={<DSPpage />} />
        <Route path="/disasters" element={<DisastersComponent />} />
        <Route path="/diagnostics" element={<Diagnostics />} />
        <Route path="/manageaccount" element={<ManageAccount />} />
      </Routes>
    </Router>
  );
}

export default App;
