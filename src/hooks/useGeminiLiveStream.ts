import { useState, useEffect, useRef } from 'react';
import { geminiLiveStream } from '@/utils/GeminiLiveStream';
import { useToast } from '@/components/ui/use-toast';

export type Message = {
  id: number;
  content: string;
  sender: 'user' | 'ai';
};

interface UseGeminiLiveStreamOptions {
  onInitialized?: () => void;
  onMessage?: (message: Message) => void;
  onSpeakingChange?: (isSpeaking: boolean) => void;
}

export const useGeminiLiveStream = (options: UseGeminiLiveStreamOptions = {}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const messageIdCounter = useRef(0);
  const { toast } = useToast();

  // Initialize the Gemini API
  const initialize = async (key: string) => {
    console.log('Initializing Gemini API...');
    setIsProcessing(true);
    const success = await geminiLiveStream.initialize(key);
    
    if (success) {
      console.log('Gemini API initialized successfully');
      setIsInitialized(true);
      setApiKey(key);
      toast({
        title: "API Initialized",
        description: "Gemini Live API is ready to use",
      });
      if (options.onInitialized) {
        options.onInitialized();
      }
    } else {
      console.error('Failed to initialize Gemini API');
      toast({
        title: "Initialization Failed",
        description: "Could not initialize Gemini Live API",
        variant: "destructive",
      });
    }
    setIsProcessing(false);
    return success;
  };

  // Start recording and streaming audio
  const startRecording = async () => {
    console.log('Starting recording...');
    if (!isInitialized) {
      console.error('Gemini API not initialized');
      toast({
        title: "Not Initialized",
        description: "Please initialize the Gemini API first",
        variant: "destructive",
      });
      return false;
    }

    setIsProcessing(true);
    console.log('Requesting microphone access...');
    const micStarted = await geminiLiveStream.startMicrophone();
    
    if (!micStarted) {
      console.error('Failed to access microphone');
      toast({
        title: "Microphone Access Failed",
        description: "Could not access your microphone",
        variant: "destructive",
      });
      setIsProcessing(false);
      return false;
    }
    
    console.log('Microphone access granted, starting stream...');
    const streamStarted = await geminiLiveStream.startStream({
      onTextReceived: (text) => {
        console.log('Received text from Gemini:', text);
        const newMessage = {
          id: messageIdCounter.current++,
          content: text,
          sender: 'ai' as const,
        };
        
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          
          // If the last message is from AI, append to it
          if (lastMessage && lastMessage.sender === 'ai') {
            console.log('Appending to existing AI message');
            return [
              ...prev.slice(0, -1), 
              { ...lastMessage, content: lastMessage.content + text }
            ];
          }
          
          // Otherwise, create a new message
          console.log('Creating new AI message');
          return [...prev, newMessage];
        });
        
        if (options.onMessage) {
          options.onMessage(newMessage);
        }
      },
      onAudioReceived: () => {
        // Start speaking indicator
        console.log('Audio received, AI is speaking');
        if (!isSpeaking) {
          setIsSpeaking(true);
          if (options.onSpeakingChange) {
            options.onSpeakingChange(true);
          }
        }
      },
      onStopSpeaking: () => {
        console.log('AI stopped speaking');
        setIsSpeaking(false);
        if (options.onSpeakingChange) {
          options.onSpeakingChange(false);
        }
      },
      onError: (error) => {
        console.error('Stream error:', error);
        toast({
          title: "Stream Error",
          description: error.message,
          variant: "destructive",
        });
        stopRecording();
      }
    });

    if (streamStarted) {
      console.log('Stream started successfully');
      setIsRecording(true);
      toast({
        title: "Recording Started",
        description: "You can now speak with the AI",
      });
    } else {
      console.error('Failed to start stream');
      toast({
        title: "Stream Failed",
        description: "Could not start the audio stream",
        variant: "destructive",
      });
      await geminiLiveStream.stopStream();
    }

    setIsProcessing(false);
    return streamStarted;
  };

  // Stop recording and streaming
  const stopRecording = async () => {
    console.log('Stopping recording...');
    setIsProcessing(true);
    await geminiLiveStream.stopStream();
    setIsRecording(false);
    setIsSpeaking(false);
    setIsProcessing(false);

    if (options.onSpeakingChange) {
      options.onSpeakingChange(false);
    }

    console.log('Recording stopped successfully');
    toast({
      title: "Recording Stopped",
      description: "Audio stream has been closed",
    });

    return true;
  };

  // Send a text message
  const sendTextMessage = async (text: string) => {
    console.log('Sending text message:', text);
    if (!isInitialized) {
      console.error('Gemini API not initialized');
      toast({
        title: "Not Initialized",
        description: "Please initialize the Gemini API first",
        variant: "destructive",
      });
      return false;
    }

    const newMessage = {
      id: messageIdCounter.current++,
      content: text,
      sender: 'user' as const,
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    if (options.onMessage) {
      options.onMessage(newMessage);
    }

    console.log('Sending text message to Gemini API...');
    const success = await geminiLiveStream.sendTextMessage(text);
    
    if (!success) {
      console.error('Failed to send message');
      toast({
        title: "Message Failed",
        description: "Could not send your message",
        variant: "destructive",
      });
    } else {
      console.log('Message sent successfully');
    }

    return success;
  };

  // Clean up when unmounting
  useEffect(() => {
    return () => {
      if (isRecording) {
        console.log('Component unmounting, stopping recording');
        geminiLiveStream.stopStream();
      }
    };
  }, [isRecording]);

  return {
    isInitialized,
    isRecording,
    isProcessing,
    isSpeaking,
    messages,
    initialize,
    startRecording,
    stopRecording,
    sendTextMessage,
  };
};
