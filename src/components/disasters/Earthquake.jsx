import React, { useState, useEffect, useRef } from "react";
import APIclient from "../../services/restAPI"; // Adjust the import path based on your project structure

const Earthquake = () => {
  const [step, setStep] = useState(1);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Add the first question only once when the component mounts
  useEffect(() => {
    const firstQuestion = "Are you experiencing an earthquake?";
    addMessage(firstQuestion, "assistant");
  }, []); // Empty dependency array ensures this effect only runs once on mount

  useEffect(() => {
    // Scroll to the bottom of the chat whenever messages update
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (text, type) => {
    setMessages((prevMessages) => [...prevMessages, { text, type }]);
  };

  const questions = [
    "Are you experiencing an earthquake?", // Already asked, corresponds to step 1
    "Are you hurt?", // Step 2
    // Add more questions as needed
  ];
  const handleResponse = async (response) => {
    // Define the questions based on the step

    // Save user response
    addMessage(response, "user");

    // Proceed with the next question or actions based on the step
    const apiClient = new APIclient("/messages/saveResponse");
    if (step < questions.length) {
      await apiClient.saveResponse(questions[step - 1], response); // Save the current response
      addMessage(questions[step], "assistant"); // Load the next question
      setStep(step + 1);
    } else {
      // Handle the final response
      await apiClient.saveResponse(questions[step - 1], response); // Save the final response
      // Final message or logic when all questions are answered
      addMessage(
        "Thank you for your responses. Please stay safe and follow emergency protocols.",
        "assistant"
      );
      // Optionally reset or conclude the chat here
    }
  };

  return (
    <div className="chat-container">
      {messages.map((message, index) => (
        <div key={index} className={`chat-message ${message.type}`}>
          <div className="message-bubble">{message.text}</div>
        </div>
      ))}
      <div ref={messagesEndRef} />
      {step <= questions.length && (
        <div className="response-buttons">
          <button onClick={() => handleResponse("Yes")}>Yes</button>
          <button onClick={() => handleResponse("No")}>No</button>
        </div>
      )}
    </div>
  );
};

export default Earthquake;
