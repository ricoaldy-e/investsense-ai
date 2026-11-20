import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useMediaQuery from '../../hooks/useMediaQuery';

// Three.js is heavy: keep it out of the main bundle.
const TopographicWave = lazy(() => import('./TopographicWave'));

const HeroSection = () => {
  // The WebGL wave is decorative (8% opacity): skip it on phones and for reduced-motion users.
  const showWave = useMediaQuery('(min-width: 768px) and (prefers-reduced-motion: no-preference)');

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">

      <div className="absolute inset-0 z-0">
        {showWave && (
          <Suspense fallback={null}>
            <TopographicWave />
          </Suspense>
        )}
      </div>


      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] max-w-full h-[400px] bg-[radial-gradient(closest-side,rgba(168,181,200,0.02),transparent)] pointer-events-none z-[1]"></div>

      
      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10 text-center pt-42 pb-32">

        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-display text-[32px] md:text-[44px] lg:text-[52px] font-light text-text-main leading-[1.2] tracking-[1px] mb-8"
        >
          EMPOWERING RATIONALITY<br />
          IN MARKET TURBULENCE
        </motion.h1>

        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-body text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto mb-12"
        >
          An advanced cognitive overlay and risk engine engineered to strip speculative noise, neutralize behavioral biases, and deliver objective, multi-dimensional market intelligence.
        </motion.p>

        
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
