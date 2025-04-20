
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const UploadKnowledgeBase = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file first",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const text = await file.text();
      const { error } = await supabase.functions.invoke('generate-embeddings', {
        body: { title: file.name, content: text }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "File uploaded and processed successfully",
      });
      setFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload and process the file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-4 p-6 border rounded-lg shadow-lg">
        <div className="space-y-2">
          <Input
            type="file"
            accept=".txt"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>
        <Button 
          onClick={handleUpload} 
          disabled={!file || isUploading}
          className="w-full"
        >
          {isUploading ? "Processing..." : "Upload"}
        </Button>
      </div>
    </div>
  );
};

export default UploadKnowledgeBase;
