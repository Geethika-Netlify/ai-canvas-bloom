
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.1";

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

// This function will generate embeddings using Supabase's "gte-small" model
async function generateEmbedding(text: string) {
  try {
    console.log("Calling embed-text function for text of length:", text.length);
    
    // Direct API call to generate embedding
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
      console.error("Error response:", errorText);
      throw new Error(`Embedding API error: ${errorText}`);
    }

    const data = await response.json();
    console.log("Embedding generated successfully");
    return data[0].embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error;
  }
}

async function storeDocument(title: string, content: string, embedding: number[]) {
  try {
    console.log("Storing document with title:", title);
    const { data, error } = await supabaseClient
      .from("documents")
      .insert({
        title,
        content,
        embedding,
        metadata: { source: "upload" }
      })
      .select();

    if (error) {
      console.error("Database error:", error);
      throw error;
    }

    console.log("Document stored successfully");
    return data;
  } catch (error) {
    console.error("Error storing document:", error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, content } = await req.json();

    if (!title || !content) {
      return new Response(
        JSON.stringify({ error: "Title and content are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Processing document with title:", title);
    
    // Generate an embedding for the document content
    const embedding = await generateEmbedding(content);
    
    // Store the document and its embedding in the database
    const document = await storeDocument(title, content, embedding);

    return new Response(
      JSON.stringify({ 
        message: "Document processed and stored successfully", 
        document 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in generate-embeddings function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
