import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const DashboardPreviewSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const stats = [
    { value: '4', label: 'ANALYSIS MODULES', accent: true },
    { value: '24/7', label: 'AI MONITORING', accent: false },
    { value: '0', label: 'EMOTIONAL DECISIONS', accent: true },
  ];

  return (
    <section className="py-32 lg:py-40" ref={sectionRef}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-20"
        >
          <p className="font-mono text-[11px] tracking-[3px] uppercase text-text-muted mb-4">
            PLATFORM OVERVIEW
          </p>
          <h2 className="font-display text-[32px] md:text-[40px] lg:text-[48px] font-light text-text-main tracking-[1.5px] uppercase leading-tight mb-6">
            Precision Analysis<br />Dashboard
          </h2>
          <p className="font-body text-[16px] md:text-[18px] text-text-secondary max-w-xl mx-auto leading-relaxed">
            Optimized for rapid clinical analysis. Built on a foundation of clarity, precision, and rational decision-making.
          </p>
        </motion.div>

        {/* Stats row — staggered reveal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-card-border">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.2 + index * 0.12,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="bg-bg-dark p-10 md:p-12 text-center"
            >
              <span className={`block font-mono text-[40px] md:text-[48px] tracking-[2px] mb-3 ${stat.accent ? 'text-accent' : 'text-text-main'}`}>
                {stat.value}
              </span>
              <span className="font-mono text-[10px] tracking-[2px] uppercase text-text-muted">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DashboardPreviewSection;
