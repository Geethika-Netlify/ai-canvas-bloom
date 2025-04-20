
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Session } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!, 
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase AI session for embeddings
    const session = new Supabase.ai.Session('gte-small');

    // Parse form data
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file uploaded' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Read file content
    const fileContent = await file.text();
    const title = file.name;

    // Generate embedding
    const embedding = await session.run(fileContent, {
      mean_pool: true,
      normalize: true,
    });

    // Store document and embedding in Supabase
    const { data, error } = await supabase
      .from('documents')
      .insert({
        title,
        content: fileContent,
        embedding,
        metadata: { 
          file_type: file.type, 
          file_size: file.size 
        }
      });

    if (error) throw error;

    return new Response(JSON.stringify({ 
      message: 'File uploaded and embedded successfully',
      documentId: data 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Embedding generation error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
