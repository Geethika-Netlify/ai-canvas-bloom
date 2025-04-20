
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { RefObject } from 'react';

interface ChatHeaderProps {
  glossyContainerRef: RefObject<HTMLDivElement>;
  onClose: () => void;
}

export const ChatHeader = ({ glossyContainerRef, onClose }: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-10 h-10 overflow-hidden rounded-full"
        >
          <div ref={glossyContainerRef} className="w-full h-full rounded-full overflow-hidden" />
        </motion.div>
        <div>
          <h3 className="font-montserrat font-bold text-lg">GAIA</h3>
          <p className="text-xs text-muted-foreground">Geethika's AI Assistant</p>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-muted">
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
