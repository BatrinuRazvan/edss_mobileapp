import React from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../services/firebase";
import APIclient from "../services/restAPI";

const Login = () => {
  const navigate = useNavigate();

  // Modified login function to accept userType
  const login = (userType) => {
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
                  userType, // Pass userType to saveUser
                })
                .then(() => navigate("/"))
                .catch((error) => {
                  console.error("API call to save user failed:", error);
                });
            },
            (error) => {
              console.error("Geolocation error:", error);
            }
          );
        } else {
          console.log("Geolocation is not supported by this browser.");
        }
      })
      .catch((error) => {
        console.error("Login Failed:", error);
      });
  };

  return (
    <div>
      {/* Updated buttons to use the new login function with different userTypes */}
      <button onClick={() => login("NORMAL")}>Login as Normal User</button>
      <button onClick={() => login("DSP")}>Login as DSP User</button>
      <button onClick={() => login("DSU")}>Login as DSU User</button>
    </div>
  );
};

export default Login;
