
import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);
    
    // Initialize particles
    const particleCount = Math.min(50, Math.floor(window.innerWidth / 25));
    const particles: Particle[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.1
      });
    }
    
    // Create connections between particles that are close to each other
    function drawConnections(particles: Particle[]) {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            
            const color = theme === "dark" 
              ? `rgba(33, 150, 243, ${(1 - distance / 150) * 0.2})`
              : `rgba(25, 118, 210, ${(1 - distance / 150) * 0.15})`;
              
            ctx.strokeStyle = color;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }
    
    // Animation loop
    let animationFrameId: number;
    
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      for (const particle of particles) {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1;
        }
        
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1;
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        
        const particleColor = theme === "dark" 
          ? `rgba(33, 150, 243, ${particle.opacity})`
          : `rgba(25, 118, 210, ${particle.opacity})`;
          
        ctx.fillStyle = particleColor;
        ctx.fill();
      }
      
      // Draw connections
      drawConnections(particles);
      
      animationFrameId = requestAnimationFrame(animate);
    }
    
    animate();
    
    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 opacity-70 pointer-events-none"
    />
  );
}
