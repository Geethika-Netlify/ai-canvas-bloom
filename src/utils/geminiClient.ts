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
    // Instead of using streamMode directly in generationConfig
    // Let's keep this simpler based on what the API supports
    generationConfig: {},
    systemInstruction: "You are GAIA, an AI assistant built to be helpful, friendly, and engaging.",
    tools: []
  }
};
