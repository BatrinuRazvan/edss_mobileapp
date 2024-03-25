import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection after logout
import { auth } from "../../services/firebase"; // Ensure this path matches your project structure
import { signOut } from "firebase/auth"; // Import the signOut method

const Permissions = () => {
  const navigate = useNavigate(); // Hook to navigate to different routes

  const requestNotificationPermission = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
          // Here you can also subscribe the user to push notifications
        } else {
          console.log("Notification permission denied.");
        }
      });
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
    <div>
      <h2>Enable Notifications</h2>
      <button onClick={requestNotificationPermission}>
        Enable Notifications
      </button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Permissions;
