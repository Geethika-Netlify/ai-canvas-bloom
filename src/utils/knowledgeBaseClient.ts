
import { supabase } from "@/integrations/supabase/client";

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
    const { data, error } = await supabase
      .from("documents")
      .select("id, title, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return { success: true, documents: data };
  } catch (error) {
    console.error("Error listing documents:", error);
    return { success: false, error };
  }
}
