
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ExpertiseSection } from "@/components/ExpertiseSection";
import { CertificatesSection } from "@/components/CertificatesSection";
import { EducationSection } from "@/components/EducationSection";
import { ProfessionalExperienceSection } from "@/components/ProfessionalExperienceSection";
import { ParticleBackground } from "@/components/ParticleBackground";

const Index = () => {
  return (
    <div className="min-h-screen">
      <ParticleBackground />
      <Navbar />
      <main>
        <HeroSection />
        <ProjectsSection />
        <ExpertiseSection />
        <ProfessionalExperienceSection />
        <CertificatesSection />
        <EducationSection />
      </main>
    </div>
  );
};

export default Index;
