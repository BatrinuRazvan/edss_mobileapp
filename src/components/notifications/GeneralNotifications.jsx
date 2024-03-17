import React, { useEffect, useState } from "react";
import APIclient from "../../services/restAPI"; // Adjust this import path as necessary

const GeneralNotifications = () => {
  const [messages, setMessages] = useState([]);
  const [expandedMessageId, setExpandedMessageId] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const apiClient = new APIclient("/messages/getMessages");
      const data = await apiClient.getMessages(); // Make sure APIclient has a method getMessages()
      console.log(data);
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
            background: message.COLOR, // Assuming message.COLOR is a valid CSS color
            margin: "10px 0",
            padding: "10px",
            borderRadius: "20px",
            cursor: "pointer",
            color: "white",
          }}
          onClick={() => handleExpandMessage(message.id)}
        >
          <h3>
            {message.TITLE} - {message.CITY}
          </h3>
          {expandedMessageId === message.id && (
            <div>
              <p>{message.DESCRIPTION}</p>
              <p>Severity: {message.SEVERITY}</p>
              <p>Range: {message.RANGEKM} km</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GeneralNotifications;
