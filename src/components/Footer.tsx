import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Github, Smartphone, MapPin } from 'lucide-react';
import { SparklesText } from '@/components/ui/sparkles-text';
import { Separator } from "@/components/ui/separator";
export const Footer = () => {
  const socials = [{
    icon: <Linkedin className="h-5 w-5" />,
    href: "https://linkedin.com/in/geethikaisuru",
    label: "LinkedIn"
  }, {
    icon: <Github className="h-5 w-5" />,
    href: "https://github.com/geethikaisuru",
    label: "GitHub"
  }, {
    icon: <Smartphone className="h-5 w-5" />,
    href: "http://wa.me/94771442131",
    label: "WhatsApp"
  }];
  return <footer className="w-full bg-background py-12 mt-20">
      <Separator className="mb-12 bg-portfolio-blue/20" />
      <div className="container px-4 mx-auto">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6
      }} className="flex flex-col items-center justify-center space-y-8">
          <SparklesText text="Stay Magical & Never Give Up" className="text-2xl md:text-3xl font-montserrat font-medium italic text-center" colors={{
          first: "#FFD700",
          // Gold
          second: "#4CAF50" // Green
        }} sparklesCount={15} />
          
          <div className="flex items-center space-x-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>Western Province, Sri Lanka.</span>
          </div>

          <div className="flex items-center justify-center space-x-6">
            {socials.map(social => <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-portfolio-blue transition-colors duration-200" aria-label={social.label}>
                {social.icon}
              </a>)}
          </div>
          
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Geethika Isuru. All rights reserved.
          </div>
        </motion.div>
      </div>
    </footer>;
};