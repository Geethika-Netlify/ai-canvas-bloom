
import { useState, useCallback, useRef } from 'react';
import { geminiClient, LIVE_CONFIG } from '@/utils/geminiClient';
import { AudioManager } from '@/utils/audioUtils';

export const useGeminiLiveStream = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioManagerRef = useRef<AudioManager | null>(null);

  const startLiveStream = useCallback(async () => {
    try {
      audioManagerRef.current = new AudioManager();
      await audioManagerRef.current.initialize();

      const liveSession = await geminiClient.live.connect(LIVE_CONFIG);
      
      // Start audio processing loop
      const processAudio = async () => {
        while (isListening) {
          const audioChunk = audioManagerRef.current?.getAudioChunk();
          if (audioChunk) {
            await liveSession.send(audioChunk);
            
            // Handle response
            const response = await liveSession.receive();
            if (response.data) {
              await audioManagerRef.current?.playAudio(response.data);
            }
          }
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      };

      setIsConnected(true);
      setIsListening(true);
      processAudio();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsConnected(false);
      setIsListening(false);
    }
  }, [isListening]);

  const stopLiveStream = useCallback(async () => {
    if (audioManagerRef.current) {
      await audioManagerRef.current.stop();
      audioManagerRef.current = null;
    }
    setIsConnected(false);
    setIsListening(false);
  }, []);

  return {
    startLiveStream,
    stopLiveStream,
    isConnected,
    isListening,
    error
  };
};
