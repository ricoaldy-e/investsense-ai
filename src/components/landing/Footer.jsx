import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['features', 'workflow', 'about'];
      let current = '';

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            current = section;
          }
        }
      }
      
      if (window.scrollY < 100) current = '';
      
      // Also highlight 'about' if we are at the very bottom of the page
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
        current = 'about';
      }
      
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <footer className="bg-bg-dark border-t border-card-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-between items-start mb-12">
          {/* Brand */}
          <div className="max-w-xs">
            <Link to="/" className="text-xl font-bold text-white tracking-wide block mb-4">
              InvestSense <span className="text-brand-blue">AI</span>
            </Link>
            <p className="text-sm text-text-muted">
              AI-powered stock decision support platform designed to help beginner investors make rational investment decisions.
            </p>
          </div>

          {/* Navigation */}
          <div className="md:text-right">
            <h4 className="text-white font-bold mb-4">Navigation</h4>
            <ul className="space-y-3">
              <li>
                <a href="#features" className={`relative inline-block text-sm transition-colors pb-0.5 ${activeSection === 'features' ? 'text-white font-medium' : 'text-text-muted hover:text-white'}`}>
                  Features
                  <span className={`absolute left-0 bottom-0 w-full h-[1px] bg-white transition-transform duration-300 origin-left ${activeSection === 'features' ? 'scale-x-100' : 'scale-x-0'}`}></span>
                </a>
              </li>
              <li>
                <a href="#workflow" className={`relative inline-block text-sm transition-colors pb-0.5 ${activeSection === 'workflow' ? 'text-white font-medium' : 'text-text-muted hover:text-white'}`}>
                  How It Works
                  <span className={`absolute left-0 bottom-0 w-full h-[1px] bg-white transition-transform duration-300 origin-left ${activeSection === 'workflow' ? 'scale-x-100' : 'scale-x-0'}`}></span>
                </a>
              </li>
              <li>
                <a href="#about" className={`relative inline-block text-sm transition-colors pb-0.5 ${activeSection === 'about' ? 'text-white font-medium' : 'text-text-muted hover:text-white'}`}>
                  About
                  <span className={`absolute left-0 bottom-0 w-full h-[1px] bg-white transition-transform duration-300 origin-left ${activeSection === 'about' ? 'scale-x-100' : 'scale-x-0'}`}></span>
                </a>
              </li>
              <li className="pt-2"><Link to="/dashboard" className="text-sm text-text-muted hover:text-white transition-colors">Login</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-card-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} InvestSense AI. All rights reserved.
          </p>
          <p className="text-xs text-text-muted">
            For educational purposes only. Not financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
