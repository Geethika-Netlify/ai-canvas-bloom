
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.1";
import { GoogleGenAI } from "https://esm.sh/@google/genai@0.2.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Create a Supabase client with the Auth context of the function
const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  {
    global: {
      headers: { Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}` },
    },
  }
);

// Initialize Google Gemini client
const genAI = new GoogleGenAI({ apiKey: Deno.env.get("GEMINI_API_KEY") ?? "" });

// Generate embedding for user query using the same model as documents
async function generateQueryEmbedding(text: string) {
  try {
    console.log("Generating query embedding for:", text);
    const response = await fetch("https://api.supabase.com/v1/vector/embed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
        "apikey": Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
      },
      body: JSON.stringify({
        input: text,
        model: "gte-small"
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Embedding API error response:", errorText);
      throw new Error(`Embedding API error: ${errorText}`);
    }

    const data = await response.json();
    console.log("Query embedding generated successfully");
    return data[0].embedding;
  } catch (error) {
    console.error("Error generating query embedding:", error);
    throw error;
  }
}

// Search for similar documents using vector similarity
async function findSimilarDocuments(queryEmbedding: number[], limit = 5, threshold = 0.7) {
  try {
    console.log("Finding similar documents with threshold:", threshold);
    // Using the match_documents function defined in the database
    const { data, error } = await supabaseClient.rpc(
      'match_documents',
      {
        query_embedding: queryEmbedding,
        match_threshold: threshold,
        match_count: limit
      }
    );

    if (error) {
      console.error("Error finding similar documents:", error);
      throw error;
    }

    console.log(`Found ${data?.length ?? 0} similar documents`);
    return data || [];
  } catch (error) {
    console.error("Error in findSimilarDocuments:", error);
    throw error;
  }
}

// Format retrieved documents into context for the LLM
function formatContextFromDocuments(documents: any[]) {
  if (!documents.length) {
    return "No relevant information found in the knowledge base.";
  }

  let context = "Here is information from the knowledge base:\n\n";
  documents.forEach((doc, index) => {
    context += `DOCUMENT ${index + 1}:\n${doc.title}\n${doc.content}\n\n`;
  });

  return context;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();

    if (!query) {
      return new Response(
        JSON.stringify({ error: "Query is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Processing query:", query);
    
    // Generate embedding for the user query
    const queryEmbedding = await generateQueryEmbedding(query);
    
    // Find similar documents in the knowledge base
    const similarDocuments = await findSimilarDocuments(queryEmbedding);
    
    // Format context from retrieved documents
    const context = formatContextFromDocuments(similarDocuments);
    
    // Construct prompt for Gemini
    const model = genAI.models.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    
    // Construct the system prompt
    const systemPrompt = `You are a helpful AI assistant with access to a knowledge base. 
Answer the user's question based ONLY on the information provided in the context below. 
If the information needed to answer is not in the context, say "I don't have enough information in my knowledge base to answer that question."
Keep your answers concise, professional, and helpful.

CONTEXT:
${context}

USER QUERY:
${query}`;

    // Generate response from Gemini
    console.log("Sending request to Gemini");
    const response = await model.generateContent({
      contents: systemPrompt,
      config: {
        temperature: 0.2,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });

    console.log("Received response from Gemini");
    
    const result = {
      answer: response.text,
      sources: similarDocuments.map(doc => ({
        title: doc.title,
        similarity: doc.similarity,
        id: doc.id
      }))
    };

    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in gemini-rag function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
