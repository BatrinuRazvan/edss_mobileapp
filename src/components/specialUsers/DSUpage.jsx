import React, { useState, useEffect, useRef } from "react";
import "../disasters/ChatUi.css";
import { FiSend } from "react-icons/fi";
import { AiOutlineUpload } from "react-icons/ai"; // Import upload icon
import botImage from "../logo512.png"; // Make sure the path is correct
import LLMapi from "../../services/llmAPI";
import { parsePDF } from "../../services/parsePDF";

const DSUpage = () => {
  const [messages, setMessages] = useState([]);
  const [animationStep, setAnimationStep] = useState("flyingIn");
  const [showBubble, setShowBubble] = useState(false); // Used to control the bubble display
  const messagesEndRef = useRef(null);
  const [showIcons, setShowIcons] = useState(false);
  const [userInput, setUserInput] = useState("");
  const fileInputRef = useRef(null);
  const [chatStarted, setChatStarted] = useState(false);

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
          setChatStarted(true);
          typeMessage("How can I help you today?");
        }, 1000);
        break;
      default:
        break;
    }

    return () => clearTimeout(timeoutId);
  }, [animationStep]);

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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    // Set "I uploaded a file" message
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: "user",
        text: "I uploaded a file. Please use it's contents from now on.",
      },
    ]);
    try {
      // Parse the PDF file
      const fullContent = await parsePDF(file);
      // Summarize the parsed content
      const llmAPI = new LLMapi();
      const summarizedContent = await llmAPI.summarizePDF(fullContent);
      // Add bot response to messages
      console.log(summarizedContent);
      typeMessage(summarizedContent.response);
    } catch (error) {
      console.error("Error parsing or summarizing PDF:", error);
      // Display error message to the user
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "Sorry, I couldn't process the uploaded file." },
      ]);
    }
  };

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
        const llmAPI = new LLMapi();
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
          {messages.map(
            (message, index) =>
              // Render messages conditionally after the chat has started
              chatStarted && (
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
        <div className="input-send-container">
          <input
            type="text"
            value={userInput}
            onChange={handleTextInputChange}
            placeholder="Use this field to..."
            className="user-input"
          />
          <button
            onClick={() => fileInputRef.current.click()} // Trigger file input click
            className="send-button icon-only"
          >
            <AiOutlineUpload size={24} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }} // Hide the file input
            onChange={handleFileUpload}
          />
          <button
            onClick={handleSendQuestion}
            className="send-button icon-only"
          >
            <FiSend size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DSUpage;
