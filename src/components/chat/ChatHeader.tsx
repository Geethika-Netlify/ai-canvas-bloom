
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ThreeJSAnimation } from "./ThreeJSAnimation";

interface ChatHeaderProps {
  isOpen: boolean;
  onToggleChat: () => void;
}

export const ChatHeader = ({ isOpen, onToggleChat }: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-10 h-10 overflow-hidden rounded-full"
        >
          <ThreeJSAnimation isOpen={isOpen} />
        </motion.div>
        <div>
          <h3 className="font-montserrat font-bold text-lg">GAIA</h3>
          <p className="text-xs text-muted-foreground">Geethika's AI Assistant</p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleChat}
        className="rounded-full hover:bg-muted"
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 180 }}
          exit={{ rotate: 0 }}
          transition={{ duration: 0.3 }}
        >
          ×
        </motion.div>
      </Button>
    </div>
  );
};
