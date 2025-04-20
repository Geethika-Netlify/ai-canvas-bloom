
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { AnimatePresence, motion } from 'framer-motion';
import { Send, Paperclip, Mic, AlertCircle, Key } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "@/components/ui/chat-bubble";
import { ChatInput } from "@/components/ui/chat-input";
import { ExpandableChat, ExpandableChatHeader, ExpandableChatBody, ExpandableChatFooter } from "@/components/ui/expandable-chat";
import { ChatMessageList } from "@/components/ui/chat-message-list";
import { useGeminiChat } from '@/hooks/useGeminiChat';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const GlossyChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [input, setInput] = useState("");
  const { messages, isLoading, error, sendMessage } = useGeminiChat();
  const containerRef = useRef<HTMLDivElement>(null);
  const glossyContainerRef = useRef<HTMLDivElement>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  const isApiKeyMissing = error?.includes('API key is missing');

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatBodyRef.current && messages.length > 0) {
      const scrollArea = chatBodyRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!glossyContainerRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();

    // Setup camera
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 1.2;

    // Setup renderer with alpha and antialias
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true
    });

    // Set size based on whether the chat is open or not
    const size = isOpen ? 50 : 120;
    renderer.setSize(size, size);
    renderer.setPixelRatio(window.devicePixelRatio);
    glossyContainerRef.current.appendChild(renderer.domElement);

    // Create circle geometry
    const geometry = new THREE.CircleGeometry(1, 64);

    // Create shader material with glossy gradient and enhanced inner glow
    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: {
          value: 0
        },
        iResolution: {
          value: new THREE.Vector2(size, size)
        }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float iTime;
        uniform vec2 iResolution;
        varying vec2 vUv;
        
        void main() {
          vec2 fragCoord = vUv * iResolution;
          float mr = min(iResolution.x, iResolution.y);
          vec2 uv = (fragCoord * 2.0 - iResolution) / mr;
          
          float d = -iTime * 0.5;
          float a = 0.0;
          for (float i = 0.0; i < 8.0; ++i) {
            a += cos(i - d - a * uv.x);
            d += sin(uv.y * i + a);
          }
          d += iTime * 0.5;
          vec3 col = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
          col = cos(col * cos(vec3(d, a, 2.5)) * 0.5 + 0.5);
          
          // Add inner glow with 50% more intensity
          float dist = length(uv);
          float glow = smoothstep(0.75, 1.0, dist); // Adjusted range for stronger effect
          vec3 glowColor = vec3(0.5, 0.8, 1.0);
          col = mix(col, col + glowColor, glow * 0.75); // Increased from 0.5 to 0.75 (50% more)
          
          gl_FragColor = vec4(col, 1.0);
        }
      `,
      transparent: true
    });

    // Create mesh from geometry and material
    const circle = new THREE.Mesh(geometry, material);
    scene.add(circle);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      material.uniforms.iTime.value += 0.01;
      circle.position.y = Math.sin(Date.now() * 0.001) * 0.05;
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      const {
        current
      } = glossyContainerRef;
      if (!current) return;
      const newSize = isOpen ? 50 : 120;
      renderer.setSize(newSize, newSize);
      material.uniforms.iResolution.value = new THREE.Vector2(newSize, newSize);
    };
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      if (glossyContainerRef.current && glossyContainerRef.current.contains(renderer.domElement)) {
        glossyContainerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
    };
  }, [isOpen]); // Added isOpen as a dependency to recreate the circle when the chat state changes

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    await sendMessage(input);
    setInput("");
  };

  return (
    <div className="fixed bottom-8 right-8 z-[9999]">
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ExpandableChat size="lg" position="bottom-right" className="glossy-chat-window">
            <ExpandableChatHeader className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-10 h-10 overflow-hidden rounded-full"
                >
                  <div
                    ref={glossyContainerRef}
                    className="w-full h-full rounded-full overflow-hidden"
                  />
                </motion.div>
                <div>
                  <h3 className="font-montserrat font-bold text-lg">GAIA</h3>
                  <p className="text-xs text-muted-foreground">Geethika's AI Assistant</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleChat}
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
            </ExpandableChatHeader>
            
            <ExpandableChatBody className="backdrop-blur-sm bg-background/80">
              <div ref={chatBodyRef} className="h-full overflow-y-auto">
                {isApiKeyMissing ? (
                  <Alert variant="destructive" className="m-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>API Key Missing</AlertTitle>
                    <AlertDescription className="space-y-4">
                      <p>Please add your Gemini API key to use GAIA:</p>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Go to <a href="https://ai.google.dev/" className="underline" target="_blank" rel="noopener noreferrer">Google AI Studio</a></li>
                        <li>Create or sign in to your account</li>
                        <li>Get an API key from the API Keys section</li>
                        <li>Add it as <code className="bg-muted-foreground/20 p-1 rounded">VITE_GEMINI_API_KEY</code> in your project environment variables</li>
                      </ol>
                      <p className="text-sm italic">After adding the API key, refresh the page to use GAIA.</p>
                    </AlertDescription>
                  </Alert>
                ) : error ? (
                  <Alert variant="destructive" className="mb-4 mx-4 mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : null}
                
                <ChatMessageList>
                  {messages.map(message => (
                    <ChatBubble
                      key={message.id}
                      variant={message.sender === "user" ? "sent" : "received"}
                    >
                      <ChatBubbleAvatar
                        fallback={message.sender === "user" ? "You" : "AI"}
                      />
                      <ChatBubbleMessage
                        variant={message.sender === "user" ? "sent" : "received"}
                      >
                        {message.content}
                      </ChatBubbleMessage>
                    </ChatBubble>
                  ))}

                  {isLoading && (
                    <ChatBubble variant="received">
                      <ChatBubbleAvatar fallback="AI" />
                      <ChatBubbleMessage isLoading />
                    </ChatBubble>
                  )}
                </ChatMessageList>
              </div>
            </ExpandableChatBody>

            <ExpandableChatFooter>
              <form
                onSubmit={handleSubmit}
                className="relative rounded-lg border bg-background/80 backdrop-blur-sm focus-within:ring-1 focus-within:ring-ring p-1"
              >
                <ChatInput
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
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
            </ExpandableChatFooter>
          </ExpandableChat>
        </motion.div>
      ) : (
        <motion.div className="cursor-pointer" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={toggleChat}>
          <div className="flex flex-col items-center">
            <motion.div className={`rounded-full overflow-hidden transition-transform duration-300 ease-out ${isHovered ? 'transform -translate-y-2' : ''}`} style={{
          filter: 'drop-shadow(0 0 20px rgba(100, 200, 255, 0.3))',
          willChange: 'transform'
        }} ref={glossyContainerRef} />
            <div className={`mt-2 font-montserrat font-bold text-xl bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent transition-all duration-300 ease-out ${isHovered ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'}`}>
              <strong>Talk to GAIA</strong>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
