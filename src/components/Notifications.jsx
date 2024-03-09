import React, { useEffect, useState } from "react";
import APIclient from "../services/responseAPI";

const Notifications = () => {
  const [messages, setMessages] = useState([]);
  const [expandedMessageId, setExpandedMessageId] = useState(null);

  useEffect(() => {
    const apiClient = new APIclient("/messages/getMessages");
    const data = apiClient.getMessages();
    setMessages(data);
  }, []);

  const handleExpandMessage = (id) => {
    setExpandedMessageId(expandedMessageId === id ? null : id);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Messages</h2>
      {messages.map((message) => (
        <div
          key={message.id}
          style={{
            background: message.color, // Use the color from the message
            margin: "10px 0",
            padding: "10px",
            borderRadius: "20px",
            cursor: "pointer",
            color: "white",
          }}
          onClick={() => handleExpandMessage(message.id)}
        >
          <h3>
            {message.title} - {message.city} - {message.severity}
          </h3>
          {expandedMessageId === message.id && (
            <div>
              <p>{message.description}</p>
              <button onClick={() => alert("More details")}>More</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Notifications;
