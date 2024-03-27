const questions = [
    {
        id: 1,
        text: "Are you experiencing an earthquake?",
        options: [
            { text: "Yes", nextQuestionId: 2 },
            { text: "No", nextQuestionId: null },
        ],
    },
    {
        id: 2,
        text: "Are you hurt?",
        options: [
            { text: "Maybe", nextQuestionId: 3 },
            { text: "No", nextQuestionId: null },
        ],
    },
    {
        id: 3,
        text: "Can you walk?",
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
    // ... any other questions
];
  
export default questions;