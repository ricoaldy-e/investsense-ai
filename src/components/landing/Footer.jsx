import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';

const Footer = () => {
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, margin: '-40px' });
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

  const navLinks = [
    { id: 'features', label: 'FEATURES' },
    { id: 'workflow', label: 'HOW IT WORKS' },
    { id: 'about', label: 'ABOUT' },
  ];

  return (
    <motion.footer
      ref={footerRef}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className="border-t border-card-border py-16 lg:py-20"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Brand */}
          <div className="max-w-sm">
            <Link 
              to="/" 
              className="font-mono text-[13px] text-text-main tracking-[3px] uppercase block mb-5"
            >
              INVESTSENSE AI
            </Link>
            <p className="font-body text-[14px] text-text-secondary leading-relaxed">
              AI-powered stock decision support platform designed to help beginner investors make rational investment decisions.
            </p>
          </div>

          {/* Navigation */}
          <div className="md:text-right">
            <p className="font-mono text-[10px] tracking-[2px] uppercase text-text-muted mb-5">
              NAVIGATION
            </p>
            <ul className="space-y-3">
              {navLinks.map(({ id, label }) => (
                <li key={id}>
                  <a 
                    href={`#${id}`} 
                    className={`font-mono text-[12px] tracking-[1.5px] uppercase transition-colors duration-300 ${
                      activeSection === id 
                        ? 'text-text-main' 
                        : 'text-text-secondary hover:text-text-main'
                    }`}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-card-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-[10px] tracking-[1.5px] text-text-muted uppercase">
            © {new Date().getFullYear()} InvestSense AI. All rights reserved.
          </p>
          <p className="font-body text-[12px] text-text-muted italic">
            For educational purposes only. Not financial advice.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
