
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceControlsProps {
  isRecording: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onToggleTextInput: () => void;
  className?: string;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  isRecording,
  isProcessing,
  isSpeaking,
  onStartRecording,
  onStopRecording,
  onToggleTextInput,
  className = '',
}) => {
  const [animationSize, setAnimationSize] = useState(0);

  useEffect(() => {
    if (isSpeaking) {
      const intervalId = setInterval(() => {
        setAnimationSize(Math.random() * 20 + 5);
      }, 100);
      
      return () => clearInterval(intervalId);
    } else {
      setAnimationSize(0);
    }
  }, [isSpeaking]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <AnimatePresence>
        {isRecording && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="relative flex justify-center items-center"
          >
            <motion.div 
              animate={{ 
                scale: isSpeaking ? [1, 1.2, 1] : 1,
                opacity: isSpeaking ? [0.7, 0.5, 0.7] : 0.7
              }}
              transition={{ 
                repeat: isSpeaking ? Infinity : 0,
                duration: 1.5 
              }}
              className="absolute rounded-full bg-primary"
              style={{ 
                width: `${animationSize + 30}px`, 
                height: `${animationSize + 30}px` 
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <Button 
        variant={isRecording ? "destructive" : "default"}
        size="sm"
        className="rounded-full shadow-md"
        disabled={isProcessing}
        onClick={isRecording ? onStopRecording : onStartRecording}
      >
        {isRecording ? <MicOff className="size-4" /> : <Mic className="size-4" />}
        <span className="ml-1">{isRecording ? "Stop" : "Start"} Voice</span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="rounded-full"
        onClick={onToggleTextInput}
      >
        <MessageCircle className="size-4" />
        <span className="ml-1">Text</span>
      </Button>
    </div>
  );
};
