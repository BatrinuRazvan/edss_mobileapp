import React, { useEffect, useState } from "react";

const Notifications = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Placeholder for fetching messages from your API
    fetch("/api/messages")
      .then((response) => response.json())
      .then((data) => setMessages(data));
  }, []);

  return (
    <div>
      <h2>Messages</h2>
      {messages.map((message) => (
        <div key={message.id}>
          <h3>{message.title}</h3>
          <p>{message.content}</p>
          {/* Display more information as needed */}
        </div>
      ))}
    </div>
  );
};

export default Notifications;
