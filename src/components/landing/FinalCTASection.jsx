import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const FinalCTASection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section className="py-32 lg:py-40" ref={sectionRef}>
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-display text-[32px] md:text-[42px] lg:text-[48px] font-light text-text-main tracking-[1.5px] uppercase leading-tight mb-6"
        >
          Master Your Investment<br />Psychology.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-body text-[16px] md:text-[18px] text-text-secondary max-w-xl mx-auto leading-relaxed mb-12"
        >
          Join rational investors using InvestSense AI to protect their capital from impulsive decisions and market hysteria.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Link 
            to="/register"
            className="inline-block font-mono text-[12px] tracking-[2.5px] uppercase text-accent border border-accent/40 rounded-full px-10 py-4 hover:bg-accent hover:text-bg-dark transition-all duration-300"
          >
            START ANALYZING NOW
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTASection;
