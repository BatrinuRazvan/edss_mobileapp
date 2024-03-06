const baseUrl = "http://localhost:8080"; // Adjust this base URL to match your backend API

export const saveResponse = async (question, response) => {
  const responsePayload = { question, response };
  try {
    await fetch(`${baseUrl}/saveResponse`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(responsePayload),
    });
  } catch (error) {
    console.error("Failed to save response:", error);
    return false;
  }
  return true;
};
