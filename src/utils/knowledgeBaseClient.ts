
import { supabase } from "@/integrations/supabase/client";

// Define the Document type to match our database schema
interface Document {
  id: number;
  title: string;
  content: string;
  metadata?: Record<string, any>;
  created_at: string;
}

/**
 * Upload a document to the knowledge base
 * @param title Document title
 * @param content Document content
 * @returns Promise with the result of the upload
 */
export async function uploadDocument(title: string, content: string) {
  try {
    const { data, error } = await supabase.functions.invoke('generate-embeddings', {
      body: { title, content }
    });

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error uploading document:", error);
    return { success: false, error };
  }
}

/**
 * Get a list of all documents in the knowledge base
 * @returns Promise with the list of documents
 */
export async function listDocuments() {
  try {
    // Use explicit type casting to overcome type issues
    // This is necessary because the TypeScript types don't know about our "documents" table yet
    const { data, error } = await (supabase
      .from("documents") as any)
      .select("id, title, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return { success: true, documents: data as Document[] };
  } catch (error) {
    console.error("Error listing documents:", error);
    return { success: false, error };
  }
}

/**
 * Query the knowledge base with a question
 * @param question User's question
 * @returns Promise with the AI response
 */
export async function queryKnowledgeBase(question: string) {
  try {
    const { data, error } = await supabase.functions.invoke('gemini-rag', {
      body: { question }
    });

    if (error) {
      throw error;
    }

    return { success: true, answer: data.answer };
  } catch (error) {
    console.error("Error querying knowledge base:", error);
    return { success: false, error };
  }
}
