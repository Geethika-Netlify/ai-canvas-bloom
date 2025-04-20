
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const geminiApiKey = Deno.env.get('GEMINI_API_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { query } = await req.json();
    
    if (!query || query.trim() === "") {
      return new Response(
        JSON.stringify({ error: "Query is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Received query:", query);

    // Step 1: Generate embedding for the query
    console.log("Generating embedding for query");
    const session = new Supabase.ai.Session('gte-small');
    const queryEmbedding = await session.run(query, {
      mean_pool: true,
      normalize: true,
    });

    // Step 2: Perform similarity search to find relevant documents
    console.log("Performing similarity search");
    const { data: documents, error } = await supabase.rpc(
      'match_documents',
      {
        query_embedding: queryEmbedding,
        match_threshold: 0.7,
        match_count: 3
      }
    );

    if (error) {
      console.error("Similarity search error:", error);
      throw new Error("Error performing similarity search");
    }

    console.log(`Found ${documents.length} relevant documents`);
    
    // Step 3: Build context from relevant documents
    let context = "";
    if (documents && documents.length > 0) {
      context = documents.map((doc: any) => `Document Title: ${doc.title}\nContent: ${doc.content}\n`).join("\n");
      console.log("Built context from documents");
    } else {
      console.log("No relevant documents found");
    }

    // Step 4: Build the prompt with context for Gemini
    const promptWithContext = context 
      ? `Based on the following information:\n\n${context}\n\nPlease answer this question: ${query}`
      : `Please answer this question: ${query}`;
      
    console.log("Sending request to Gemini API");
    
    // Step 5: Send request to Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: promptWithContext
                }
              ]
            }
          ],
          generationConfig: {
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
        })
      }
    );

    const geminiData = await geminiResponse.json();
    console.log("Received response from Gemini API");
    
    // Extract the AI response
    let aiResponse = "Sorry, I couldn't generate a response.";
    if (geminiData.candidates?.[0]?.content?.parts?.[0]?.text) {
      aiResponse = geminiData.candidates[0].content.parts[0].text;
    } else if (geminiData.error) {
      console.error("Gemini API error:", geminiData.error);
      throw new Error(`Gemini API error: ${geminiData.error.message || 'Unknown error'}`);
    }

    // Return the final response
    return new Response(
      JSON.stringify({ 
        answer: aiResponse, 
        context: documents && documents.length > 0 ? documents : [] 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error("Error in gemini-rag function:", err);
    return new Response(
      JSON.stringify({ error: err.message || 'An unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
