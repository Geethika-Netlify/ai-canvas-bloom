
import { ArrowDown } from "lucide-react";
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
      className="fixed left-1/2 bottom-10 transform -translate-x-1/2 rounded-full p-4 bg-transparent hover:bg-transparent border border-portfolio-blue/30 text-portfolio-blue z-[9999]"
      size="icon"
    >
      <ArrowDown className="h-6 w-6" />
      <span className="sr-only">Scroll Down</span>
    </Button>
  );
};
