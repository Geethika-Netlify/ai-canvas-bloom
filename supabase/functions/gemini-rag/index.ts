
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { GoogleGenAI } from "https://esm.sh/@google/genai@0.9.0";

// Set up CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Initialize the Supabase client with environment variables
const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

// Initialize Google Gemini client
const ai = new GoogleGenAI({ apiKey: Deno.env.get("GEMINI_API_KEY") ?? "" });

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, documents } = await req.json();
    console.log("Received query:", query);
    console.log("Documents to process:", documents?.length || "none provided");

    // Step 1: Generate embeddings for the query using OpenAI compatible endpoint
    const queryEmbeddingResponse = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: query,
      }),
    });

    if (!queryEmbeddingResponse.ok) {
      const error = await queryEmbeddingResponse.text();
      console.error("Embedding API error:", error);
      throw new Error(`Failed to generate embeddings: ${error}`);
    }

    const queryEmbeddingData = await queryEmbeddingResponse.json();
    const queryEmbedding = queryEmbeddingData.data[0].embedding;

    // Step 2: Search for relevant documents in the vector store
    let context = "";
    
    if (!documents || documents.length === 0) {
      const { data: matchedDocuments, error: matchError } = await supabaseClient.rpc(
        "match_documents",
        {
          query_embedding: queryEmbedding,
          match_threshold: 0.78,
          match_count: 5,
        }
      );

      if (matchError) {
        console.error("Vector search error:", matchError);
        throw new Error(`Vector search failed: ${matchError.message}`);
      }

      console.log("Matched documents:", matchedDocuments?.length || 0);
      
      // Combine the matched documents into a context string
      context = matchedDocuments
        ? matchedDocuments.map((doc) => doc.content).join("\n\n")
        : "";
    } else {
      // Use provided documents instead of searching
      context = documents.join("\n\n");
    }

    // Step 3: Generate response using Gemini API with retrieved context
    const model = ai.models.getGenerativeModel({
      model: "gemini-2.0-flash-lite",
    });

    const prompt = `
You are an advanced AI assistant. Please answer the following question based on the context provided.

Context:
${context}

Question: ${query}

If the question cannot be answered based solely on the context, please say "I don't have enough information to answer that." and suggest what other information might be helpful.
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    console.log("Generated response successfully");

    // Step 4: Return the response
    return new Response(
      JSON.stringify({
        answer: response,
        context: context ? context.substring(0, 200) + "..." : "No context available",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in RAG function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unknown error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
