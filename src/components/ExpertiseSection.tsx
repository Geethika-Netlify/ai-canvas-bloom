import { motion } from "framer-motion";
import { Settings, Code2, Database, BrainCircuit, Users, Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
const expertise = [{
  icon: BrainCircuit,
  title: "AI",
  skills: ["Machine Learning & Deep Learning", "LLMs", "AIOps", "TensorFlow", "pytorch", "LangChain"]
}, {
  icon: Code2,
  title: "Software Development",
  skills: ["Python", "TypeScript", "Full-stack Development", "Database Management", "Progressive Web Apps"]
}, {
  icon: Database,
  title: "Other Tech",
  skills: ["Google Cloud Platform", "Enterprise Solutions", "System Integration"]
}, {
  icon: Settings,
  title: "Others Skills",
  skills: ["Branding and vision", "UI/ UX", "Product development", "Project Management", "Digital Marketing"]
}, {
  icon: Users,
  title: "Soft Skills",
  skills: [ "Exceptional Leadership","Team Management", "Strategic Planning", "Clear No Bullshit Communication"]
}, {
  icon: Video,
  title: "Creative",
  skills: ["Adobe After Effects", "Adobe Premiere Pro", "Motion Graphics", "Cinemotography & Photography", "Content Creation" ]
}];
export function ExpertiseSection() {
  return <section id="expertise" className="py-20 relative overflow-hidden bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-6">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8
      }} viewport={{
        once: true
      }} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Technical Expertise</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            <b>Above all, I can figure anything out.</b><br></br>
            If I wanted to build a rocket, I will figure it out😎
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {expertise.map((item, index) => <motion.div key={index} initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: index * 0.1
        }} viewport={{
          once: true
        }}>
              <Card className="group hover:bg-muted/50 transition-all duration-300 border-none shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        {item.skills.map((skill, skillIndex) => <span key={skillIndex} className="px-3 py-1 rounded-full bg-primary/5 text-sm font-medium text-primary/80">
                            {skill}
                          </span>)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>)}
        </div>
      </div>
    </section>;
}