
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const UploadKnowledgeBase = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Use the filename as the default title if none is set
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, "")); // Remove file extension
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    if (!title) {
      toast.error("Please provide a title for the document");
      return;
    }

    setIsLoading(true);
    
    try {
      // Read the file content
      const content = await file.text();
      
      // Call the generate-embeddings function
      const { data, error } = await supabase.functions.invoke('generate-embeddings', {
        body: { title, content }
      });

      if (error) {
        throw error;
      }

      toast.success("Document uploaded and processed successfully!");
      
      // Reset the form
      setFile(null);
      setTitle("");
      
      // Reset the file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error(`Error uploading document: ${error.message || error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Knowledge Base Upload</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Upload .txt files to add to the knowledge base
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Document Title
            </label>
            <Input
              id="title"
              type="text"
              placeholder="Enter document title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="file-upload" className="text-sm font-medium">
              Select File (.txt)
            </label>
            <Input
              id="file-upload"
              type="file"
              accept=".txt"
              onChange={handleFileChange}
            />
            <p className="text-xs text-muted-foreground">
              Only .txt files are supported
            </p>
          </div>

          <Button 
            className="w-full" 
            disabled={isLoading || !file} 
            onClick={handleUpload}
          >
            {isLoading ? "Processing..." : "Upload"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadKnowledgeBase;
