
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { queryKnowledgeBase } from "@/utils/knowledgeBaseClient";
import { Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function KnowledgeBaseChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input;
    setInput("");
    
    // Add user message to the chat
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    
    // Show loading state
    setIsLoading(true);
    
    try {
      // Query the knowledge base
      const response = await queryKnowledgeBase(userMessage);
      
      if (response.success) {
        // Add AI response to the chat
        setMessages(prev => [...prev, { role: "assistant", content: response.answer }]);
      } else {
        // Handle error
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: "Sorry, I encountered an error while processing your question. Please try again." 
        }]);
        console.error("Error querying knowledge base:", response.error);
      }
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Sorry, something went wrong. Please try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground p-8">
            Ask me anything based on your knowledge base.
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                message.role === "assistant"
                  ? "bg-secondary text-secondary-foreground ml-4"
                  : "bg-primary text-primary-foreground mr-4"
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-center items-center p-4">
            <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="border-t p-4 flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <Button 
          onClick={handleSendMessage} 
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
        </Button>
      </div>
    </div>
  );
}
