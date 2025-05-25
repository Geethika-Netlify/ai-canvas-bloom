import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Briefcase } from "lucide-react";
export function ProfessionalExperienceSection() {
  const container = {
    hidden: {
      opacity: 0
    },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  const item = {
    hidden: {
      opacity: 0,
      y: 20
    },
    show: {
      opacity: 1,
      y: 0
    }
  };
  return <section id="experience" className="py-24">
      <div className="container max-w-6xl mx-auto px-6">
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
      }} className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h2 className="text-4xl md:text-5xl font-bold text-portfolio-blue">Professional Experience🛠️</h2>
          </div>
          <div className="w-20 h-1 bg-portfolio-blue/30 mx-auto rounded-full" />
        </motion.div>

        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{
        once: true
      }} className="space-y-16">
          {/* AZYNCTRA Experience */}
          <motion.div variants={item} className="relative">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h3 className="text-2xl font-bold text-foreground/90">
                  Freelance AI Engineer
                </h3>
                <span className="text-lg text-foreground/70">2024-Present</span>
              </div>
              <div className="space-y-4">
                <p className="text-xl text-foreground/80 font-medium">
                  Contributed & took lead in the development of AI projects
                </p>
              </div>
            </div>
          </motion.div>

          <Separator className="bg-foreground/10" />

          {/* Fiverr Experience */}
          <motion.div variants={item} className="relative">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h3 className="text-2xl font-bold text-foreground/90">
                  Freelance Motion Graphics Artist on Fiverr
                </h3>
                <span className="text-lg text-foreground/70">2019-2023</span>
              </div>
              <ul className="list-none space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-portfolio-blue/60" />
                  <span className="text-foreground/80">
                    Completed 50+ projects with 5-star reviews
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-portfolio-blue/60" />
                  <span className="text-foreground/80">
                    Achieved Level One Seller status
                  </span>
                </li>
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>;
}
