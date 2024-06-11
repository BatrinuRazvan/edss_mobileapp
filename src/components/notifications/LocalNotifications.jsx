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
          const capitalizedData = data.map((message) => ({
            ...message,
            title: capitalizeFirstLetter(message.title),
            description: capitalizeFirstLetter(message.description),
            city: capitalizeFirstLetter(message.city),
            severity: capitalizeFirstLetter(message.severity),
          }));
          setMessages(capitalizedData);
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

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div>
      <h2>Local Notifications</h2>
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
                  <p>
                    <b>Description:</b> {message.description}
                  </p>
                  <p>
                    <b>Severity:</b> {message.severity}
                  </p>
                  <p>
                    <b>Range:</b> {message.range} km
                  </p>
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
