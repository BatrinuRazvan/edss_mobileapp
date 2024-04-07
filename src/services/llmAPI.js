import OpenAI from "openai";

const llmPrompt =
  "Your are an assistant for disasters like floods, earthquakes, epidemics, pandemics, etc. If there is information you should keep in mind, please do, if not then it will be blank. Information to use: ";

class LLMapi {
  constructor() {
    this.apiKey = process.env.REACT_APP_OPENAI_API_KEY; // Ensure your API key is securely managed
    this.openai = new OpenAI({
      apiKey: this.apiKey,
      dangerouslyAllowBrowser: true, // Note: Be cautious about exposing sensitive API keys in the browser.
    });
    this.summarizedContent =
      JSON.parse(localStorage.getItem("summarizedContent")) || []; // Retrieve summarized content from localStorage
  }

  sendToAnswer = async (userMessage) => {
    try {
      let prompt = llmPrompt;

      console.log(this.summarizedContent);
      // Include summarized content in the prompt if available
      if (this.summarizedContent.length > 0) {
        prompt += ` ${this.summarizedContent.join(" ")}`;
      }

      console.log(prompt);

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: userMessage },
        ],
      });

      console.log("Full API Response: ", JSON.stringify(response, null, 2));

      if (response && response.choices && response.choices.length > 0) {
        let content = response.choices[0].message.content;
        return {
          status: 1,
          response: content,
        };
      } else {
        throw new Error("Unexpected API response format.");
      }
    } catch (error) {
      console.error("Error from OpenAI : ", error.message);
    }
  };

  summarizePDF = async (pdfContent) => {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Please summarize the content given. Return the key points from the input.",
          },
          { role: "user", content: pdfContent },
        ],
      });

      console.log("Full API Response: ", JSON.stringify(response, null, 2));

      // Correctly access the content of the assistant's message
      if (response && response.choices && response.choices.length > 0) {
        let content = response.choices[0].message.content; // Correctly accessing the message content

        // Store the summarized content for future use
        this.summarizedContent.push(content);
        localStorage.setItem(
          "summarizedContent",
          JSON.stringify(this.summarizedContent)
        ); // Store summarized content in localStorage

        return {
          status: 1,
          response: content,
        };
      } else {
        throw new Error("Unexpected API response format.");
      }
    } catch (error) {
      console.error("Error from OpenAI : ", error.message);
    }
  };
}

export default LLMapi;
