import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Code, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextRotate } from "@/components/ui/text-rotate";
export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const handleMouseMove = (e: MouseEvent) => {
      const {
        clientX,
        clientY
      } = e;
      const containerWidth = window.innerWidth;
      const containerHeight = window.innerHeight;
      const moveX = (clientX - containerWidth / 2) / containerWidth;
      const moveY = (clientY - containerHeight / 2) / containerHeight;
      const elements = containerRef.current?.querySelectorAll('.parallax-item');
      elements?.forEach(el => {
        const htmlEl = el as HTMLElement;
        const speedX = Number(htmlEl.getAttribute('data-speed-x')) || 0;
        const speedY = Number(htmlEl.getAttribute('data-speed-y')) || 0;
        const translateX = moveX * speedX;
        const translateY = moveY * speedY;
        htmlEl.style.transform = `translate(${translateX}px, ${translateY}px)`;
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  return <section id="home" className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center pt-16" ref={containerRef}>
      {/* Decorative elements */}
      <div className="absolute right-[5%] top-[25%] w-32 h-32 parallax-item" data-speed-x="-15" data-speed-y="10">
        
      </div>
      <div className="absolute left-[10%] bottom-[20%] w-20 h-20 parallax-item" data-speed-x="25" data-speed-y="-15">
        <div className="w-full h-full rounded-full bg-portfolio-blue/15 dark:bg-portfolio-blue/25 backdrop-blur-sm animate-pulse-slow"></div>
      </div>
      <div className="absolute left-[15%] top-[30%] parallax-item" data-speed-x="10" data-speed-y="20">
        <Code className="text-portfolio-blue/40 w-12 h-12 animate-float" />
      </div>
      <div className="absolute right-[15%] bottom-[25%] parallax-item" data-speed-x="-20" data-speed-y="-15">
        <Star className="text-portfolio-blue/40 w-10 h-10 animate-float" style={{
        animationDelay: '1s'
      }} />
      </div>
      
      <div className="container py-12 flex flex-col lg:flex-row items-center justify-between gap-12 mt-10 mx-[11px] px-[34px]">
        <motion.div className="lg:w-1/2 text-center lg:text-left z-10" initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8
      }}>
          <motion.h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.2
        }}>
            Hey, I'm{" "}
            <TextRotate texts={["Geethika Isuru", "an AI Engineer", "a Developer", "a Leader", "a Problem Solver"]} mainClassName="gradient-text" staggerFrom="first" initial={{
            y: "100%"
          }} animate={{
            y: 0
          }} exit={{
            y: "-120%"
          }} staggerDuration={0.025} splitLevelClassName="overflow-hidden" transition={{
            type: "spring",
            damping: 30,
            stiffness: 400
          }} rotationInterval={3000} />
          </motion.h1>
          
          <motion.div className="text-lg text-foreground/70 max-w-lg mx-auto lg:mx-0 space-y-4" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.6
        }}>
            <p>
              I'm a simple and a driven human being with a mission to leave this world 
              a little better than I found it.
            </p>
            <p>
              You can ask GAIA to learn more about me.
            </p>
          </motion.div>
          
          <motion.div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.8
        }}>
            <Button size="lg" className="rounded-full">View My Work</Button>
            <Button size="lg" variant="outline" className="rounded-full">Contact Me</Button>
          </motion.div>
        </motion.div>
        
        <motion.div className="lg:w-1/2 relative" initial={{
        opacity: 0,
        scale: 0.9
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        duration: 0.8,
        delay: 0.4
      }}>
          <div className="relative w-full max-w-md mx-auto">
            <div className="absolute inset-0 -z-10 bg-gradient-radial from-portfolio-blue/20 to-transparent rounded-full transform scale-150"></div>
            
            <div className="absolute -left-12 top-10 glass-card p-3 text-xs font-mono parallax-item animate-float" data-speed-x="8" data-speed-y="-5">
              <pre className="text-portfolio-blue dark:text-portfolio-blue">
                def ai_solve(problem):
                  return solution
              </pre>
            </div>
            
            <div className="absolute -right-8 bottom-16 glass-card p-3 text-xs font-mono parallax-item animate-float" style={{
            animationDelay: '1.5s'
          }} data-speed-x="-8" data-speed-y="5">
              <pre className="text-portfolio-blue dark:text-portfolio-blue">
                model.train(x_data, y_data)
              </pre>
            </div>
            
            <div className="relative aspect-square overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-portfolio-blue/10 to-transparent mix-blend-overlay"></div>
              
              <img alt="Geethika Isuru" data-speed-x="5" data-speed-y="-3" src="/lovable-uploads/73dc8931-7f0c-4216-a3bb-3c6eba7ad90f.png" className="w-full h-full object-cover object-center transform" />
            </div>
          </div>
        </motion.div>
      </div>
      
      
    </section>;
}