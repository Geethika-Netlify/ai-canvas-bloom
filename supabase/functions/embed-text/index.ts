
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

    console.log("Generating embedding for text of length:", text.length);

    // Call Supabase's embedding endpoint with proper URL and headers
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
      const errorData = await response.text();
      console.error("Embedding API error response:", errorData);
      throw new Error(`Embedding API error: ${errorData}`);
    }

    const data = await response.json();
    console.log("Embedding generated successfully");
    
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
