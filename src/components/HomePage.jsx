import "./Components.css"; // Ensure your CSS file is correctly imported
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import APIclient from "../services/restAPI"; // Adjust based on your actual path
import DraggableBubble from "./DraggableBubble";

// Assuming urlBase64ToUint8Array function is moved to a utility file or kept here
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const askForNotificationPermission = (user) => {
  if (
    "serviceWorker" in navigator &&
    "Notification" in window &&
    "PushManager" in window
  ) {
    console.log("Service Worker, Notifications, and PushManager are supported");
    Notification.requestPermission()
      .then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
          // Assuming service worker registration is already done in index.js or App.js
          navigator.serviceWorker.ready.then((registration) => {
            subscribeUserToPush(user, registration);
          });
        }
      })
      .catch((err) => {
        console.error("Failed to request notification permission:", err);
      });
  }
};

const subscribeUserToPush = (user, registration) => {
  const publicKey =
    "BGAUGfksW8MR0puO1T-LQuzYRNjmfLrwG9-PStRYckwEU3zVI3P60QOfsY6MoF82zwgqQpHUiLXBlsW425fh6no"; // Use your VAPID public key
  registration.pushManager
    .subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    })
    .then((subscription) => {
      console.log("User is subscribed to push notifications:", subscription);
      const apiClient = new APIclient("/user/saveSubscription");
      apiClient.saveSubscription(user.uid, subscription);
    })
    .catch((err) => {
      console.error("Failed to subscribe the user:", err);
    });
};
const HomePage = () => {
  const navigate = useNavigate();
  const [expand, setExpand] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User logged in:", user);
        askForNotificationPermission(user);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const navigateToScenario = (scenarioId) => {
    setExpand({ [scenarioId]: true });
    setTimeout(() => {
      navigate(`/${scenarioId}`);
    }, 500); // Optional: Adjust time as needed or remove if no delay is required
  };

  const circleRadius = 150;
  const containerCenter = { x: 250, y: 250 };
  const scenarios = [
    { id: "diagnostics", diameter: 100, minimumSeparation: 10 },
    { id: "disasters", diameter: 100, minimumSeparation: 10 },
    { id: "notifications", diameter: 100, minimumSeparation: 10 },
  ];

  const initialPositions = scenarios.map((_, index) => {
    const angle = (index / scenarios.length) * 2 * Math.PI;
    return {
      x: containerCenter.x + circleRadius * Math.cos(angle) - 50,
      y: containerCenter.y + circleRadius * Math.sin(angle) - 50,
    };
  });

  const [animationClass, setAnimationClass] = useState("");
  const handleDisastersClick = () => {
    // Assume there's a state to manage class names for animation
    setAnimationClass("fade-out");

    setTimeout(() => {
      navigate("/disasters");
    }, 500); // Corresponds to the duration of the fade-out animation
  };

  return (
    <div className={`center-container ${animationClass}`}>
      {scenarios.map((scenario, index) => (
        <DraggableBubble
          key={scenario.id}
          scenario={scenario.id}
          diameter={scenario.diameter}
          minimumSeparation={scenario.minimumSeparation}
          initialPos={initialPositions[index]}
          onClick={() =>
            scenario.id === "disasters"
              ? handleDisastersClick()
              : navigateToScenario(scenario.id)
          }
          className={`scenario-bubble ${scenario.id} ${
            expand[scenario.id] ? "expand" : ""
          }`}
        >
          <span className="button-text">
            {scenario.id.charAt(0).toUpperCase() + scenario.id.slice(1)}
          </span>
        </DraggableBubble>
      ))}
    </div>
  );
};

export default HomePage;
