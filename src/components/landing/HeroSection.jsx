import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import TopographicWave from './TopographicWave';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* 3D Topographic Wave — background layer */}
      <div className="absolute inset-0 z-0">
        <TopographicWave />
      </div>

      {/* Minimal ambient overlay */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-accent/[0.02] blur-[150px] rounded-full pointer-events-none z-[1]"></div>

      {/* Content — staggered entrance on page load */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10 text-center pt-42 pb-32">

        {/* Main headline — Outfit Light */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-display text-[40px] md:text-[56px] lg:text-[64px] font-light text-text-main leading-[1.1] tracking-[2px] uppercase mb-8"
        >
          Invest Smarter,<br />
          Stop the FOMO.
        </motion.h1>

        {/* Body — Source Serif 4 */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-body text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto mb-12"
        >
          A clinical AI analysis platform built to help beginner investors navigate market noise and make rational, data-driven decisions.
        </motion.p>

        {/* CTA — outlined pill button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Link 
            to="/register"
            className="inline-block font-mono text-[12px] tracking-[2.5px] uppercase text-accent border border-accent/40 rounded-full px-10 py-4 hover:bg-accent hover:text-bg-dark transition-all duration-300"
          >
            START ANALYZING
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
