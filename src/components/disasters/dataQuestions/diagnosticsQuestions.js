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
    id: 4,
    text: "Call an ambulance?",
    options: [
      { text: "Yes", nextQuestionId: null },
      { text: "No", nextQuestionId: null },
    ],
  },
];

export default diagnosticsQuestions;
