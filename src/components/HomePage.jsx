import "./Components.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import APIclient from "../services/restAPI";
import DraggableBubble from "./costumizable/DraggableBubble";
import NavBar from "./costumizable/NavBar";
import { MdNotifications, MdMap, MdHealing, MdWarning } from "react-icons/md";
import { FaUserSecret, FaUserTie } from "react-icons/fa";

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
  const publicKey = process.env.REACT_APP_PUBLIC_VAPID_KEY;
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
  const [userType, setUserType] = useState("");

  useEffect(() => {
    const subscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User logged in:", user);
        askForNotificationPermission(user);

        const apiclient = new APIclient("/user/getUserType");
        try {
          const storedUserType = await apiclient.getUserType(user.uid);
          setUserType(storedUserType);
          if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                const { latitude, longitude } = position.coords;
                console.log(user.uid);
                console.log(latitude);
                const apiClient = new APIclient("/user/updateLocation");
                await apiClient.updateLocation(user.uid, latitude, longitude);
              },
              (error) => {
                console.error("Error obtaining location", error);
              }
            );
          } else {
            console.log("Geolocation is not supported by this browser.");
          }
        } catch (error) {
          console.error("Error fetching user type:", error);
        }
      } else {
        navigate("/login");
      }
    });

    return () => subscribe();
  }, [navigate]);

  const navigateToScenario = (scenarioId) => {
    setExpand({ [scenarioId]: true });
    setTimeout(() => {
      navigate(`/${scenarioId}`);
    }, 500);
  };

  const circleRadius = 150;
  const containerCenter = { x: 250, y: 250 };
  const scenarios = [
    {
      id: "diagnostics",
      diameter: 100,
      minimumSeparation: 10,
      icon: <MdHealing />,
    },
    {
      id: "disasters",
      diameter: 100,
      minimumSeparation: 10,
      icon: <MdWarning />,
    },
    {
      id: "notifications",
      diameter: 100,
      minimumSeparation: 10,
      icon: <MdNotifications />,
    },
    { id: "map", diameter: 100, minimumSeparation: 10, icon: <MdMap /> },
    ...(userType === "DSU"
      ? [
          {
            id: "DSU",
            diameter: 100,
            minimumSeparation: 10,
            icon: <FaUserTie />,
          },
        ]
      : []),
    ...(userType === "DSP"
      ? [
          {
            id: "DSP",
            diameter: 100,
            minimumSeparation: 10,
            icon: <FaUserSecret />,
          },
        ]
      : []),
  ];

  const initialPositions = scenarios.map((scenario, index, array) => {
    if (
      array.length === 5 &&
      (scenario.id === "DSU" || scenario.id === "DSP")
    ) {
      return { x: containerCenter.x - 50, y: containerCenter.y - 50 };
    } else {
      const angle = (index / 4) * 2 * Math.PI;
      return {
        x: containerCenter.x + circleRadius * Math.cos(angle) - 50,
        y: containerCenter.y + circleRadius * Math.sin(angle) - 50,
      };
    }
  });

  const [animationClass, setAnimationClass] = useState("");
  const handleDisastersClick = () => {
    setAnimationClass("fade-out");

    setTimeout(() => {
      navigate("/disasters");
    }, 500);
  };

  return (
    <div>
      <NavBar />
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
            expandOnClick={
              scenario.id === "map" ||
              scenario.id === "diagnostics" ||
              scenario.id === "notifications" ||
              scenario.id === "DSP" ||
              scenario.id === "DSU"
            }
            className={`scenario-bubble ${scenario.id} ${
              expand[scenario.id] ? "expand" : ""
            }`}
          >
            <div className="scenario-content icon-transition">
              {React.cloneElement(scenario.icon, { size: "50px" })}
              <span className="button-text">
                {scenario.id.charAt(0).toUpperCase() + scenario.id.slice(1)}
              </span>
            </div>
          </DraggableBubble>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
