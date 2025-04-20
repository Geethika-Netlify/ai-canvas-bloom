
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// This function uses the Supabase Vector API to generate embeddings
// with the "gte-small" model which has 384 dimensions
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();

    if (!text) {
      return new Response(
        JSON.stringify({ error: "Text is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Call Supabase's built-in embedding functionality
    // This uses the pgvector extension with the "gte-small" model
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";

    console.log("Calling embedding API with text length:", text.length);

    const response = await fetch(`${SUPABASE_URL}/functions/v1/embeddings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
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
    console.log("Successfully generated embedding with dimensions:", data[0].embedding.length);
    
    return new Response(
      JSON.stringify({ embedding: data[0].embedding }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in embed-text function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
