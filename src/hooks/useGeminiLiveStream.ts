
import { useState, useCallback, useRef } from 'react';
import { geminiClient, LIVE_CONFIG } from '@/utils/geminiClient';
import { AudioManager } from '@/utils/audioUtils';
import { LiveSession, LiveConnectParameters } from '@google/genai';

export const useGeminiLiveStream = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioManagerRef = useRef<AudioManager | null>(null);
  const liveSessionRef = useRef<LiveSession | null>(null);

  const startLiveStream = useCallback(async () => {
    try {
      audioManagerRef.current = new AudioManager();
      await audioManagerRef.current.initialize();

      // Properly type the live connect parameters
      const liveConnectParams: LiveConnectParameters = {
        model: LIVE_CONFIG.model,
        config: LIVE_CONFIG.config,
        // Add the required callbacks property
        callbacks: {}
      };

      const liveSession = await geminiClient.live.connect(liveConnectParams);
      liveSessionRef.current = liveSession as LiveSession;
      
      // Start audio processing loop
      const processAudio = async () => {
        while (isListening) {
          const audioChunk = audioManagerRef.current?.getAudioChunk();
          if (audioChunk && liveSessionRef.current) {
            // Use the session from the ref
            await liveSessionRef.current.sendAudio(audioChunk);
            
            // Handle response
            const response = await liveSessionRef.current.receiveResponse();
            if (response && response.audio) {
              await audioManagerRef.current?.playAudio(response.audio);
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
