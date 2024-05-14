import React, { useEffect, useState } from "react";
import APIclient from "../../services/restAPI";

const GeneralNotifications = () => {
  const [messages, setMessages] = useState([]);
  const [expandedMessageId, setExpandedMessageId] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const apiClient = new APIclient("/messages/getMessages");
      const data = await apiClient.getMessages();
      const capitalizedData = data.map((message) => ({
        ...message,
        title: capitalizeFirstLetter(message.title),
        description: capitalizeFirstLetter(message.description),
        city: capitalizeFirstLetter(message.city),
        severity: capitalizeFirstLetter(message.severity),
      }));
      setMessages(capitalizedData);
    };
    fetchMessages();
  }, []);

  const handleExpandMessage = (id) => {
    setExpandedMessageId(expandedMessageId === id ? null : id);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div>
      <h2>General Notifications</h2>
      <div style={{ padding: "20px" }}>
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
        ))}
      </div>
    </div>
  );
};

export default GeneralNotifications;
