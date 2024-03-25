import React from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../services/firebase"; // Adjusted import
import APIclient from "../services/restAPI"; // Ensure this matches your project structure

const Login = () => {
  const navigate = useNavigate();

  const googleLogin = () => {
    signInWithGoogle()
      .then(({ user }) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              const apiClient = new APIclient("/user/saveUser");
              apiClient
                .saveUser({
                  userId: user.uid,
                  email: user.email,
                  latitude,
                  longitude,
                })
                .then(() => navigate("/"))
                .catch((error) => {
                  console.error("API call to save user failed:", error);
                  // Handle API error here, possibly a retry logic or user notification
                });
            },
            (error) => {
              console.error("Geolocation error:", error);
              // You might want to handle the error more gracefully, maybe ask the user to manually input their location or proceed without it.
            }
          );
        } else {
          console.log("Geolocation is not supported by this browser.");
          // Handle lack of geolocation support more gracefully, similar to error handling above.
        }
      })
      .catch((error) => {
        console.error("Login Failed:", error);
        // Consider displaying this error to the user or implementing a retry mechanism
      });
  };

  return (
    <div>
      <button onClick={googleLogin}>Login with Google</button>
    </div>
  );
};

export default Login;
