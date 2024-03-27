import "./Components.css"; // Ensure your CSS file is correctly imported
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import APIclient from "../services/restAPI"; // Adjust based on your actual path

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
    "BJo28K3NruwmTtCrPPnf-rjd_YXd0ukt5ATkke_gIYbwfBmcIVaTJ181jvEnBho2WdamjNaP2CuSRBhndJrnIaI"; // Use your VAPID public key
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
  const [expand, setExpand] = useState({}); // Use an object to track which button is expanded

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // After ensuring the user is logged in, ask for notification permission
        askForNotificationPermission(user);
      } else {
        // No user is signed in.
        navigate("/login");
      }
    });

    return () => unsubscribe(); // Clean up the subscription
  }, [navigate]);

  const navigateToScenario = (scenarioPath) => {
    setExpand({ [scenarioPath]: true });
    setTimeout(() => {
      navigate(`/${scenarioPath}`, {
        state: { animation: "startChatTransition" },
      });
    }, 1000); // Adjust time to match the CSS animation duration
  };

  return (
    <div className="center-container">
      <button
        className={`circle-button ${expand.earthquake ? "full-screen" : ""}`}
        onClick={() => navigateToScenario("earthquake")}
      >
        <span className={`button-text ${expand.earthquake ? "fade-out" : ""}`}>
          Earthquake
        </span>
      </button>
      <button
        className={`circle-button ${expand.epidemic ? "full-screen" : ""}`}
        onClick={() => navigateToScenario("epidemic")}
      >
        <span className={`button-text ${expand.epidemic ? "fade-out" : ""}`}>
          Epidemic
        </span>
      </button>
      <button
        className={`circle-button ${expand.hurricane ? "full-screen" : ""}`}
        onClick={() => navigateToScenario("hurricane")}
      >
        <span className={`button-text ${expand.hurricane ? "fade-out" : ""}`}>
          Hurricane
        </span>
      </button>
      <button
        className={`circle-button ${expand.flood ? "full-screen" : ""}`}
        onClick={() => navigateToScenario("flood")}
      >
        <span className={`button-text ${expand.flood ? "fade-out" : ""}`}>
          Flood
        </span>
      </button>
      <button
        className={`circle-button ${expand.notifications ? "full-screen" : ""}`}
        onClick={() => navigateToScenario("notifications")}
      >
        <span
          className={`button-text ${expand.notifications ? "fade-out" : ""}`}
        >
          Notifications
        </span>
      </button>
    </div>
  );
};

export default HomePage;
