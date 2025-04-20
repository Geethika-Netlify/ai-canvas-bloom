
import { useState } from 'react';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
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
