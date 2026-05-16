import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);

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
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'features', label: 'FEATURES' },
    { id: 'workflow', label: 'HOW IT WORKS' },
    { id: 'about', label: 'ABOUT' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-bg-dark/90 backdrop-blur-md border-b border-hairline' 
        : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex items-center h-[72px]">
          {/* Wordmark — fixed width left */}
          <div className="flex-shrink-0 w-[200px]">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="font-mono text-[13px] text-text-main tracking-[3px] uppercase hover:text-accent transition-colors duration-300"
            >
              INVESTSENSE AI
            </button>
          </div>

          {/* Center Nav Links — absolute center */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-8">
            {navLinks.map(({ id, label }) => (
              <a 
                key={id}
                href={`#${id}`} 
                className={`font-mono text-[11px] tracking-[2px] uppercase transition-colors duration-300 ${
                  activeSection === id 
                    ? 'text-text-main' 
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Right Actions — fixed width right */}
          <div className="flex items-center justify-end gap-6 flex-shrink-0 w-[200px] ml-auto md:ml-0">
            <Link 
              to="/login" 
              className="hidden sm:block font-mono text-[11px] tracking-[2px] uppercase text-text-secondary hover:text-text-main transition-colors duration-300"
            >
              LOG IN
            </Link>
            <Link 
              to="/register" 
              className="font-mono text-[11px] tracking-[2px] uppercase text-accent border border-accent/40 rounded-full px-6 py-2.5 hover:bg-accent hover:text-bg-dark transition-all duration-300"
            >
              REGISTER
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;
