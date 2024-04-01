import OpenAI from "openai";

class LLMapi {
  constructor() {
    this.apiKey = process.env.REACT_APP_OPENAI_API_KEY; // Ensure your API key is securely managed
    this.openai = new OpenAI({
      apiKey: this.apiKey,
      dangerouslyAllowBrowser: true, // Note: Be cautious about exposing sensitive API keys in the browser.
    });
  }

  sendToAnswer = async (userMessage) => {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: "system", content: "What is the process to test a metal?" },
          { role: "user", content: userMessage }
        ]
      });

      console.log('Full API Response: ', JSON.stringify(response, null, 2));

      // Correctly access the content of the assistant's message
      if (response && response.choices && response.choices.length > 0) {
        let content = response.choices[0].message.content; // Correctly accessing the message content
        return {
          status: 1,
          response: content
        };
      } else {
        throw new Error('Unexpected API response format.');
      }
    } catch (error) {
      console.error('Error from OpenAI : ', error.message);
    }
  };
}

export default LLMapi;
