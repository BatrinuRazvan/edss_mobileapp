import React, { useState, useEffect, useRef, useCallback } from "react";
import "./ChatUi.css";
import botImage from "../logo512.png"; // Make sure the path is correct
import APIclient from "../../services/restAPI";
import questions from "./dataQuestions/floodQuestions";

const Flood = () => {
  const [messages, setMessages] = useState([]);
  const [userResponses, setUserResponses] = useState([]);
  const [animationStep, setAnimationStep] = useState("flyingIn");
  const [showBubble, setShowBubble] = useState(false); // Used to control the bubble display
  const messagesEndRef = useRef(null);
  const [showIcons, setShowIcons] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState(1);

  useEffect(() => {
    let timeoutId;
    switch (animationStep) {
      case "flyingIn":
        timeoutId = setTimeout(() => setAnimationStep("bouncing"), 1000);
        break;
      case "bouncing":
        timeoutId = setTimeout(() => setAnimationStep("shrinkAndMove"), 2000);
        break;
      case "shrinkAndMove":
        timeoutId = setTimeout(() => {
          setShowBubble(true);
          setShowIcons(true); // Enable the icons to be shown after the animations
        }, 1000);
        break;
      default:
        break;
    }

    return () => clearTimeout(timeoutId);
  }, [animationStep]);

  useEffect(() => {
    const firstQuestion = questions.find((q) => q.id === 1);
    if (firstQuestion && messages.length === 0) {
      setMessages([{ sender: "bot", text: firstQuestion.text }]);
    }
  }, [messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const typeMessage = (text) => {
    // Initial typing indicator message
    let typingMessage = { sender: "bot", text: "", isTyping: true };
    setMessages((prevMessages) => [...prevMessages, typingMessage]);

    const typeCharByChar = (msg, index) => {
      if (index < msg.length) {
        typingMessage = { ...typingMessage, text: msg.substring(0, index + 1) };
        setMessages((prevMessages) => [
          ...prevMessages.slice(0, -1),
          typingMessage,
        ]);
        setTimeout(() => typeCharByChar(msg, index + 1), 10);
      } else {
        // Typing completed
        setMessages((prevMessages) => [
          ...prevMessages.slice(0, -1),
          { ...typingMessage, isTyping: false },
        ]);
      }
    };

    setTimeout(() => typeCharByChar(text, 0), 100);
  };

  const handleOptionClick = (option) => {
    // Add user's message and response to the state
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: option.text },
    ]);

    setUserResponses((prevResponses) => [
      ...prevResponses,
      { question: messages[messages.length - 1]?.text, response: option.text },
    ]);

    if (option.nextQuestionId) {
      setCurrentQuestionId(option.nextQuestionId); // Update the current question ID
      console.log(currentQuestionId);
      const nextQuestion = questions.find(
        (q) => q.id === option.nextQuestionId
      );
      if (nextQuestion) {
        typeMessage(nextQuestion.text);
      }
    } else {
      // Handle the end of the conversation
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "Thank you for your responses." },
      ]);
    }
  };

  const sendAllResponses = useCallback(
    (email) => {
      const apiClient = new APIclient("/abc"); // Make sure this matches your endpoint
      apiClient
        .saveResponses(userResponses, email)
        .then(() => console.log("All responses sent successfully!"))
        .catch((error) => console.error("Failed to send responses:", error));
    },
    [userResponses]
  ); // Dependencies array: re-create this function when `userResponses` changes

  useEffect(() => {
    // Trigger sending responses when currentQuestionId changes to 5 or 6
    if (currentQuestionId === 5 || currentQuestionId === 6) {
      const userEmail = "user@example.com"; // Placeholder, replace with actual user email
      sendAllResponses(userEmail);
    }
  }, [currentQuestionId, sendAllResponses]);

  const currentQuestion = questions.find((q) => q.id === currentQuestionId);

  return (
    <div className="chat-container">
      <div
        className={`full-blue-background ${
          animationStep === "shrinkAndMove" ? "shrinking" : ""
        }`}
      />
      <div
        className={`bot-image ${
          animationStep === "flyingIn"
            ? "flying-in"
            : animationStep === "bouncing"
            ? "bouncing"
            : "shrink-and-move"
        }`}
        style={{ backgroundImage: `url(${botImage})` }}
      />
      {showBubble && <div className="bubble" />}{" "}
      {/* The bubble is now conditional on showBubble being true */}
      <div id="messageList">
        <div className="messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              {message.sender === "bot" &&
                showIcons && ( // Only show the icon if showIcons is true
                  <div className="message-icon"></div>
                )}
              <div className="message-content">{message.text}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {currentQuestion && (
          <div className="options-container">
            {currentQuestion.options.map((option, index) => (
              <button key={index} onClick={() => handleOptionClick(option)}>
                {option.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Flood;
