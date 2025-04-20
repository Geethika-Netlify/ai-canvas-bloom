
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenAI } from "https://esm.sh/@google/genai@0.9.0";

// Set up CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Check for required environment variables
const apiKey = Deno.env.get("GEMINI_API_KEY");
if (!apiKey) {
  console.error("GEMINI_API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey });

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, stream = true } = await req.json();
    console.log(`Processing request with ${messages?.length || 0} messages`);
    
    if (!messages || !Array.isArray(messages)) {
      throw new Error("Messages must be provided as an array");
    }

    // Map messages to the format expected by Gemini API
    const formattedMessages = messages.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    const model = ai.models.getGenerativeModel({
      model: "gemini-2.0-flash-lite",
    });

    if (stream) {
      // Create a TransformStream for streaming the response
      const stream = new TransformStream();
      const writer = stream.writable.getWriter();
      
      // Start generating the streaming response
      (async () => {
        try {
          const result = await model.generateContentStream({
            contents: formattedMessages,
            generationConfig: {
              responseMimeType: "text/plain",
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_LOW_AND_ABOVE",
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_NONE",
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_LOW_AND_ABOVE",
              },
            ],
          });

          for await (const chunk of result.stream) {
            const text = chunk.text;
            const encoder = new TextEncoder();
            await writer.write(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
          }
          
          await writer.close();
        } catch (error) {
          console.error("Streaming error:", error);
          const encoder = new TextEncoder();
          await writer.write(
            encoder.encode(`data: ${JSON.stringify({ error: error.message })}\n\n`)
          );
          await writer.close();
        }
      })();

      return new Response(stream.readable, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    } else {
      // Non-streaming response
      const result = await model.generateContent({
        contents: formattedMessages,
        generationConfig: {
          responseMimeType: "text/plain",
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_LOW_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_LOW_AND_ABOVE",
          },
        ],
      });

      return new Response(
        JSON.stringify({ text: result.response.text() }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Error in Gemini API function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unknown error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
