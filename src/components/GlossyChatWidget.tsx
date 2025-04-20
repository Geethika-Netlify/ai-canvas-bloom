
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip, Mic } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "@/components/ui/chat-bubble";
import { ChatInput } from "@/components/ui/chat-input";
import { ExpandableChat, ExpandableChatHeader, ExpandableChatBody, ExpandableChatFooter } from "@/components/ui/expandable-chat";
import { ChatMessageList } from "@/components/ui/chat-message-list";
import { ChatHeader } from './chat/ChatHeader';
import { useGlossyAnimation } from '@/hooks/useGlossyAnimation';
import { useChatState } from '@/hooks/useChatState';

export const GlossyChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const glossyContainerRef = useRef<HTMLDivElement>(null);
  const { messages, input, setInput, isLoading, handleSendMessage } = useChatState();
  
  useGlossyAnimation(glossyContainerRef, isOpen);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <div className="fixed bottom-8 right-8 z-[9999]">
      {isOpen ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <ExpandableChat size="lg" position="bottom-right" className="glossy-chat-window">
            <ExpandableChatHeader className="flex items-center justify-between">
              <ChatHeader glossyContainerRef={glossyContainerRef} onClose={toggleChat} />
            </ExpandableChatHeader>

            <ExpandableChatBody className="backdrop-blur-sm bg-background/80">
              <ChatMessageList>
                {messages.map(message => (
                  <ChatBubble key={message.id} variant={message.sender === "user" ? "sent" : "received"}>
                    <ChatBubbleAvatar fallback={message.sender === "user" ? "You" : "AI"} />
                    <ChatBubbleMessage variant={message.sender === "user" ? "sent" : "received"}>
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
            </ExpandableChatBody>

            <ExpandableChatFooter>
              <form onSubmit={handleSubmit} className="relative rounded-lg border bg-background/80 backdrop-blur-sm focus-within:ring-1 focus-within:ring-ring p-1">
                <ChatInput
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask GAIA anything..."
                  className="min-h-12 resize-none rounded-lg bg-background/0 border-0 p-3 shadow-none focus-visible:ring-0 font-montserrat"
                />
                <div className="flex items-center p-3 pt-0 justify-between">
                  <div className="flex">
                    <Button variant="ghost" size="icon" type="button">
                      <Paperclip className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" type="button">
                      <Mic className="size-4" />
                    </Button>
                  </div>
                  <Button type="submit" size="sm" className="ml-auto gap-1.5">
                    Send
                    <Send className="size-3.5" />
                  </Button>
                </div>
              </form>
            </ExpandableChatFooter>
          </ExpandableChat>
        </motion.div>
      ) : (
        <motion.div
          className="cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={toggleChat}
        >
          <div className="flex flex-col items-center">
            <motion.div
              className={`rounded-full overflow-hidden transition-transform duration-300 ease-out ${
                isHovered ? 'transform -translate-y-2' : ''
              }`}
              style={{
                filter: 'drop-shadow(0 0 20px rgba(100, 200, 255, 0.3))',
                willChange: 'transform'
              }}
              ref={glossyContainerRef}
            />
            <div
              className={`mt-2 font-montserrat font-bold text-xl bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent transition-all duration-300 ease-out ${
                isHovered ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'
              }`}
            >
              <strong>Talk to GAIA</strong>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
