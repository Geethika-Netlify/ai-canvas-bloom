import { FollowerPointerCard } from "@/components/ui/following-pointer";
import { motion } from "framer-motion";
import { FloatingScrollButton } from "./FloatingScrollButton";
const projects = [{
  title: "Mahasen AI",
  description: "Intelligent Customer Support & Order Management System for Social Media Platforms. B2B Product.",
  link: "https://mahasen47.azynctra.com",
  technologies: "TypeScript, Supabase, Vite, React",
  image: "/img-compressed/bbf48067-6ae8-49d4-ba2c-e702a68f4ad7.png",
  date: "Dec 2024"
}, {
  title: "Podisen AI",
  description: "Clone yourself from whatsapp chat history. Captures communication style & response stlye. Open Source project.",
  link: "https://github.com/geethikaisuru/podisen-whatsapp-clone",
  technologies: "Python, Vertex AI, Google Cloud platform, Docker, Whatsapp API",
  image: "https://raw.githubusercontent.com/geethikaisuru/podisen-whatsapp-clone/main/banner.png",
  date: "May 2025"
}, {
  title: "GYMA App",
  description: "A gym workout tracker app that let's users save upto 40% of their gym time by managing rest intervals between exercises.",
  link: "https://gyma.azynctra.com",
  technologies: "TypeScript, Supabase, Vite, React",
  image: "/img-compressed/e28aa767-adf0-4275-ac84-583406ea4a7c.png",
  date: "Jan 2025"
}, {
  title: "Whisper Live Locally ",
  description: "Real-time speech transcription using OpenAI Whisper(fork) in a web interface. Features GPU acceleration, multiple model options, and an intuitive Streamlit web UI",
  link: "https://github.com/geethikaisuru/whisper",
  technologies: "OpenAI Whisper, Python, Streamlit, torch",
  image: "/img-compressed/whisper.jpg",
  date: "Jun 2025"
},{
  title: "No Site Business Finder - NSBF 🕵️‍♂️",
  description: "Find businesses in any region that DON'T have a website, using the Google Places API and Gemini AI for robust detection.",
  link: "https://github.com/geethikaisuru/business-website-classifier",
  technologies: "Python, google-genai, requests, tkinter, streamlit, Google Places API, Google Gemini",
  image: "/img-compressed/nsbf.jpg",
  date: "May 2025"
},{
  title: "Intelligent Knowledge Management System Max-Lab AI",
  description: "Created a system for Advanced Enterprise Knowledge Management. System capabilities include ingestion, understanding, and information retrieval from databases of documents and URLs. Provides accurate insights using Advanced LLM methods.",
  link: "#",
  technologies: "Python, Fast API, OpenAI, Huggingface, Supabase, Pinecone, Airbyte, Nextjs",
  image: "/img-compressed/3d6e5a96-248b-4c53-a9e8-9c41405d3a29.png",
  date: "Jan 2024"
},  {
  title: "Voice & Text Research Data Collection Portal",
  description: "Built to collect Anonymous, Multi-modality data (Text or Voice) for a research. Text data will be saved to an excel sheet automatically. Voice data's pitch will be changed automatically & saved to a google drive folder. Pitch is changed to preserve the voice privacy of the students.",
  link: "https://lucid-dreams-research-usj.streamlit.app",
  technologies: "Python, Streamlit, googleapiclient, numpy, wave",
  image: "/img-compressed/59569372-634b-465a-bb9b-b9d5f724f1ac.png",
  date: "2024"
}, {
  title: "IT LEGACY Website",
  description: "Built the HTML5 website for the IT Legacy undergraduate student organization.",
  link: "http://geethikaisuru.me/itlegacy/",
  technologies: "HTML, CSS, JavaScript, Github Pages",
  image: "/img-compressed/df2d194e-4a5d-4d5a-a7ce-3bfcaee0244b.png",
  date: "2024 Jan"
}, {
  title: "Local Voice Cloning Model",
  description: "A Python script that uses a preTrained TTS Model to generate voice. Users can fine tune the voice by training on their voice. Locally.",
  link: "https://github.com/geethikaisuru/cognita-voice-cloning",
  technologies: "Python, Torch, speechbrain, pydub",
  image: "/img-compressed/ece059f0-2d68-4fdc-bae0-2fc179464e40.png",
  date: "Jul 2024"
}, {
  title: "Cognita AI",
  description: "Generates model exam papers based on past papers",
  link: "https://github.com/geethikaisuru/cognita-ai",
  technologies: "Python, TypeScript, Jupyter, ollama",
  image: "/img-compressed/0fc59d45-bf5d-4497-bbe0-85e9fdf91125.png",
  date: "Jun 2024"
}, {
  title: "LSTM Styled Poem Generator",
  description: "LSTM model trained to generate poems in a specific style",
  link: "https://colab.research.google.com/drive/1siK2orsRrgVhRkPNGk0Di-UvZBGQaizv",
  technologies: "Python, TensorFlow, Keras, Numpy",
  image: "/img-compressed/f090beb8-02c3-4ee6-b293-d1a7423eb33c.png",
  date: "2024"
}, {
  title: "Brain Tumor Detection Model (CNN)",
  description: "Identifies brain tumors using MRI scan images. Classifies into 4 classes (3 tumor stages + 1 negative). Fully hand-built algorithm.",
  link: "https://colab.research.google.com/drive/1j59xSq8r9duRLLMH6hgnrjiLBEvSM6TT",
  technologies: "Python, TensorFlow, Matplotlib, Numpy, sklearn",
  image: "/img-compressed/b74ef9fb-f9de-4e2a-ade9-c0b5bf175f69.png",
  date: "Aug 2023"
}, {
  title: "To Do list app in Streamlit",
  description: "Built this todo list app in streamlit as a learning project.",
  link: "https://geethika-todo.streamlit.app",
  technologies: "Python, Streamlit",
  image: "/img-compressed/eaecb821-692d-4546-8450-9d8d24bf03eb.png",
  date: "2024"
}, {
  title: "Dinum Lottery Scanner",
  description: "100% Vibe Coded project: NLB & DLB Lottery Scanner with the QR code. NLB Scanning is completed. DLB is not completed because of a policy issue restricting the use of scrapers.",
  link: "https://dinum-lottery-scanster.lovable.app/",
  technologies: "React, TypeScript, Supabase, Vite",
  image: "/img-compressed/4b8b8c0f-ea08-4cce-b878-f04322e6f19a.png",
  date: "Dec 2024"
}, {
  title: "VFX Agency Website",
  description: "My old venture in business before fully committing to AI. The Official Website of the SL VFX sub brand made purely for fiverr Agency Profile.",
  link: "https://studio.azynctra.com/",
  technologies: "HTML5, CSS, JavaScript, Github",
  image: "/img-compressed/3c875501-105c-4461-a228-163023c60914.png",
  date: "2020"
}, {
  title: "Domain Checker Pro 🔍",
  description: "Tool to check availability of thousands of '.com' domains simultaneously",
  link: "https://github.com/geethikaisuru/Domain-Checker",
  technologies: "Python, Streamlit, whois, threading",
  image: "/img-compressed/40be1a32-38f5-444a-9234-1ac26253db88.png",
  date: "Jan 2025"
}, {
  title: "My Portfolio Website",
  description: "A website to showcase my related work and projects. With an RAG AI assistant integrated.",
  link: "https://geethika-isuru.netlify.app/",
  technologies: "React, Supabase, Google Gemini AI, TypeScript, Vite, Tailwind CSS, Python",
  image: "/img-compressed/port-web-preview.png",
  date: "Apr 2025"
}];
export function ProjectsSection() {
  return <section id="projects" className="py-20 bg-gray-50/50 dark:bg-gray-900/50">
      <FloatingScrollButton />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.8
      }} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects 🖥️</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Here are some of my recent projects that showcase my technical expertise and problem-solving abilities.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {projects.map((project, index) => <motion.div key={project.title} initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5,
          delay: index * 0.1
        }}>
              <FollowerPointerCard title={project.title === "Intelligent Knowledge Management System Max-Lab AI" ? "Group Project" : "Solo Project"} className="h-full">
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  <div className="h-full relative overflow-hidden rounded-2xl transition duration-200 group bg-white dark:bg-gray-800 hover:shadow-xl border border-zinc-100 dark:border-zinc-800">
                    <div className="relative w-full h-48 overflow-hidden">
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-xl mb-2 text-zinc-700 dark:text-zinc-200">
                        {project.title}
                      </h3>
                      <p className="text-zinc-500 dark:text-zinc-400 mb-4 line-clamp-3">
                        {project.description}
                      </p>
                      <div className="mb-4">
                        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                          {project.technologies}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-zinc-500 dark:text-zinc-400">
                          {project.date}
                        </span>
                        <span className="relative z-10 px-6 py-2 bg-primary text-primary-foreground font-medium rounded-xl text-sm">
                          View Project
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              </FollowerPointerCard>
            </motion.div>)}
        </div>
      </div>
    </section>;
}