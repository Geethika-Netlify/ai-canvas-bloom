import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
export function EducationSection() {
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
  return <section id="education" className="py-24 bg-gradient-to-b from-background to-background/50">
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
          <h2 className="text-4xl font-bold mb-4 gradient-text">Education 💪</h2>
          <div className="w-20 h-1 bg-portfolio-blue/30 mx-auto rounded-full" />
        </motion.div>

        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{
        once: true
      }} className="space-y-16">
          {/* University */}
          <motion.div variants={item} className="relative">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h3 className="text-2xl font-bold text-foreground/90">
                  University of Sri Jayewardenepura
                </h3>
                <span className="text-lg text-foreground/70">2023-2026</span>
              </div>
              <p className="text-xl text-foreground/80 font-medium">
                BSc in Physics & ICT, Faculty of Applied Sciences
              </p>
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-3 text-foreground/90">Leadership Roles</h4>
                <ul className="list-none space-y-2 text-foreground/80">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-portfolio-blue/60" />
                    Vice Chairperson of IEEE USJ Student Branch (2023-2024)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-portfolio-blue/60" />
                    Founder & University Lead of IT LEGACY
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-portfolio-blue/60" />
                    Member of oGX B2B of AIESEC USJ
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          <Separator className="bg-foreground/10" />

          {/* High School */}
          <motion.div variants={item} className="relative">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h3 className="text-2xl font-bold text-foreground/90">
                  Taxila Central College
                </h3>
                <span className="text-lg text-foreground/70">2012-2020</span>
              </div>
              <p className="text-xl text-foreground/80 font-medium">
                GCE A/L Examination: B.C.C. with a 1.039z in Physics, Combined Mathematics, and ICT
              </p>
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-3 text-foreground/90">
                  Leadership & Extracurricular Activities
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                  <motion.ul className="list-none space-y-2 text-foreground/80">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-portfolio-blue/60" />
                      Senior Prefect at Taxila Prefects Board
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-portfolio-blue/60" />
                      Vice President and Sounds/Lighting/IT person at Radio and Technical Society
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-portfolio-blue/60" />
                      President and Photographer at Taxila Photographic Arts Society
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-portfolio-blue/60" />
                      Executive at Astronomical Society
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-portfolio-blue/60" />
                      Board Member of Senior Science Society
                    </li>
                  </motion.ul>
                  <motion.ul className="list-none space-y-2 text-foreground/80">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-portfolio-blue/60" />
                      Executive at Media Club
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-portfolio-blue/60" />
                      Member of Innovations Society
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-portfolio-blue/60" />
                      Founding President of E-Club
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-portfolio-blue/60" />
                      President of Leo Club of Taxila Central College
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-portfolio-blue/60" />
                      Camera Director of the First Short Movie of Taxila Central College
                    </li>
                  </motion.ul>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>;
}