
import { FollowerPointerCard } from "@/components/ui/following-pointer";
import { motion } from "framer-motion";

const projects = [
  {
    title: "Mahasen AI",
    description: "Intelligent Customer Support & Order Management System for Social Media Platforms. B2B Product. Fully Integrated into whatsapp. Facebook, instagram on the way.",
    link: "https://mahasen47.azynctra.com",
    technologies: "TypeScript, Supabase, Vite, React"
  },
  {
    title: "GYMA App",
    description: "A gym workout tracker app that let's users save upto 40% of their gym time by managing rest intervals between exercises.",
    link: "https://gyma.azynctra.com",
    technologies: "TypeScript, Supabase, Vite, React"
  },
  {
    title: "Max-Lab AI",
    description: "Created a system for Advanced Enterprise Knowledge Management with capabilities including ingestion, understanding, and information retrieval.",
    link: "#",
    technologies: "Python, Fast API, OpenAI, Huggingface, Supabase, Pinecone, Airbyte, Nextjs"
  },
  {
    title: "Domain Checker Pro",
    description: "Tool to check availability of thousands of .com domains simultaneously",
    link: "https://github.com/geethikaisuru/Domain-Checker",
    technologies: "Python, Streamlit, whois, threading"
  }
];

export function ProjectsSection() {
  return (
    <section id="projects" className="py-20 bg-gray-50/50 dark:bg-gray-900/50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Here are some of my recent projects that showcase my technical expertise and problem-solving abilities.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <FollowerPointerCard
                title={project.technologies}
                className="h-full"
              >
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  <div className="h-full relative overflow-hidden rounded-2xl transition duration-200 group bg-white dark:bg-gray-800 hover:shadow-xl border border-zinc-100 dark:border-zinc-800">
                    <div className="p-6">
                      <h3 className="font-bold text-xl mb-2 text-zinc-700 dark:text-zinc-200">
                        {project.title}
                      </h3>
                      <p className="text-zinc-500 dark:text-zinc-400 mb-4">
                        {project.description}
                      </p>
                      <div className="flex justify-end">
                        <span className="relative z-10 px-6 py-2 bg-primary text-primary-foreground font-medium rounded-xl text-sm">
                          View Project
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              </FollowerPointerCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
