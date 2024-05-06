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
    text: "Are you experiencing an earthquake?",
    options: [
      { text: "Yes", nextQuestionId: 2 },
      { text: "No", nextQuestionId: 9 },
    ],
  },
  {
    id: 2,
    text: "Are you inside?",
    options: [
      { text: "Yes", nextQuestionId: 21 },
      { text: "No", nextQuestionId: 31 },
    ],
  },
  {
    id: 21,
    text: "Stay INSIDE!\nDO NOT run outside or to other rooms.\n\nMove away from glass, hanging objects, or anything that could fall!",
    options: [{ text: "OK", nextQuestionId: 211 }],
  },
  {
    id: 211,
    text: "DROP onto your hands and knees.\nCOVER your head, neck and entire body. If possible get under a table or desk.\nHOLD ON to your shelter.\n\nNow WAIT until the shaking stops!",
    options: [{ text: "The shaking stopped", nextQuestionId: 41 }],
  },
  {
    id: 31,
    text: "Are you inside a car?",
    options: [
      { text: "Yes", nextQuestionId: 321 },
      { text: "No", nextQuestionId: 311 },
    ],
  },
  {
    id: 311,
    text: "Stay OUTSIDE!\nMove away from buildings, utility poles, fuel stations or gas lines. Move to an open area away from anything that can fall (trees, poles, etc.)",
    options: [{ text: "OK", nextQuestionId: 3111 }],
  },
  {
    id: 3111,
    text: "Good! Now get down stay there!\n\nWAIT until the shaking stops!",
    options: [{ text: "The shaking stopped", nextQuestionId: 51 }],
  },
  {
    id: 321,
    text: "Move your car to the side of the road away from anything that can fall on it (trees, poles, etc.) and STOP immediately!",
    options: [{ text: "I've stopped the car", nextQuestionId: 3211 }],
  },
  {
    id: 3211,
    text: "Engage the parking breakes and turn the radio on for emergencies. When the shaking has stopped, make sure it is safe to move.",
    options: [{ text: "Great", nextQuestionId: 10 }],
  },
  {
    id: 41,
    text: "Ok, now that the shaking has stopped, be ready at any time for aftershocks! They can happen minutes, days or even months later; but first things first:\n\nAre you trapped?",
    options: [
      { text: "Yes", nextQuestionId: 411 },
      { text: "No", nextQuestionId: 421 },
    ],
  },
  {
    id: 411,
    text: "Do not panic and try to attract attention to yourself. Start by sending a text, banging on a wall or a pipe. Get a wet piece of material to cover your mouth and nose.",
    options: [{ text: "Allright!", nextQuestionId: 4111 }],
  },
  {
    id: 4111,
    text: "Be aware of the damages made to the building and slowly try to find a way out. Keep in mind that at any time debree might fall!",
    options: [{ text: "OK", nextQuestionId: 10 }],
  },
  {
    id: 421,
    text: "Are you hurt?",
    options: [
      { text: "Yes", nextQuestionId: 4210 },
      { text: "No", nextQuestionId: 4211 },
    ],
  },
  {
    id: 4210,
    text: "Try treating the wounds as fast as possible to prevent infection or other problems down the line.",
    options: [{ text: "OK", nextQuestionId: 4211 }],
  },
  {
    id: 4211,
    text: "Now take a moment to assess the area surrounding you. If there is help, follow the instructions cearfully.",
    options: [{ text: "Continue", nextQuestionId: 423 }],
  },
  {
    id: 423,
    text: "Can you hear any unusual cracks or structural damage to the building?",
    options: [
      { text: "Yes", nextQuestionId: 4231 },
      { text: "No", nextQuestionId: 4232 },
    ],
  },
  {
    id: 4231,
    text: "Move outside immediately and seek help. Try accesing the local authorities emergency response from you phone!",
    options: [{ text: "I'm safe!", nextQuestionId: 10 }],
  },
  {
    id: 4232,
    text: "It might be safe to stay inside. Keep checking for damage (try to inspect the electricity, gas and water supply before using them).\nAlso try accesing the local authorities emergency response from you phone!",
    options: [{ text: "I'm safe!", nextQuestionId: 10 }],
  },
  {
    id: 51,
    text: "Ok, now that the shaking has stopped, be ready at any time for aftershocks! They can happen minutes, days or even months later; but first things first:\n\nAre you close to a shore (less than 5 km)?",
    options: [
      { text: "Yes", nextQuestionId: 511 },
      { text: "No", nextQuestionId: 52 },
    ],
  },
  {
    id: 511,
    text: "Take space of at least 5 km or get to an elevation of at least 30m above sea level, as there might be a Tsunami approaching!",
    options: [{ text: "I will!", nextQuestionId: 52 }],
  },
  {
    id: 51,
    text: "Now try to connect to local authorities emergency broadcasts using your phone. Stay away from damaged buildings and try treating any wounds!",
    options: [{ text: "OK", nextQuestionId: 10 }],
  },
  {
    id: 9,
    text: "Is there an incoming earthquake?",
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
    options: [{ text: "Let's go!", nextQuestionId: 92 }],
  },
  {
    id: 92,
    text: "Signs of earthquakes:\n\t1. Roaring that gradually gets louder\n\t2. A violent strike that comes with shaking after",
    options: [{ text: "Got it!", nextQuestionId: 93 }],
  },
  {
    id: 93,
    text: "Safe spots:\n\t-Under a sturdy table\n\t-Under covers and pillows",
    options: [{ text: "Continue", nextQuestionId: 94 }],
  },
  {
    id: 94,
    text: "Remember the 3 keywords: DROP, COVER, HOLD.\n\nAlso create an evacuation plan for the building you find yourself in!",
    options: [{ text: "Understood!", nextQuestionId: 95 }],
  },
  {
    id: 95,
    text: "Try securing your environment. Identify and secure windows, unanchored furniture and any object that can drop during an earthquake. Most injuries and deaths are caused by falling items during disasters like this.",
    options: [{ text: "OK", nextQuestionId: 96 }],
  },
  {
    id: 96,
    text: "Optionally, if you can, prepare an emergency GO bag. Things like gloves, sturdy shoes, a whistle and a fire extinguisher are great additions!",
    options: [{ text: "Allright", nextQuestionId: 10 }],
  },
];

export default questions;
