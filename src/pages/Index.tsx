
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ExpertiseSection } from "@/components/ExpertiseSection";
import { CertificatesSection } from "@/components/CertificatesSection";
import { EducationSection } from "@/components/EducationSection";
import { ContactSection } from "@/components/ContactSection";
import { ProfessionalExperienceSection } from "@/components/ProfessionalExperienceSection";
import { ParticleBackground } from "@/components/ParticleBackground";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <ParticleBackground />
      <Navbar />
      <main>
        <HeroSection />
        <ProjectsSection />
        <CertificatesSection />
        <ExpertiseSection />
        <EducationSection />
        <ProfessionalExperienceSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
