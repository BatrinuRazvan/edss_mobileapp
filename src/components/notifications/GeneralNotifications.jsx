import React, { useEffect, useState } from "react";
import APIclient from "../../services/restAPI";

const GeneralNotifications = () => {
  const [messages, setMessages] = useState([]);
  const [expandedMessageId, setExpandedMessageId] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const apiClient = new APIclient("/messages/getMessages");
      const data = await apiClient.getMessages();
      setMessages(data);
    };
    fetchMessages();
  }, []);

  const handleExpandMessage = (id) => {
    setExpandedMessageId(expandedMessageId === id ? null : id);
  };

  return (
    <div>
      <h2>General Notifications</h2>
      {messages.map((message) => (
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
      ))}
    </div>
  );
};

export default GeneralNotifications;
