import React, { useState, useEffect, useRef } from "react";
import "./ChatUi.css"; // Import the CSS file

const questions = [
  {
    id: 1,
    text: "Are you experiencing an earthquake?",
    options: [
      { text: "Yes", nextQuestionId: 2 },
      { text: "No", nextQuestionId: null }, // Assume this ends the conversation or leads to a different path
    ],
  },
  {
    id: 2,
    text: "Are you hurt?",
    options: [
      { text: "Yes", nextQuestionId: null }, // Further questions or actions can be based on this answer
      { text: "No", nextQuestionId: null },
    ],
  },
  // Extend the questions array as needed
];

const Earthquake = () => {
  const [currentQuestionId, setCurrentQuestionId] = useState(1);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Effect for initializing the chat with the first question
  useEffect(() => {
    // This check ensures we don't add the first question multiple times
    if (messages.length === 0) {
      const firstQuestion = questions.find((q) => q.id === 1); // Assuming the first question always has id 1
      if (firstQuestion) {
        setMessages([{ sender: "bot", text: firstQuestion.text }]);
      }
    }
  }, []); // Empty dependency array ensures this runs once on component mount

  // Effect for autoscroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleOptionClick = (option) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: option.text },
    ]);

    if (option.nextQuestionId) {
      const nextQuestion = questions.find(
        (q) => q.id === option.nextQuestionId
      );
      // Delay adding the next question to simulate typing/thinking delay
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: nextQuestion.text },
        ]);
        setCurrentQuestionId(nextQuestion.id); // Update the current question ID for the next interaction
      }, 1000); // 1-second delay
    } else {
      // End of conversation or a different action could be triggered here
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "Thank you for your responses." },
      ]);
    }
  };

  const currentQuestion = questions.find((q) => q.id === currentQuestionId);

  return (
    <div className="chat-container">
      <div id="messageList">
        {/* All the messages */}
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
        {/* Scroll to the bottom element */}
        <div ref={messagesEndRef} />
      </div>
      {currentQuestion && (
        <div className="options">
          {currentQuestion.options.map((option, index) => (
            <button key={index} onClick={() => handleOptionClick(option)}>
              {option.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Earthquake;
