
import { motion } from "framer-motion";
import { Brain, Code, Database, ChartLine } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const skills = [
  {
    icon: Brain,
    title: "Artificial Intelligence",
    description: "Specializing in AI solutions and implementations"
  },
  {
    icon: Code,
    title: "Machine Learning",
    description: "Deep expertise in ML models and algorithms"
  },
  {
    icon: Database,
    title: "Deep Learning",
    description: "Neural networks and advanced deep learning architectures"
  },
  {
    icon: ChartLine,
    title: "Data Analytics",
    description: "Transforming data into actionable insights"
  }
];

export function CoreCompetenciesSection() {
  return (
    <section id="skills" className="min-h-screen py-20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-radial from-portfolio-blue/5 to-transparent"></div>
      
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Core Competencies
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Leveraging cutting-edge technologies to solve complex problems
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="group hover:border-portfolio-blue/50 transition-colors duration-300">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <skill.icon 
                      className="w-12 h-12 text-portfolio-blue group-hover:scale-110 transition-transform duration-300" 
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{skill.title}</h3>
                  <p className="text-muted-foreground">{skill.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
