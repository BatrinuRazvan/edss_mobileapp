import React, { useState, useEffect, useRef, useCallback } from "react";
import "./ChatUi.css";
import { FiSend } from "react-icons/fi";
import botImage from "../logo512.png";
import LLMapi from "../../services/llmAPI";
import { auth } from "../../services/firebase";
import APIclient from "../../services/restAPI";
import questions from "./dataQuestions/earthquakeQuestions";

const Earthquake = () => {
  const [messages, setMessages] = useState([]);
  const [userResponses, setUserResponses] = useState([]);
  const [animationStep, setAnimationStep] = useState("flyingIn");
  const [showBubble, setShowBubble] = useState(false);
  const messagesEndRef = useRef(null);
  const [showIcons, setShowIcons] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState(1);
  const [userInput, setUserInput] = useState("");

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
          setShowIcons(true);
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
    let typingMessage = { sender: "bot", text: "", isTyping: true };
    setMessages((prevMessages) => [...prevMessages, typingMessage]);

    const typeCharByChar = (msg, index) => {
      if (index < msg.length) {
        typingMessage = { ...typingMessage, text: msg.substring(0, index + 1) };
        setMessages((prevMessages) => [
          ...prevMessages.slice(0, -1),
          typingMessage,
        ]);

        setTimeout(() => typeCharByChar(msg, index + 1), 0);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages.slice(0, -1),
          { ...typingMessage, isTyping: false },
        ]);
      }
    };

    setTimeout(() => typeCharByChar(text, 0), 100);
  };

  const handleOptionClick = (option) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: option.text },
    ]);

    setUserResponses((prevResponses) => [
      ...prevResponses,
      { question: messages[messages.length - 1]?.text, response: option.text },
    ]);

    if (option.nextQuestionId) {
      setCurrentQuestionId(option.nextQuestionId);
      console.log(currentQuestionId);
      const nextQuestion = questions.find(
        (q) => q.id === option.nextQuestionId
      );
      if (nextQuestion) {
        typeMessage(nextQuestion.text);
      }
    } else {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "Thank you for your responses." },
      ]);
    }
  };

  const sendAllResponses = useCallback(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.error("No user logged in");
      return;
    }

    const apiClient = new APIclient("/user/saveResponse");
    apiClient
      .saveResponses(userId, userResponses)
      .then(() => console.log("All responses sent successfully!"))
      .catch((error) => console.error("Failed to send responses:", error));
  }, [userResponses]);

  useEffect(() => {
    if (currentQuestionId === 2 || currentQuestionId === 91) {
      sendAllResponses();
    }
  }, [currentQuestionId, sendAllResponses]);

  const llmAPI = new LLMapi();

  const handleTextInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleUserLLMQuestion = async () => {
    if (userInput.trim() !== "") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: userInput },
      ]);

      try {
        const llmResponse = await llmAPI.sendToAnswer(userInput);
        const responseText = llmResponse.response;

        typeMessage(responseText);

        setUserInput("");
      } catch (error) {
        console.error("Error fetching response from LLM:", error);

        typeMessage("Sorry, I'm having trouble finding an answer right now.");
      }
    }
  };

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
      {showBubble && <div className="bubble" />} {/*bubble is now conditional*/}
      <div id="messageList">
        <div className="messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              {message.sender === "bot" && showIcons && (
                <div className="message-icon"></div>
              )}
              <div className="message-content">{message.text}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {currentQuestionId !== 10 && currentQuestion && (
          <div className="options-container">
            {currentQuestion.options.map((option, index) => (
              <button key={index} onClick={() => handleOptionClick(option)}>
                {option.text}
              </button>
            ))}
          </div>
        )}
        {currentQuestionId === 10 && (
          <div className="input-send-container">
            <input
              type="text"
              value={userInput}
              onChange={handleTextInputChange}
              placeholder="Use this field to..."
              className="user-input"
            />
            <button
              onClick={handleUserLLMQuestion}
              className={
                userInput.trim() ? "send-button icon-only" : "send-button"
              }
            >
              {userInput.trim() ? <FiSend size={24} /> : "Type you question!"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Earthquake;
