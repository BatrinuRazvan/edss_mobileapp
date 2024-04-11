import React from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../services/firebase";
import APIclient from "../services/restAPI";
import { FaUser, FaUserTie, FaUserSecret } from "react-icons/fa"; // Import icons
import "./Login.css"; // Import a CSS file for styles
import NavBar from "./costumizable/NavBar";

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
      <NavBar />
      <div className="login-button-container">
        <button className="login-button" onClick={() => login("NORMAL")}>
          <FaUser className="login-icon" />
          <span className="login-text">Normal User</span>
        </button>
        <button className="login-button" onClick={() => login("DSP")}>
          <FaUserTie className="login-icon" />
          <span className="login-text">DSP User</span>
        </button>
        <button className="login-button" onClick={() => login("DSU")}>
          <FaUserSecret className="login-icon" />
          <span className="login-text">DSU User</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
