import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../services/firebase"; // Ensure this path matches your project structure
import { signOut } from "firebase/auth"; // Import the signOut method
import { FaMapMarkerAlt, FaBell } from "react-icons/fa";
import "./ManageAccount.css";

const ManageAccount = () => {
  const navigate = useNavigate(); // Hook to navigate to different routes
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);

  // Check initial notification and location permission status
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
          // Here you can also subscribe the user to push notifications
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
    // This is a mock function to simulate disabling location permission
    // In a real application, you'd handle this differently depending on your needs
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
        // Sign-out successful.
        console.log("User logged out successfully");
        navigate("/login"); // Redirect to login page or home page as per your app flow
      })
      .catch((error) => {
        // An error happened.
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
