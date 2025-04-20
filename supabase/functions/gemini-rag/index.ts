
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Create a Supabase client
const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_ANON_KEY") ?? "",
  {
    global: {
      headers: { Authorization: `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}` },
    },
  }
);

// Generate embeddings for the query using the embed-text function
async function generateEmbedding(text: string) {
  try {
    const { data, error } = await supabaseClient.functions.invoke('embed-text', {
      body: { text }
    });

    if (error) {
      throw error;
    }

    return data.embedding;
  } catch (error) {
    console.error("Error generating embedding for query:", error);
    throw error;
  }
}

// Search for similar documents using vector similarity
async function searchSimilarDocuments(embedding: number[], match_threshold = 0.72, match_count = 5) {
  try {
    const { data, error } = await supabaseClient.rpc(
      'match_documents',
      {
        query_embedding: embedding,
        match_threshold,
        match_count
      }
    );

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error searching similar documents:", error);
    throw error;
  }
}

// Format documents for context
function formatDocumentsForContext(documents: any[]) {
  if (!documents || documents.length === 0) {
    return "No relevant information found.";
  }

  return documents
    .map((doc) => `Document: ${doc.title}\n\nContent: ${doc.content}`)
    .join('\n\n---\n\n');
}

// Call Gemini API to generate a response
async function generateGeminiResponse(question: string, context: string) {
  try {
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    const MODEL_ID = "gemini-2.0-flash-lite";
    
    if (!GEMINI_API_KEY) {
      throw new Error("Missing GEMINI_API_KEY environment variable");
    }

    // Construct the system prompt with context and instructions
    const systemPrompt = `
You are an AI assistant that answers questions based on the context provided below.
Always respond in a helpful, accurate, and concise manner.
If the answer is not contained within the context, say "I don't have enough information to answer that question."
Don't make up information or provide answers that aren't supported by the context.

Context:
${context}

Answer the question using ONLY the information provided in the context above. Use markdown formatting in your response.
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: systemPrompt },
                { text: question }
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: 1024,
            temperature: 0.2,
            responseMimeType: "text/plain",
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_LOW_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_LOW_AND_ABOVE"
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log("Gemini response:", data);

    if (data.candidates && data.candidates.length > 0 && 
        data.candidates[0].content && data.candidates[0].content.parts && 
        data.candidates[0].content.parts.length > 0) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Unexpected response format from Gemini API");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}

// Main handler function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question } = await req.json();

    if (!question) {
      return new Response(
        JSON.stringify({ error: "Question is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Received question:", question);

    // 1. Generate embedding for the question
    const embedding = await generateEmbedding(question);
    
    // 2. Search for similar documents
    const similarDocuments = await searchSimilarDocuments(embedding);
    
    console.log(`Found ${similarDocuments?.length || 0} similar documents`);
    
    // 3. Format documents as context
    const context = formatDocumentsForContext(similarDocuments);
    
    // 4. Generate response from Gemini using context
    const answer = await generateGeminiResponse(question, context);

    return new Response(
      JSON.stringify({ 
        answer,
        sources: similarDocuments?.map((doc: any) => ({
          id: doc.id,
          title: doc.title,
          similarity: doc.similarity
        })) || [] 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in gemini-rag function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unknown error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
