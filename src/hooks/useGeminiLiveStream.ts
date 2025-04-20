
import { useState, useCallback, useRef } from 'react';
import { geminiClient, LIVE_CONFIG } from '@/utils/geminiClient';
import { AudioManager } from '@/utils/audioUtils';
import { GoogleGenAI } from '@google/genai';

// Define a custom type for the live session
type LiveSession = any; // Using any for now as the exact type is complex

export const useGeminiLiveStream = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioManagerRef = useRef<AudioManager | null>(null);
  const liveSessionRef = useRef<LiveSession | null>(null);

  const startLiveStream = useCallback(async () => {
    try {
      // Check if API key is available
      if (!import.meta.env.VITE_GEMINI_API_KEY) {
        throw new Error('Gemini API Key is not set. Please add VITE_GEMINI_API_KEY to your environment variables.');
      }

      audioManagerRef.current = new AudioManager();
      await audioManagerRef.current.initialize();

      console.log('Connecting to Gemini live stream...');
      
      // Connect to Gemini live stream with proper configuration
      // We're passing the LIVE_CONFIG directly to avoid property type mismatches
      const liveSession = await geminiClient.live.connect({
        model: LIVE_CONFIG.model,
        config: LIVE_CONFIG.config,
        // Add required callbacks with correct types
        callbacks: {
          onmessage: () => {
            console.log('Message received');
          },
          onclose: () => {
            console.log('Live session closed');
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
      
      console.log('Connection established');
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
