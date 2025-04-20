
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { askQuestion } from "@/utils/knowledgeBaseClient";
import { toast } from "sonner";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: {
    id: number;
    title: string;
    similarity: number;
  }[];
}

export const KnowledgeBaseChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      toast.error("Please enter a question");
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: question
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);
    
    try {
      const response = await askQuestion(question);
      
      if (!response.success) {
        throw new Error(response.error?.message || "Failed to get answer");
      }

      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.answer,
        sources: response.data.sources
      };
      
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error("Error getting answer:", error);
      toast.error(`Error: ${error instanceof Error ? error.message : "Failed to get answer"}`);
    } finally {
      setIsLoading(false);
      setQuestion('');
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 space-y-4">
      <div className="flex-grow overflow-auto space-y-4 pb-4">
        {messages.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-xl font-medium">Ask a question about the knowledge base</h3>
            <p className="text-muted-foreground mt-2">
              Upload documents in the Knowledge Base page to get started
            </p>
          </div>
        )}
        
        {messages.map((message) => (
          <Card key={message.id} className={`${message.role === 'assistant' ? 'bg-secondary/30' : ''}`}>
            <CardContent className="p-4">
              <div className="font-medium mb-2">
                {message.role === 'user' ? 'You' : 'AI Assistant'}
              </div>
              <div className="whitespace-pre-wrap">{message.content}</div>
              
              {message.sources && message.sources.length > 0 && (
                <div className="mt-4">
                  <p className="font-medium text-sm">Sources:</p>
                  <ul className="text-sm text-muted-foreground">
                    {message.sources.map((source) => (
                      <li key={source.id} className="mt-1">
                        {source.title} (Similarity: {(source.similarity * 100).toFixed(1)}%)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        
        {isLoading && (
          <Card className="bg-secondary/30">
            <CardContent className="p-4">
              <div className="font-medium mb-2">AI Assistant</div>
              <div className="animate-pulse">Thinking...</div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <Textarea 
          placeholder="Ask a question about the knowledge base..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="min-h-[100px]"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !question.trim()}>
          {isLoading ? "Processing..." : "Ask Question"}
        </Button>
      </form>
    </div>
  );
};
