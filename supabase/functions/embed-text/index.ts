
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, model } = await req.json();
    
    if (!text) {
      throw new Error("Missing required 'text' parameter");
    }

    console.log(`Generating embedding for text of length: ${text.length} using model: ${model || 'gte-small'}`);

    // Using OpenAI's API for embeddings (gte-small is available there)
    const embeddingResponse = await fetch("https://api.openai.com/v1/embeddings", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: JSON.stringify({
        input: text,
        model: model || "text-embedding-ada-002", // Using OpenAI's embedding model
      }),
    });

    if (!embeddingResponse.ok) {
      const errorText = await embeddingResponse.text();
      console.error(`API Error Status: ${embeddingResponse.status}`);
      console.error(`API Error Response: ${errorText}`);
      return new Response(
        JSON.stringify({ error: `API error: ${errorText}` }), {
          status: embeddingResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const embeddingData = await embeddingResponse.json();
    console.log('Embedding generated successfully:', JSON.stringify(embeddingData).substring(0, 100) + '...');

    return new Response(
      JSON.stringify({ embedding: embeddingData.data[0].embedding }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in embed-text function:', error);
    return new Response(
      JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
