
import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/ui/chat-input";
import { Paperclip, Mic, Send, Key } from "lucide-react";

interface ChatInputSectionProps {
  input: string;
  isLoading: boolean;
  isApiKeyMissing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ChatInputSection = ({
  input,
  isLoading,
  isApiKeyMissing,
  onInputChange,
  onSubmit
}: ChatInputSectionProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className="relative rounded-lg border bg-background/80 backdrop-blur-sm focus-within:ring-1 focus-within:ring-ring p-1"
    >
      <ChatInput
        value={input}
        onChange={onInputChange}
        placeholder={isApiKeyMissing ? "Please add API key to continue..." : "Ask GAIA anything..."}
        disabled={isLoading || isApiKeyMissing}
        className="min-h-12 resize-none rounded-lg bg-background/0 border-0 p-3 shadow-none focus-visible:ring-0 font-montserrat"
      />
      <div className="flex items-center p-3 pt-0 justify-between">
        <div className="flex">
          <Button variant="ghost" size="icon" type="button" disabled={isLoading || isApiKeyMissing}>
            <Paperclip className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" type="button" disabled={isLoading || isApiKeyMissing}>
            <Mic className="size-4" />
          </Button>
        </div>
        {isApiKeyMissing ? (
          <Button type="button" size="sm" variant="outline" className="ml-auto gap-1.5" disabled={isLoading}>
            <Key className="size-3.5" />
            Add API Key
          </Button>
        ) : (
          <Button type="submit" size="sm" className="ml-auto gap-1.5" disabled={isLoading || !input.trim()}>
            {isLoading ? 'Sending...' : 'Send'}
            <Send className="size-3.5" />
          </Button>
        )}
      </div>
    </form>
  );
};
