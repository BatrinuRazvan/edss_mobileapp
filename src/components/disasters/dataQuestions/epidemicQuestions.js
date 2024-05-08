const questions = [
  {
    id: 10,
    text: "Do you have any other questions?",
    options: [
      { text: "Yes", nextQuestionId: 0 },
      { text: "No", nextQuestionId: null },
    ],
  },
  {
    id: 1,
    text: "Is there an ongoing hurricane in your area?",
    options: [
      { text: "Yes", nextQuestionId: 2 },
      { text: "No", nextQuestionId: 9 },
    ],
  },
  {
    id: 2,
    text: "Are you inside?",
    options: [
      { text: "Yes", nextQuestionId: 6 },
      { text: "No", nextQuestionId: 61 },
    ],
  },
  {
    id: 61,
    text: "Try finding a shelter. Institutions or any other kind of massive buildings might be your best option. If you are next to your home you can try reaching it.",
    options: [{ text: "OK", nextQuestionId: 611 }],
  },
  {
    id: 611,
    text: "Remember - DO NOT drive or walk in water!",
    options: [{ text: "Got it!", nextQuestionId: 2 }],
  },
  {
    id: 6,
    text: "Tap into your local emergency broadcasts! Do you need to evacuate?",
    options: [
      { text: "Yes", nextQuestionId: 7 },
      { text: "No", nextQuestionId: 20 },
    ],
  },
  {
    id: 7,
    text: "If you have time prepare an emergency GO bag. I can guide you to the nearest city exit based on your position. Just click the button below!",
    options: [{ text: "Show Me!", nextQuestionId: 70 }],
  },
  {
    id: 20,
    text: "Try to find a portable radio to listen to local authorities. Electricity might not be available!",
    options: [{ text: "Continue", nextQuestionId: 21 }],
  },
  {
    id: 21,
    text: "Stay INSIDE and keep away from all glass doors and windows. A bathroom might be a viable option.",
    options: [{ text: "OK", nextQuestionId: 211 }],
  },
  {
    id: 211,
    text: "Until further notice that the storm has passed DO NOT leave your house. Temporary calming of winds can be a sign of you being at the center of the storm!\n\nFollow local emergency broadcasts at all time!",
    options: [{ text: "Got it!", nextQuestionId: 10 }],
  },
  {
    id: 9,
    text: "Is there a possible storm incoming?",
    options: [
      { text: "Yes", nextQuestionId: 91 },
      { text: "No", nextQuestionId: 99 },
    ],
  },
  {
    id: 99,
    text: "All right! Stay safe and prepare for incoming disasters!",
    options: [{ text: "Of course!", nextQuestionId: 10 }],
  },
  {
    id: 91,
    text: "All right! Let's prepare and take it step by step!",
    options: [{ text: "I'm ready!", nextQuestionId: 92 }],
  },
  {
    id: 92,
    text: "Charge all electric devices, as power might be out. Keep a radio device with you at all times!",
    options: [{ text: "Next", nextQuestionId: 93 }],
  },
  {
    id: 93,
    text: "Be ready to evacuate at all times especially if you live in a flood prone area. Prepare a GO Bag with the essentials and, if you can, fill up your gas tank.",
    options: [{ text: "Continue", nextQuestionId: 94 }],
  },
  {
    id: 94,
    text: "Bring items indoors, cover your windows (shutters or wood boards) and, if instructed, turn off gas and electricity at the main switches.",
    options: [{ text: "Next", nextQuestionId: 10 }],
  },
];

export default questions;
