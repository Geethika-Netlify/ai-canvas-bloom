
import { GoogleGenAI } from '@google/genai';

export const geminiClient = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY
});

export const LIVE_CONFIG = {
  model: 'gemini-2.0-flash-live-001',
  config: {
    response_modalities: ['audio'],
    speech_config: {
      voice_config: {
        prebuilt_voice_config: {
          voice_name: 'Zephyr'
        }
      }
    }
  }
};
