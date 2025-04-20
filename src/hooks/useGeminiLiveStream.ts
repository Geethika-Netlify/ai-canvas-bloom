
import { useState, useCallback, useRef } from 'react';
import { geminiClient, LIVE_CONFIG } from '@/utils/geminiClient';
import { AudioManager } from '@/utils/audioUtils';
import { GoogleGenAI } from '@google/genai';

// Define correct interfaces based on the actual API
type LiveSession = ReturnType<typeof GoogleGenAI.prototype.live.connect>;

export const useGeminiLiveStream = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioManagerRef = useRef<AudioManager | null>(null);
  const liveSessionRef = useRef<any>(null);

  const startLiveStream = useCallback(async () => {
    try {
      // Check if API key is available
      if (!import.meta.env.VITE_GEMINI_API_KEY) {
        throw new Error('Gemini API Key is not set. Please add VITE_GEMINI_API_KEY to your environment variables.');
      }

      audioManagerRef.current = new AudioManager();
      await audioManagerRef.current.initialize();

      // Connect to Gemini live stream with proper configuration
      const liveSession = await geminiClient.live.connect({
        model: LIVE_CONFIG.model,
        config: {
          // Use the correct property name according to Gemini API
          generationConfig: {
            streamMode: "streaming"
          },
          systemInstruction: "You are a helpful, friendly assistant named GAIA.",
          tools: []
        },
        // Add required callbacks with correct types
        callbacks: {
          onmessage: () => {},
          onclose: () => {
            setIsConnected(false);
            setIsListening(false);
          },
          onerror: (e: Event) => {
            console.error('Live session error:', e);
            setError('Error in live session connection');
            setIsConnected(false);
            setIsListening(false);
          }
        }
      });
      
      liveSessionRef.current = liveSession;
      
      // Start audio processing loop
      const processAudio = async () => {
        while (isListening) {
          const audioChunk = audioManagerRef.current?.getAudioChunk();
          if (audioChunk && liveSessionRef.current) {
            try {
              // Send audio to the session
              await liveSessionRef.current.sendAudio(audioChunk);
              
              // Handle response
              const response = await liveSessionRef.current.receiveResponse();
              if (response && response.audio) {
                await audioManagerRef.current?.playAudio(response.audio);
              }
            } catch (err) {
              console.error('Error processing audio:', err);
            }
          }
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      };

      setIsConnected(true);
      setIsListening(true);
      processAudio();
    } catch (err) {
      console.error('Live stream error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsConnected(false);
      setIsListening(false);
    }
  }, [isListening]);

  const stopLiveStream = useCallback(async () => {
    setIsListening(false);
    
    if (liveSessionRef.current) {
      try {
        await liveSessionRef.current.close();
        liveSessionRef.current = null;
      } catch (err) {
        console.error('Error closing live session:', err);
      }
    }
    
    if (audioManagerRef.current) {
      try {
        await audioManagerRef.current.stop();
        audioManagerRef.current = null;
      } catch (err) {
        console.error('Error stopping audio:', err);
      }
    }
    
    setIsConnected(false);
  }, []);

  return {
    startLiveStream,
    stopLiveStream,
    isConnected,
    isListening,
    error
  };
};
