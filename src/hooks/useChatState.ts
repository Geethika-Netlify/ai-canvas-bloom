
import { useState } from 'react';
import { ChatMessage } from '@/types/chat';

export const useChatState = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: 1,
    content: "Hello! I am GAIA. How can I assist you today?",
    sender: "ai"
  }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      content: input,
      sender: "user"
    }]);
    setInput("");
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        content: "I'm GAIA, your AI assistant. How can I help you further?",
        sender: "ai"
      }]);
      setIsLoading(false);
    }, 1000);
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    handleSendMessage
  };
};
