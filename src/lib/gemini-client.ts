
import { GoogleGenerativeAI } from '@google/generative-ai';

// Get the API key from environment variables
const getApiKey = () => {
  // Use the API key from environment variables
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyDcLnJhNDh3l4lRlBgtAM1LXnix3G9D-k4";
  if (!apiKey) {
    throw new Error("Gemini API key is missing. Please set the VITE_GEMINI_API_KEY environment variable.");
  }
  return apiKey;
};

// Initialize the client with the API key
const getGeminiClient = () => {
  try {
    const apiKey = getApiKey();
    return new GoogleGenerativeAI(apiKey);
  } catch (error) {
    console.error("Failed to initialize Gemini client:", error);
    throw error;
  }
};

// Function to get a chat instance with the model
export const getGeminiChat = async () => {
  try {
    const geminiClient = getGeminiClient();
    // Use the latest API method to get the model
    const model = geminiClient.getGenerativeModel({ model: 'gemini-pro' });
    
    // Initialize the chat with system instructions
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: 'You are GAIA, a friendly and knowledgeable AI assistant. Be concise, helpful, and maintain a professional yet approachable tone.' }],
        },
        {
          role: 'model',
          parts: [{ text: 'I am GAIA, ready to assist you with any questions or tasks you have.' }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    return chat;
  } catch (error) {
    console.error('Failed to initialize Gemini chat:', error);
    throw error;
  }
};

// Function to stream responses from Gemini
export const streamGeminiResponse = async (chat: any, message: string) => {
  try {
    const result = await chat.sendMessageStream(message);
    return result;
  } catch (error) {
    console.error('Error in Gemini response:', error);
    throw error;
  }
};
