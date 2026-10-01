import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ServicesSection from "@/components/ServicesSection";
import ProjectsSection from "@/components/ProjectsSection";
import FreelanceSection from "@/components/FreelanceSection";
import TrackSection from "@/components/TrackSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import FloatingUI from "@/components/FloatingUI";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-white">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ServicesSection />
        <ProjectsSection />
        <FreelanceSection />
        <TrackSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
      <FloatingUI />
    </div>
  );
}
