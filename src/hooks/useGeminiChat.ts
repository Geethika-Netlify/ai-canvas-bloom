
import { useState, useEffect, useCallback } from 'react';
import { getGeminiChat, streamGeminiResponse } from '@/lib/gemini-client';

export type Message = {
  id: number;
  content: string;
  sender: 'user' | 'ai';
};

export const useGeminiChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hello! I am GAIA. How can I assist you today?",
      sender: "ai"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatInstance, setChatInstance] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initChat = async () => {
      try {
        const chat = await getGeminiChat();
        setChatInstance(chat);
        setError(null);
      } catch (err) {
        console.error('Failed to initialize chat:', err);
        setError('Failed to initialize chat. Please check your API key and try again.');
      }
    };
    initChat();
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!chatInstance || !content.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      content,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await streamGeminiResponse(chatInstance, content);
      let fullResponse = '';

      for await (const chunk of response) {
        fullResponse += chunk.text ?? '';
      }

      setMessages(prev => [...prev, {
        id: prev.length + 1,
        content: fullResponse,
        sender: 'ai'
      }]);
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError(err.message || 'Failed to get a response. Please try again.');
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        content: "I apologize, but I encountered an error processing your request. Please try again.",
        sender: 'ai'
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [chatInstance, messages]);

  return {
    messages,
    isLoading,
    error,
    sendMessage
  };
};
