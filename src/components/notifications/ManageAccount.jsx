import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../services/firebase";
import { signOut } from "firebase/auth";
import { FaMapMarkerAlt, FaBell } from "react-icons/fa";
import "./ManageAccount.css";

const ManageAccount = () => {
  const navigate = useNavigate();
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      setNotificationEnabled(Notification.permission === "granted");
    }

    if ("geolocation" in navigator) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        setLocationEnabled(result.state === "granted");
      });
    }
  }, []);

  const requestNotificationPermission = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          setNotificationEnabled(true);
          console.log("Notification permission granted.");
        } else {
          console.log("Notification permission denied.");
        }
      });
    }
  };

  const disableNotificationPermission = () => {
    if (navigator.serviceWorker) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (let registration of registrations) {
          registration.unregister().then((boolean) => {
            if (boolean) {
              setNotificationEnabled(false);
              console.log("Notification permission disabled.");
            }
          });
        }
      });
    }
  };

  const requestLocationPermission = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationEnabled(true);
          console.log("Location permission granted.");
          console.log("Latitude is :", position.coords.latitude);
          console.log("Longitude is :", position.coords.longitude);
        },
        (error) => {
          console.error("Location permission denied.", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  const disableLocationPermission = () => {
    if ("permissions" in navigator && "revoke" in navigator.permissions) {
      navigator.permissions.revoke({ name: "geolocation" }).then((result) => {
        if (result.state !== "granted") {
          setLocationEnabled(false);
          console.log("Location permission disabled.");
        }
      });
    } else {
      setLocationEnabled(false);
      console.log("Location permission disabled.");
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("User logged out successfully");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Logout failed", error);
      });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <h1>Manage account permissions or log out</h1>
      <h2>
        Location: <FaMapMarkerAlt />
      </h2>
      <label className="switch">
        <input
          type="checkbox"
          checked={locationEnabled}
          onChange={() =>
            locationEnabled
              ? disableLocationPermission()
              : requestLocationPermission()
          }
        />
        <span className="slider"></span>
      </label>
      <h2>
        Notifications: <FaBell />
      </h2>
      <label className="switch">
        <input
          type="checkbox"
          checked={notificationEnabled}
          onChange={() =>
            notificationEnabled
              ? disableNotificationPermission()
              : requestNotificationPermission()
          }
        />
        <span className="slider"></span>
      </label>
      <h2>Logout:</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default ManageAccount;
