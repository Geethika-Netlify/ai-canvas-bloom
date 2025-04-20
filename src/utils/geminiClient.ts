
import { supabase } from "@/integrations/supabase/client";

// Types for the messages
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Send a message to Gemini API through Supabase Edge Function
 */
export const sendMessage = async (
  messages: ChatMessage[],
  stream = false,
  onChunk?: (chunk: string) => void
): Promise<string | null> => {
  try {
    if (stream && onChunk) {
      // Streaming mode
      const { data, error } = await supabase.functions.invoke("gemini-stream", {
        body: { messages, stream: true },
      });
      
      if (error) {
        console.error("Error streaming response:", error);
        throw new Error(`Failed to stream response: ${error.message}`);
      }
      
      // Handle streaming response
      const reader = data.getReader();
      const decoder = new TextDecoder();
      
      let responseText = "";
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }
        
        // Process the chunk data
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");
        
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const parsedData = JSON.parse(line.substring(6));
              if (parsedData.text) {
                responseText += parsedData.text;
                onChunk(parsedData.text);
              }
            } catch (e) {
              console.warn("Error parsing SSE data:", e);
            }
          }
        }
      }
      
      return responseText;
    } else {
      // Regular, non-streaming mode
      const { data, error } = await supabase.functions.invoke("gemini-stream", {
        body: { messages, stream: false },
      });
      
      if (error) {
        console.error("Error sending message:", error);
        throw new Error(`Failed to send message: ${error.message}`);
      }
      
      return data?.text || null;
    }
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};

/**
 * RAG query function
 */
export const ragQuery = async (query: string): Promise<{answer: string, context: string}> => {
  try {
    const { data, error } = await supabase.functions.invoke("gemini-rag", {
      body: { query },
    });
    
    if (error) {
      console.error("Error with RAG query:", error);
      throw new Error(`RAG query failed: ${error.message}`);
    }
    
    return {
      answer: data.answer,
      context: data.context
    };
  } catch (error) {
    console.error("RAG query failed:", error);
    throw error;
  }
};

/**
 * Add a document to the vector database
 */
export const addDocument = async (title: string, content: string, metadata = {}) => {
  try {
    const { data, error } = await supabase.functions.invoke("embed-document", {
      body: { title, content, metadata },
    });
    
    if (error) {
      console.error("Error adding document:", error);
      throw new Error(`Failed to add document: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error("Adding document failed:", error);
    throw error;
  }
};
