import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlossyCircle } from "./GlossyCircle";
import { Button } from "./ui/button";
import { SendIcon, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
};
export const GlossyChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([{
    id: "welcome",
    content: "Hi, I'm GAIA.! You can ask any question about Geethika",
    role: "assistant",
    timestamp: new Date()
  }]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    toast
  } = useToast();
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  };
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const userMessage = {
      id: crypto.randomUUID(),
      content: inputValue,
      role: "user" as const,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    try {
      const response = await supabase.functions.invoke('gemini-rag', {
        body: {
          query: userMessage.content
        }
      });
      if (response.error) {
        throw new Error(response.error.message || 'Failed to get a response');
      }
      const aiMessage = {
        id: crypto.randomUUID(),
        content: response.data.answer,
        role: "assistant" as const,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive"
      });
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        content: "Sorry, I'm having trouble responding right now. Please try again later.",
        role: "assistant",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && <motion.div initial={{
        opacity: 0,
        scale: 0.8,
        y: 20
      }} animate={{
        opacity: 1,
        scale: 1,
        y: 0
      }} exit={{
        opacity: 0,
        scale: 0.8,
        y: 20
      }} className="bg-background mb-4 rounded-lg shadow-lg border border-border w-80 sm:w-96 h-[500px] max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-3 border-b border-border bg-muted/20 flex justify-between items-center">
              <h2 className="font-semibold text-sm">GAIA - Geethika's AI Assistant</h2>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={toggleOpen}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto">
              <div className="space-y-4">
                {messages.map(message => <div key={message.id} className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}>
                    <div className={`rounded-lg px-3 py-2 max-w-[85%] ${message.role === "assistant" ? "bg-muted text-foreground" : "bg-primary text-primary-foreground"}`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>)}
                {isLoading && <div className="flex justify-start">
                    <div className="rounded-lg px-3 py-2 bg-muted text-foreground">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </div>
                  </div>}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="border-t border-border p-3 flex items-center space-x-2">
              <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="Type a message..." className="flex-1 bg-muted/50 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" disabled={isLoading} />
              <Button type="submit" size="icon" disabled={!inputValue.trim() || isLoading}>
                <SendIcon className="h-4 w-4" />
              </Button>
            </form>
          </motion.div>}
      </AnimatePresence>

      <motion.div whileHover={{
      scale: 1.05
    }} whileTap={{
      scale: 0.95
    }} onClick={toggleOpen} className="cursor-pointer">
        <GlossyCircle isExpanded={isOpen} />
      </motion.div>
    </div>;
};