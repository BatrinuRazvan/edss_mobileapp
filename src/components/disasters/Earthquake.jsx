import React, { useState, useEffect, useRef } from "react";
// import userLogo from "./userLogo.png"; // Path to user's logo image
// import assistantLogo from "./assistantLogo.png"; // Path to assistant's logo image

const Earthquake = () => {
  const [step, setStep] = useState(1);
  const [messages, setMessages] = useState([
    { text: "Are you experiencing an earthquake?", sender: "assistant" },
  ]);
  const messagesEndRef = useRef(null);

  const handleResponse = (response) => {
    // Add user response to messages
    const newUserMessage = { text: response, sender: "user" };
    const newMessages = [...messages, newUserMessage];

    // Determine next message based on step
    let nextMessageText = "";
    if (step === 1) {
      nextMessageText = "Are you hurt?";
    } else {
      nextMessageText =
        "Thank you for your responses. Please stay safe and follow emergency protocols.";
    }

    const newAssistantMessage = { text: nextMessageText, sender: "assistant" };
    setMessages([...newMessages, newAssistantMessage]);

    setStep(step + 1);
  };

  // Scroll to the bottom of the chat whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-container">
      {messages.map((message, index) => (
        <div className={`chat-message ${message.sender}`} key={index}>
          <img
            // src={message.sender === "user" ? userLogo : assistantLogo}
            alt={message.sender}
          />
          <p>{message.text}</p>
        </div>
      ))}
      <div ref={messagesEndRef} />
      {step <= 2 && (
        <div className="response-buttons">
          <button onClick={() => handleResponse("Yes")}>Yes</button>
          <button onClick={() => handleResponse("No")}>No</button>
        </div>
      )}
    </div>
  );
};

export default Earthquake;
