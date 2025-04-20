
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Key } from 'lucide-react';

interface ApiKeySetupProps {
  onSubmit: (apiKey: string) => void;
  isProcessing: boolean;
}

export const ApiKeySetup: React.FC<ApiKeySetupProps> = ({
  onSubmit,
  isProcessing
}) => {
  const [apiKey, setApiKey] = useState('');
  
  useEffect(() => {
    // Pre-populate with the Gemini API key from environment variable
    const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    console.log('Environment API key exists:', !!envApiKey);
    if (envApiKey) {
      setApiKey(envApiKey);
      // Automatically submit the API key if provided from environment
      console.log('Auto-submitting API key from environment');
      onSubmit(envApiKey);
    } else {
      console.log('No API key found in environment variables');
    }
  }, [onSubmit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      console.log('Submitting API key from form');
      onSubmit(apiKey.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-card border rounded-lg">
      <div className="flex items-center gap-2">
        <Key className="size-5 text-primary" />
        <h3 className="text-lg font-semibold">Gemini API Setup</h3>
      </div>
      
      <p className="text-sm text-muted-foreground">
        To use the voice chat feature, you need to provide your Gemini API key.
      </p>
      
      <div className="space-y-2">
        <Input
          type="password"
          placeholder="Enter your Gemini API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full"
          required
        />
        
        <Button 
          type="submit" 
          disabled={isProcessing || !apiKey.trim()} 
          className="w-full"
        >
          {isProcessing ? "Setting up..." : "Connect to Gemini"}
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground">
        Your API key is stored locally and is only used to communicate with Google's Gemini API.
      </p>
    </form>
  );
};
