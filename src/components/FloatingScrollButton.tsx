
import { ScrollIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const FloatingScrollButton = () => {
  const handleScroll = () => {
    const windowHeight = window.innerHeight;
    const scrollDistance = windowHeight * 0.75;
    window.scrollBy({
      top: scrollDistance,
      behavior: "smooth"
    });
  };

  return (
    <Button
      onClick={handleScroll}
      className="fixed bottom-8 right-8 rounded-full p-4 shadow-lg bg-primary hover:bg-primary/90 z-50"
      size="icon"
    >
      <ScrollIcon className="h-6 w-6" />
      <span className="sr-only">Scroll down</span>
    </Button>
  );
};
