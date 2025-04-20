
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

// Update the configuration to match the expected LiveConnectConfig structure
export const LIVE_CONFIG = {
  model: 'gemini-2.0-flash-live-001',
  config: {
    generationConfig: {
      responseStreamingEnabled: true
    },
    systemInstruction: "You are GAIA, an AI assistant built to be helpful, friendly, and engaging.",
    tools: []
  }
};
