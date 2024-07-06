import React, { useState, useEffect, useRef } from "react";
import "../disasters/ChatUi.css";
import { FiSend } from "react-icons/fi";
import { AiOutlineUpload } from "react-icons/ai";
import botImage from "../logo512.png";
import LLMapi from "../../services/llmAPI";
import { parsePDF } from "../../services/parsePDF";

const DSUpage = () => {
  const [messages, setMessages] = useState([]);
  const [animationStep, setAnimationStep] = useState("flyingIn");
  const [showBubble, setShowBubble] = useState(false);
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
          setShowIcons(true);
          setChatStarted(true);
          typeMessage(
            "Hello! Here you can talk to me, the assistent, and define new behaviour by uploading files as a attested DSU user. \n\nHow can I help you today?"
          );
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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: "user",
        text: "I uploaded a file. Please use it's contents from now on.",
      },
    ]);
    try {
      const fullContent = await parsePDF(file);
      const llmAPI = new LLMapi();
      const summarizedContent = await llmAPI.summarizePDF(fullContent);
      console.log(summarizedContent);
      typeMessage(summarizedContent.response);
    } catch (error) {
      console.error("Error parsing or summarizing PDF:", error);
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
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: userInput },
      ]);

      try {
        const llmAPI = new LLMapi();
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
          {messages.map(
            (message, index) =>
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
            onClick={() => fileInputRef.current.click()}
            className="send-button icon-only"
          >
            <AiOutlineUpload size={24} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
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
