
import { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExpandableChat, ExpandableChatHeader, ExpandableChatBody, ExpandableChatFooter } from "@/components/ui/expandable-chat";
import { ChatMessageList } from "@/components/ui/chat-message-list";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "@/components/ui/chat-bubble";
import { useGeminiChat } from '@/hooks/useGeminiChat';
import { ThreeJSAnimation } from './chat/ThreeJSAnimation';
import { ChatHeader } from './chat/ChatHeader';
import { ChatInputSection } from './chat/ChatInputSection';

export const GlossyChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [input, setInput] = useState("");
  const { messages, isLoading, error, sendMessage } = useGeminiChat();
  const chatBodyRef = useRef<HTMLDivElement>(null);

  const isApiKeyMissing = error?.includes('API key is missing');

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatBodyRef.current && messages.length > 0) {
      const scrollArea = chatBodyRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage(input);
    setInput("");
  };

  if (!isOpen) {
    return (
      <div 
        className="fixed bottom-8 right-8 z-[9999] cursor-pointer" 
        onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)} 
        onClick={toggleChat}
      >
        <div className="flex flex-col items-center">
          <motion.div 
            className={`rounded-full overflow-hidden transition-transform duration-300 ease-out ${isHovered ? 'transform -translate-y-2' : ''}`} 
            style={{
              filter: 'drop-shadow(0 0 20px rgba(100, 200, 255, 0.3))',
              willChange: 'transform'
            }}
          >
            <ThreeJSAnimation isOpen={isOpen} />
          </motion.div>
          <div className={`mt-2 font-montserrat font-bold text-xl bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent transition-all duration-300 ease-out ${isHovered ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'}`}>
            <strong>Talk to GAIA</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 z-[9999]">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <ExpandableChat size="lg" position="bottom-right" className="glossy-chat-window">
          <ExpandableChatHeader>
            <ChatHeader isOpen={isOpen} onToggleChat={toggleChat} />
          </ExpandableChatHeader>
          
          <ExpandableChatBody className="backdrop-blur-sm bg-background/80">
            <div ref={chatBodyRef} className="h-full overflow-y-auto">
              {isApiKeyMissing ? (
                <Alert variant="destructive" className="m-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>API Key Missing</AlertTitle>
                  <AlertDescription className="space-y-4">
                    <p>Please add your Gemini API key to use GAIA:</p>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Go to <a href="https://ai.google.dev/" className="underline" target="_blank" rel="noopener noreferrer">Google AI Studio</a></li>
                      <li>Create or sign in to your account</li>
                      <li>Get an API key from the API Keys section</li>
                      <li>Add it as <code className="bg-muted-foreground/20 p-1 rounded">VITE_GEMINI_API_KEY</code> in your project environment variables</li>
                    </ol>
                    <p className="text-sm italic">After adding the API key, refresh the page to use GAIA.</p>
                  </AlertDescription>
                </Alert>
              ) : error ? (
                <Alert variant="destructive" className="mb-4 mx-4 mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}
              
              <ChatMessageList>
                {messages.map(message => (
                  <ChatBubble
                    key={message.id}
                    variant={message.sender === "user" ? "sent" : "received"}
                  >
                    <ChatBubbleAvatar
                      fallback={message.sender === "user" ? "You" : "AI"}
                    />
                    <ChatBubbleMessage
                      variant={message.sender === "user" ? "sent" : "received"}
                    >
                      {message.content}
                    </ChatBubbleMessage>
                  </ChatBubble>
                ))}

                {isLoading && (
                  <ChatBubble variant="received">
                    <ChatBubbleAvatar fallback="AI" />
                    <ChatBubbleMessage isLoading />
                  </ChatBubble>
                )}
              </ChatMessageList>
            </div>
          </ExpandableChatBody>

          <ExpandableChatFooter>
            <ChatInputSection
              input={input}
              isLoading={isLoading}
              isApiKeyMissing={isApiKeyMissing}
              onInputChange={(e) => setInput(e.target.value)}
              onSubmit={handleSubmit}
            />
          </ExpandableChatFooter>
        </ExpandableChat>
      </motion.div>
    </div>
  );
};
