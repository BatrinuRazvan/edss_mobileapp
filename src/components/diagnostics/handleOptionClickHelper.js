import APIclient from "../../services/restAPI"; // Adjust the path as necessary

const handleOptionClickHelper = async (
  option,
  currentQuestionId,
  nextQuestionId,
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
) => {
  setMessages((prevMessages) => [
    ...prevMessages,
    { sender: "user", text: option.text },
  ]);

  setUserResponses((prevResponses) => [
    ...prevResponses,
    {
      question: messages[messages.length - 1]?.text,
      response: option.text,
    },
  ]);

  if (currentQuestionId === 2) {
    const apiClient = new APIclient("/questions/getAllStoredDiagnostics");
    try {
      const dynamicOptions = await apiClient.getAllStoredDiagnostics();
      const nextQuestion = questions.find((q) => q.id === 3);
      const formattedOptions = dynamicOptions.map((option) => ({
        text: option,
        nextQuestionId: 4,
      }));
      const updatedNextQuestion = {
        ...nextQuestion,
        options: [...formattedOptions, { text: "Other", nextQuestionId: 31 }],
      };
      console.log(formattedOptions);
      typeMessage(updatedNextQuestion.text);
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) => (q.id === 3 ? updatedNextQuestion : q))
      );
      console.log("sunt aici");
    } catch (error) {
      console.error("Failed to fetch diagnostics:", error);
      typeMessage("Failed to retrieve options, please try again later.");
    }
  }

  if (currentQuestionId === 31) {
    const apiClient = new APIclient("/questions/saveDiagnostic");
    try {
      await apiClient.saveDiagnostic(userInput);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: userInput },
      ]);
      setDiagnostic(userInput);
      setUserInput("");
      const nextQuestion = questions.find((q) => q.id === 4);
      typeMessage(nextQuestion.text);
      setCurrentQuestionId(4);
    } catch (error) {
      console.error("Failed to save diagnostic:", error);
      typeMessage("Failed to save the diagnostic, please try again later.");
    }
  }

  if (currentQuestionId === 3) {
    diagnostic = option.text;
    setDiagnostic(option.text);
  }

  if (currentQuestionId === 31 || nextQuestionId === 4) {
    const apiClient = new APIclient("/questions/getAllStoredSymptoms");
    try {
      const dynamicOptions = await apiClient.getAllStoredSymptoms(diagnostic);
      const nextQuestion = questions.find((q) => q.id === 4);
      const formattedOptions = dynamicOptions.map((option) => ({
        text: option,
        nextQuestionId: 42,
      }));
      const updatedNextQuestion = {
        ...nextQuestion,
        options: [...formattedOptions, { text: "Other", nextQuestionId: 41 }],
      };
      setSymptoms(formattedOptions);
      typeMessage(updatedNextQuestion.text);
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) => (q.id === 4 ? updatedNextQuestion : q))
      );
    } catch (error) {
      console.error("Failed to fetch symptoms:", error);
      typeMessage("Failed to retrieve options, please try again later.");
    }
  }

  if (currentQuestionId === 41) {
    const apiClient = new APIclient("/questions/saveSymptoms");
    try {
      await apiClient.saveSymptoms(diagnostic, userInput);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: userInput },
      ]);
      setUserInput("");
      const nextQuestion = questions.find((q) => q.id === 42);
      typeMessage(nextQuestion.text);
      setCurrentQuestionId(42);
    } catch (error) {
      console.error("Failed to save symptom:", error);
      typeMessage("Failed to save the symptom, please try again later.");
    }
  }

  if (currentQuestionId === 51) {
    const apiClient = new APIclient(
      "/questions/incrementDiagnosticNumberByUser"
    );
    try {
      await apiClient.incermentDiagnosticNumberUser(diagnostic);
    } catch (error) {
      console.error("Failed to increment diagnostic number by user:", error);
      typeMessage(
        "Failed to increment the diagnostic number, please try again later."
      );
    }
  }

  if (currentQuestionId === 6) {
    const apiClient = new APIclient(
      "/questions/incrementDiagnosticNumberByMedic"
    );
    try {
      await apiClient.incermentDiagnosticNumberMedic(diagnostic, userInput);
      setCurrentQuestionId(5);
      typeMessage(userInput);
      setUserInput("");
    } catch (error) {
      console.error("Failed to increment diagnostic number by medic:", error);
      typeMessage(
        "Failed to increment the diagnostic number, please try again later."
      );
    }
  }

  if (option.nextQuestionId) {
    setCurrentQuestionId(option.nextQuestionId);
    const nextQuestion = questions.find((q) => q.id === option.nextQuestionId);
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

export default handleOptionClickHelper;
