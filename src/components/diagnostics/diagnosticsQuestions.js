const diagnosticsQuestions = [
  {
    id: 1,
    text: "Have you been recently to the doctor?",
    options: [
      { text: "Yes", nextQuestionId: 2 },
      { text: "No", nextQuestionId: null },
    ],
  },
  {
    id: 2,
    text: "How long ago?",
    options: [
      { text: "Past 2 weeks", nextQuestionId: 3 },
      { text: "More than 2 weeks ago", nextQuestionId: null },
    ],
  },
  {
    id: 3,
    text: "What was your diagnostic?\n\nPlease select one of the answers.",
    options: [
      { text: "Yes", nextQuestionId: 4 },
      { text: "No", nextQuestionId: null },
    ],
  },
  {
    id: 31,
    text: "Please type your diagnostic!",
    options: [
      { text: "Yes", nextQuestionId: null },
      { text: "No", nextQuestionId: null },
    ],
  },
  {
    id: 4,
    text: "What symptoms did you experience?\n\nPlease select one of the answers.",
    options: [
      { text: "Yes", nextQuestionId: null },
      { text: "No", nextQuestionId: null },
    ],
  },
  {
    id: 41,
    text: "Please type the symptoms you experienced.",
    options: [
      { text: "Yes", nextQuestionId: null },
      { text: "No", nextQuestionId: null },
    ],
  },
  {
    id: 42,
    text: "Any other symptoms?",
    options: [
      { text: "Yes", nextQuestionId: 41 },
      { text: "No", nextQuestionId: 51 },
    ],
  },
  {
    id: 51,
    text: "Thank you for your cooperation! Do you have any questions?",
    options: [
      { text: "Yes", nextQuestionId: 10 },
      { text: "No", nextQuestionId: null },
    ],
  },
  {
    id: 10,
    text: "Please type your question below!",
    options: [
      { text: "Yes", nextQuestionId: null },
      { text: "No", nextQuestionId: null },
    ],
  },
];

export default diagnosticsQuestions;
