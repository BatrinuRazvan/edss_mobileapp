import React, { useState } from "react";
import "./ChatUi.css";

const Epidemic = () => {
  const [step, setStep] = useState(1); // Track the step of the conversation
  const [responses, setResponses] = useState({}); // Store user responses

  // Function to handle user response and advance to the next step
  const handleResponse = (response) => {
    setResponses({ ...responses, [`response${step}`]: response });
    setStep(step + 1);
  };

  return (
    <div className="chat-container">
      {step === 1 && (
        <div className="chat-message">
          <p>Are you experiencing an earthquake?</p>
          <button onClick={() => handleResponse("yes")}>Yes</button>
          <button onClick={() => handleResponse("no")}>No</button>
        </div>
      )}

      {step === 2 && (
        <div className="chat-message">
          <p>Are you hurt?</p>
          <button onClick={() => handleResponse("yes")}>Yes</button>
          <button onClick={() => handleResponse("no")}>No</button>
        </div>
      )}

      {/* Display final message or further questions based on responses */}
      {step > 2 && (
        <div className="chat-message">
          {/* Example final message */}
          <p>
            Thank you for your responses. Please stay safe and follow emergency
            protocols.
          </p>
        </div>
      )}
    </div>
  );
};

export default Epidemic;
