import React from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../services/firebase";
import APIclient from "../services/restAPI";
import { FaUser, FaUserTie, FaUserSecret, FaUserMd } from "react-icons/fa";
import "./Login.css";
import NavBar from "./costumizable/NavBar";

const Login = () => {
  const navigate = useNavigate();

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
                  userType,
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
        <button className="login-button" onClick={() => login("MEDIC")}>
          <FaUserMd className="login-icon" />
          <span className="login-text">Medic</span>
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
