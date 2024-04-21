import APIclient from "../services/restAPI"; // Adjust the path as necessary

const handleOptionClickHelper = async (
  option,
  currentQuestionId,
  questions,
  setMessages,
  setUserResponses,
  setCurrentQuestionId,
  setQuestions,
  typeMessage,
  diagnostic
) => {
  setMessages((prevMessages) => [
    ...prevMessages,
    { sender: "user", text: option.text },
  ]);

  setUserResponses((prevResponses) => [
    ...prevResponses,
    {
      question: prevMessages[prevMessages.length - 1]?.text,
      response: option.text,
    },
  ]);

  if (option.nextQuestionId) {
    const nextQuestionId = option.nextQuestionId;
    setCurrentQuestionId(nextQuestionId);
    const nextQuestion = questions.find((q) => q.id === nextQuestionId);

    if (nextQuestionId === 3) {
      const apiClient = new APIclient("/questions/getAllStoredDiagnostics");
      try {
        const dynamicOptions = await apiClient.getAllStoredDiagnostics();
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
    }
    if (currentQuestionId === 3 && option.text === "Other") {
      // Special case for "Other" in question 3
      setCurrentQuestionId(31); // Set ID to a custom input step
      typeMessage("Please type your diagnostic:");
    }
    if (currentQuestionId === 31) {
      // Handling custom input when the question ID is 5
      setDiagnostic(userInput);
      setUserResponses((prev) => [
        ...prev,
        { question: "Custom Diagnostic", response: userInput },
      ]);
      setCurrentQuestionId(6); // Transition to question 6
      typeMessage(userInput); // Echo the user input or provide follow-up
      setUserInput(""); // Clear input field
    } else if (nextQuestionId === 4) {
      const apiClient = new APIclient("/questions/getAllStoredSymptoms");
      try {
        const dynamicOptions = await apiClient.getAllStoredSymptoms(diagnostic);
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

export default handleOptionClickHelper;
