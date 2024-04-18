import React, { useState, useEffect, useRef, useCallback } from "react";
import "./ChatUi.css";
import { FiSend } from "react-icons/fi";
import botImage from "../logo512.png"; // Make sure the path is correct
import medicQuestions from "./dataQuestions/medicQuestions"; // Adjust the path as necessary
import diagnosticsQuestions from "./dataQuestions/diagnosticsQuestions";
import LLMapi from "../../services/llmAPI";
import { auth } from "../../services/firebase";
import APIclient from "../../services/restAPI";

const Diagnostics = () => {
  const [messages, setMessages] = useState([]);
  const [userResponses, setUserResponses] = useState([]);
  const [animationStep, setAnimationStep] = useState("flyingIn");
  const [showBubble, setShowBubble] = useState(false); // Used to control the bubble display
  const messagesEndRef = useRef(null);
  const [showIcons, setShowIcons] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState(1);
  const [userInput, setUserInput] = useState("");
  const [questions, setQuestions] = useState(diagnosticsQuestions); // Default to diagnosticsQuestions

  useEffect(() => {
    const fetchUserTypeAndSetQuestions = async () => {
      const userId = auth.currentUser?.uid; // Ensure you have a user ID
      if (userId) {
        const apiClient = new APIclient("/user/getUserType");
        const userType = await apiClient.getUserType(userId);
        setQuestions(
          userType === "MEDIC" ? medicQuestions : diagnosticsQuestions
        );
      } else {
        // Handle scenario where no user is logged in or user ID is not available
        console.log("No user ID found or user not logged in.");
      }
    };

    fetchUserTypeAndSetQuestions();
    // No dependencies needed as this effect only needs to run once on mount
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
  }, [messages.length, questions]);

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

        setTimeout(() => typeCharByChar(msg, index + 1), 0);
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

  const handleOptionClick = async (option) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: option.text },
    ]);

    setUserResponses((prevResponses) => [
      ...prevResponses,
      { question: messages[messages.length - 1]?.text, response: option.text },
    ]);

    if (option.nextQuestionId) {
      const nextQuestionId = option.nextQuestionId;
      setCurrentQuestionId(nextQuestionId);
      const nextQuestion = questions.find((q) => q.id === nextQuestionId);

      if (nextQuestionId === 3) {
        // Assume question 3 needs dynamic responses
        const apiClient = new APIclient("/questions/options");
        try {
          const dynamicOptions = await apiClient.getQuestionOptions(
            nextQuestionId
          );
          const updatedNextQuestion = {
            ...nextQuestion,
            options: dynamicOptions,
          };
          typeMessage(updatedNextQuestion.text);
          setQuestions((prevQuestions) =>
            prevQuestions.map((q) =>
              q.id === nextQuestionId ? updatedNextQuestion : q
            )
          );
        } catch (error) {
          console.error("Failed to fetch dynamic options:", error);
          typeMessage("Failed to retrieve options, please try again later.");
        }
      } else if (nextQuestion) {
        typeMessage(nextQuestion.text);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: "Thank you for your responses." },
        ]);
      }
    }
  };

  const sendAllResponses = useCallback(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.error("No user logged in");
      return;
    }

    const apiClient = new APIclient("/user/saveResponse"); // Adjust your endpoint as needed
    apiClient
      .saveResponses(userId, userResponses) // Pass the userId instead of email
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
      // Directly display user's input immediately
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: userInput },
      ]);

      try {
        const llmResponse = await llmAPI.sendToAnswer(userInput);
        const responseText = llmResponse.response;

        // Use typeMessage to display the bot's response with the typing effect
        typeMessage(responseText);

        setUserInput(""); // Clear the input field after sending
      } catch (error) {
        console.error("Error fetching response from LLM:", error);

        // Use typeMessage to display an error message from the bot with the typing effect
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
              onClick={handleSendQuestion}
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

export default Diagnostics;
