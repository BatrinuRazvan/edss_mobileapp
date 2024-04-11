import React, { useEffect, useState } from "react";
import APIclient from "../../services/restAPI";

const LocalNotifications = () => {
  const [messages, setMessages] = useState([]);
  const [expandedMessageId, setExpandedMessageId] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        const apiClient = new APIclient("/messages/getLocalMessages");
        try {
          const data = await apiClient.getLocalMessages(location);
          setMessages(data);
        } catch (error) {
          console.error("Error fetching local messages:", error);
          alert("Error obtaining local notifications.");
        }
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
    <div>
      <h2>Local Messages</h2>
      <div style={{ padding: "20px" }}>
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
    </div>
  );
};

export default LocalNotifications;
