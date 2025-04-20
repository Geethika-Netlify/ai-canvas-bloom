
import { GoogleGenAI } from '@google/genai';

// Get the API key from environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Check if API key exists before creating the client
if (!apiKey) {
  console.error('VITE_GEMINI_API_KEY is not set in environment variables');
}

export const geminiClient = new GoogleGenAI({
  apiKey: apiKey || 'dummy-key-for-development'
});

// Update the configuration structure to match Google Gemini's requirements
export const LIVE_CONFIG = {
  model: 'gemini-2.0-flash-live-001',
  config: {
    generationConfig: {},
    systemInstruction: "You are GAIA, an AI assistant built to be helpful, friendly, and engaging.",
    tools: []
  }
};

// Optional: Add a validation function to check API key
export const validateGeminiApiKey = async () => {
  try {
    if (!apiKey) {
      throw new Error('No API key provided');
    }
    // Attempt a simple test generation to verify the key
    const response = await geminiClient.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: 'Test connection'
    });
    console.log('Gemini API key is valid');
    return true;
  } catch (error) {
    console.error('Gemini API key validation failed:', error);
    return false;
  }
};

