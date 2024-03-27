const questions = [
    {
        id: 1,
        text: "Is there any flood danger?",
        options: [
            { text: "Yes", nextQuestionId: 11 },
            { text: "No", nextQuestionId: null },
        ],
    },
    {
        id: 10,
        text: "Do you have any other questions?",
        options: [
            { text: "Yes", nextQuestionId: 111 },
            { text: "No", nextQuestionId: null },
        ],
    },
    {
        id: 11,
        text: "Is the flood ongoing?",
        options: [
            { text: "Yes", nextQuestionId: 111 },
            { text: "No", nextQuestionId: null },
        ],
    },
    {
        id: 111,
        text: "Stay connected! Use you phone to keep in touch with local authorities. Follow their instructions and if advised to evacuate, do so IMMEDIATELY!\n\nAre you outside?",
        options: [
            { text: "Yes", nextQuestionId: 1111 },
            { text: "No", nextQuestionId: 1112 },
        ],
    },
    {
        id: 1111,
        text: "Are you inside your car?",
        options: [
          { text: "Yes", nextQuestionId: 11112 },
          { text: "No", nextQuestionId: 11111 },
        ],
    },
    {
        id: 11112,
        text: "Stay inside your car.\nIs the street you are on flooded?",
        options: [
          { text: "Yes", nextQuestionId: 111121 },
          { text: "No", nextQuestionId: 111122 },
        ],
    },
    {
        id: 111121,
        text: "Do not move your vehicle. Cars can start moving with ther stream if the water exceeds 16 centimeters. If the level rises move on the roof of your car.\nDo not forget to listen to evacuation orders from the authorities!\n\nDo you need to evacuate?",
        options: [
          { text: "Yes", nextQuestionId: 1111211 },
          { text: "No", nextQuestionId: 1111212 },
        ],
    },
    {
        id: 1111211,
        text: "If your car is not trapped in rapidly moving water, start driving and avoid flooded streets!\nDo you have any other questions?",
        options: [
          { text: "Yes", nextQuestionId: null },
          { text: "No", nextQuestionId: null },
        ],
    },
    {
        id: 1111212,
        text: "If your car is not trapped in rapidly moving water, move to a non-flooded street immediately!\nDo you have any other questions?",
        options: [
          { text: "Yes", nextQuestionId: null },
          { text: "No", nextQuestionId: null },
        ],
    },

    {
        id: 1112,
        text: "Are you inside your home?",
        options: [
          { text: "Yes", nextQuestionId: 11121 },
          { text: "No", nextQuestionId: 11122 },
        ],
    },
    {
        id: 11121,
        text: "Start by turning off all utilities in you house. Make sure you turn off the following:\n\n\t1. Electricity\n\t2. Water\n\t3.Gas\n\nDid you manage to do this?",
        options: [
          { text: "Yes", nextQuestionId: 111211 },
          { text: "No", nextQuestionId: 111212 },
        ],
    },
    {
        id: 111212,
        text: "Not ideal, but can work. Make sure the water does not touch any of the electrical outlets in your home, because you can get electrocuted. Ready to continue?",
        options: [
          { text: "Continue", nextQuestionId: 111211 },
        ],
    },
    {
        id: 111211,
        text: "OK, now the next thing is to prepare in a Go Bag. While you do this, constantly check in with the authorities! Make sure you have the following inside your bag:\n\n\t1. Water - 3 bottles\n\t2. Food - 3 day supply\n\t3. Keep warm - blanket/body warmers\n\t4. First aid kit - the one from the car is good\n\t5. Flashlight\n\t6. Radio - with batteries\n\nReady to go on?",
        options: [
          { text: "Continue", nextQuestionId: 1112110 },
        ],
    },
    {
        id: 1112110,
        text: "Time to move to higher ground! If you can, lift important items off the ground, or bring them to a higher level.\nTake your pets with you if you have any!\nEverybody safe?",
        options: [
          { text: "Yes", nextQuestionId: 11121100 },
          { text: "No", nextQuestionId: 1112110 },
        ],
    },
    {
        id: 11121100,
        text: "Listen all the time to what your local authorities have to say. Until further instructions, you should be safe. Remember:\n\n\t1. Stay on higher ground\n\t2. Keep clear of the running water on foot or in your car\n\t3. Keep you Go Bag near\n\t4. Always be ready to switch shelter or evacuate!",
        options: [
          { text: "Good!", nextQuestionId: 10 },
        ],
    },
    // ... any other questions
];
  
export default questions;