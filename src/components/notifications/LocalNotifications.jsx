import React, { useEffect, useState } from "react";
import APIclient from "../services/responseAPI"; // Adjust the import path as needed

const LocalNotifications = () => {
  const [messages, setMessages] = useState([]);
  const [expandedMessageId, setExpandedMessageId] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        const apiClient = new APIclient("/messages/getLocalMessages");
        apiClient.getLocalMessages(location).then(setMessages); // Assuming getLocalMessages(location) returns a promise
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Error obtaining location. Cannot fetch local notifications.");
      },
      { enableHighAccuracy: true }
    );
  }, []);

  const handleExpandMessage = (id) => {
    setExpandedMessageId(expandedMessageId === id ? null : id);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Local Messages</h2>
      {messages.length > 0 ? (
        messages.map((message) => (
          <div
            key={message.id}
            style={{
              background: message.color,
              margin: "10px 0",
              padding: "10px",
              borderRadius: "20px",
              cursor: "pointer",
              color: "white",
            }}
            onClick={() => handleExpandMessage(message.id)}
          >
            <h3>
              {message.title} - {message.city}
            </h3>
            {expandedMessageId === message.id && (
              <div>
                <p>{message.description}</p>
                <p>Severity: {message.severity}</p>
                <p>Range: {message.rangekm} km</p>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No local messages available.</p>
      )}
    </div>
  );
};

export default LocalNotifications;
