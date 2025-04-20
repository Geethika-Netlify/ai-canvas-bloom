
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the client with the API key
const geminiClient = new GoogleGenerativeAI(
  import.meta.env.VITE_GEMINI_API_KEY || ''
);

// Function to get a chat instance with the model
export const getGeminiChat = async () => {
  try {
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
