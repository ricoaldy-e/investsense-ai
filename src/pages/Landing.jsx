import LandingNavbar from '../components/landing/LandingNavbar';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import WorkflowSection from '../components/landing/WorkflowSection';
import AntiFomoSection from '../components/landing/AntiFomoSection';
import DashboardPreviewSection from '../components/landing/DashboardPreviewSection';
import FinalCTASection from '../components/landing/FinalCTASection';
import Footer from '../components/landing/Footer';

const Landing = () => {
  return (
    <div className="min-h-screen bg-bg-dark text-text-main">
      <LandingNavbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <WorkflowSection />
        <AntiFomoSection />
        <DashboardPreviewSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
