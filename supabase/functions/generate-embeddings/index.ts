
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, content } = await req.json();
    console.log(`Processing document: "${title}" with content length: ${content.length}`);

    // Generate embedding using our embed-text function
    const embeddingResponse = await fetch(`${SUPABASE_URL}/functions/v1/embed-text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: content,
        model: "gte-small",
      }),
    });

    if (!embeddingResponse.ok) {
      const errorText = await embeddingResponse.text();
      console.error(`Embedding API error status: ${embeddingResponse.status}`);
      console.error(`Embedding API error response: ${errorText}`);
      throw new Error(`Embedding API error: ${errorText}`);
    }

    const embeddingData = await embeddingResponse.json();
    
    if (!embeddingData || !embeddingData.embedding) {
      console.error('No embedding generated:', embeddingData);
      throw new Error('No embedding generated');
    }

    console.log('Successfully generated embedding');

    // Store document with embedding in the database
    const { data: insertData, error: insertError } = await supabase
      .from('documents')
      .insert({
        title,
        content,
        embedding: embeddingData.embedding,
      });

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw insertError;
    }

    console.log('Successfully inserted document with embedding');

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-embeddings function:', error);
    return new Response(
      JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
