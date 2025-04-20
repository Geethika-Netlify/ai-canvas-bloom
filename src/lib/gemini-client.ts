
import { GoogleGenAI } from '@google/genai';

const geminiClient = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
});

export const getGeminiChat = async () => {
  const model = geminiClient.getGenerativeModel({ model: 'gemini-2.0-flash-001' });
  
  const chat = model.startChat({
    history: [
      {
        role: 'user',
        parts: 'You are GAIA, a friendly and knowledgeable AI assistant. Be concise, helpful, and maintain a professional yet approachable tone.',
      },
      {
        role: 'model',
        parts: 'I am GAIA, ready to assist you with any questions or tasks you have.',
      },
    ],
    generationConfig: {
      maxOutputTokens: 1000,
      temperature: 0.7,
    },
  });

  return chat;
};

export const streamGeminiResponse = async (chat: any, message: string) => {
  try {
    const result = await chat.sendMessageStream(message);
    return result;
  } catch (error) {
    console.error('Error in Gemini response:', error);
    throw error;
  }
};
