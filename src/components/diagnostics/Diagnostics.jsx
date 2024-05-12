import React, { useState, useEffect, useRef, useCallback } from "react";
import "../disasters/ChatUi.css";
import { FiSend } from "react-icons/fi";
import botImage from "../logo512.png";
import medicQuestions from "./medicQuestions";
import diagnosticsQuestions from "./diagnosticsQuestions";
import LLMapi from "../../services/llmAPI";
import { auth } from "../../services/firebase";
import APIclient from "../../services/restAPI";
import handleOptionClickHelper from "./handleOptionClickHelper";

const Diagnostics = () => {
  const [messages, setMessages] = useState([]);
  const [userResponses, setUserResponses] = useState([]);
  const [animationStep, setAnimationStep] = useState("flyingIn");
  const [showBubble, setShowBubble] = useState(false);
  const messagesEndRef = useRef(null);
  const [showIcons, setShowIcons] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState(1);
  const [userInput, setUserInput] = useState("");
  const [questions, setQuestions] = useState(diagnosticsQuestions);
  const [diagnostic, setDiagnostic] = useState("");
  const [symptoms, setSymptoms] = useState([]);

  useEffect(() => {
    const fetchUserTypeAndSetQuestions = async () => {
      const userId = auth.currentUser?.uid;
      if (userId) {
        const apiClient = new APIclient("/user/getUserType");
        const userType = await apiClient.getUserType(userId);
        setQuestions(
          userType === "MEDIC" ? medicQuestions : diagnosticsQuestions
        );
      } else {
        console.log("No user ID found or user not logged in.");
      }
    };

    fetchUserTypeAndSetQuestions();
  }, []);

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

  // useEffect(() => {
  //   if (diagnostic !== "") {
  //     console.log("New diagnostic is set:", diagnostic);
  //   }
  // }, [diagnostic]);

  useEffect(() => {
    const firstQuestion = questions.find((q) => q.id === 1);
    if (firstQuestion && messages.length === 0) {
      setMessages([{ sender: "bot", text: firstQuestion.text }]);
    }
  }, [messages.length, questions]);

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
    handleOptionClickHelper(
      option,
      currentQuestionId,
      option.nextQuestionId,
      questions,
      messages,
      setMessages,
      setUserResponses,
      setCurrentQuestionId,
      setQuestions,
      typeMessage,
      diagnostic,
      setDiagnostic,
      userInput,
      setUserInput,
      symptoms,
      setSymptoms
    );
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
    if (currentQuestionId === 111) {
      sendAllResponses();
    }
  }, [currentQuestionId, sendAllResponses]);

  const llmAPI = new LLMapi();

  const handleTextInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSendQuestion = async () => {
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
      {showBubble && <div className="bubble" />}
      <div id="messageList">
        <div className="messages">
          {messages.map(
            (message, index) =>
              message.text && (
                <div key={index} className={`message ${message.sender}`}>
                  {message.sender === "bot" && showIcons && (
                    <div className="message-icon"></div>
                  )}
                  <div className="message-content">{message.text}</div>
                </div>
              )
          )}
          <div ref={messagesEndRef} />
        </div>
        {currentQuestionId !== 10 &&
          currentQuestionId !== 31 &&
          currentQuestionId !== 41 &&
          currentQuestion && (
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
              placeholder="Type your question here..."
              className="user-input"
            />
            <button
              onClick={handleSendQuestion}
              className={
                userInput.trim() ? "send-button icon-only" : "send-button"
              }
            >
              {userInput.trim() ? <FiSend size={24} /> : "Type your question!"}
            </button>
          </div>
        )}
        {(currentQuestionId === 31 || currentQuestionId === 41) && (
          <div className="input-send-container">
            <input
              type="text"
              value={userInput}
              onChange={handleTextInputChange}
              placeholder="Type your question here..."
              className="user-input"
            />
            <button
              onClick={() => handleOptionClick(userInput)}
              className={
                userInput.trim() ? "send-button icon-only" : "send-button"
              }
            >
              {userInput.trim() ? <FiSend size={24} /> : "Type your question!"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Diagnostics;
