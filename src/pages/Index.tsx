
import { Button } from "@/components/ui/button";
import { KnowledgeBaseChat } from "@/components/KnowledgeBaseChat";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-2xl font-bold">AI Knowledge Assistant</h1>
          <Button variant="outline" asChild>
            <Link to="/uptsupkb">Admin</Link>
          </Button>
        </div>
      </header>
      
      <main className="flex-1 container py-6">
        <div className="h-[70vh]">
          <KnowledgeBaseChat />
        </div>
      </main>
      
      <footer className="border-t py-4">
        <div className="container text-center text-sm text-muted-foreground">
          Powered by Gemini and Supabase Vector Database
        </div>
      </footer>
    </div>
  );
}
