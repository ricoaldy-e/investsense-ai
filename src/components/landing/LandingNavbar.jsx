import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingNavbar = () => {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['features', 'workflow', 'about'];
      let current = '';

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Trigger when the section is near the top third of the viewport
          if (rect.top <= 200 && rect.bottom >= 200) {
            current = section;
          }
        }
      }
      
      // If at the very top, clear active section
      if (window.scrollY < 100) current = '';
      
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed w-full z-50 bg-bg-dark/80 backdrop-blur-md border-b border-card-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-xl font-bold text-white tracking-wide group flex items-center transition-transform hover:scale-[1.02]"
            >
              InvestSense <span className="text-brand-blue ml-1 group-hover:text-cyan-400 transition-colors">AI</span>
            </button>
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className={`relative text-sm font-medium transition-colors pb-1 ${activeSection === 'features' ? 'text-white' : 'text-text-muted hover:text-white'}`}>
                Features
                <span className={`absolute left-0 bottom-0 w-full h-[2px] bg-white transition-transform duration-300 origin-left ${activeSection === 'features' ? 'scale-x-100' : 'scale-x-0'}`}></span>
              </a>
              <a href="#workflow" className={`relative text-sm font-medium transition-colors pb-1 ${activeSection === 'workflow' ? 'text-white' : 'text-text-muted hover:text-white'}`}>
                How It Works
                <span className={`absolute left-0 bottom-0 w-full h-[2px] bg-white transition-transform duration-300 origin-left ${activeSection === 'workflow' ? 'scale-x-100' : 'scale-x-0'}`}></span>
              </a>
              <a href="#about" className={`relative text-sm font-medium transition-colors pb-1 ${activeSection === 'about' ? 'text-white' : 'text-text-muted hover:text-white'}`}>
                About
                <span className={`absolute left-0 bottom-0 w-full h-[2px] bg-white transition-transform duration-300 origin-left ${activeSection === 'about' ? 'scale-x-100' : 'scale-x-0'}`}></span>
              </a>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link 
              to="/login" 
              className="px-3 py-2 text-sm font-medium text-text-main hover:text-cyan-400 transition-colors hidden sm:block"
            >
              Log in
            </Link>
            <Link 
              to="/dashboard" 
              className="px-5 py-2 text-sm font-medium bg-brand-blue text-white rounded-md hover:bg-cyan-700 transition-colors shadow-sm"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;
