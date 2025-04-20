
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

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
      .from('documents')
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

/**
 * Retrieve a specific document by its ID
 * @param id Document ID
 * @returns Promise with the document details
 */
export async function getDocument(id: number) {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select("*")
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return { success: true, document: data };
  } catch (error) {
    console.error("Error retrieving document:", error);
    return { success: false, error };
  }
}

/**
 * Ask a question to the RAG system
 * @param question The question to ask
 * @returns Promise with the answer from the RAG system
 */
export async function askQuestion(question: string) {
  try {
    const { data, error } = await supabase.functions.invoke('gemini-rag', {
      body: { query: question }
    });

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error asking question to RAG system:", error);
    return { success: false, error };
  }
}
