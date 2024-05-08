const medicQuestions = [
  {
    id: 1,
    text: "Hello Doctor! How can I be of help today?\n\nYou can choose to update statistics on diagnostics or ask any questions you may have about ongoing situations and/ or problems you may face!",
    options: [
      { text: "Update Diagnostics", nextQuestionId: 2 },
      { text: "Other Questions", nextQuestionId: 111 },
    ],
  },
  {
    id: 2,
    text: "I will provide you with some recent diagnostics form pacints. If you any of them that match your pacint's, please choose that option. Otherwise choose 'Other'",
    options: [{ text: "All right!", nextQuestionId: 3 }],
  },
  {
    id: 3,
    text: "Please select one of the answers below.",
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
    text: "What symptoms did the pacients experience?\n\nPlease select one of the answers.",
    options: [
      { text: "Yes", nextQuestionId: null },
      { text: "No", nextQuestionId: null },
    ],
  },
  {
    id: 41,
    text: "Please type the symptoms related to this diagnostic.",
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
      { text: "No", nextQuestionId: 6 },
    ],
  },
  {
    id: 5,
    text: "Thank you for your cooperation! Do you have any other questions or diagnostics you want to update?",
    options: [
      { text: "Yes", nextQuestionId: 10 },
      { text: "No", nextQuestionId: null },
      { text: "Update Diagnostics", nextQuestionId: 2 },
    ],
  },
  {
    id: 6,
    text: "Please type in the amount of pacients with this diagnostic!",
    options: [
      { text: "Yes", nextQuestionId: null },
      { text: "No", nextQuestionId: null },
    ],
  },
  {
    id: 10,
    text: "Type your questions below!",
    options: [
      { text: "Yes", nextQuestionId: null },
      { text: "No", nextQuestionId: null },
    ],
  },
];

export default medicQuestions;
