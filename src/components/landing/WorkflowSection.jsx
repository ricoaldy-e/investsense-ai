import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const WorkflowSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const steps = [
    { num: "01", title: "Search Stock", desc: "Input any publicly listed ticker for deep analysis." },
    { num: "02", title: "Analyze Sentiment", desc: "AI scans news, financial data, and official filings." },
    { num: "03", title: "Receive Insights", desc: "Get distilled explanations of stock health and risk." },
    { num: "04", title: "Rational Action", desc: "Make a calculated, non-emotional investment decision." }
  ];

  return (
    <section id="workflow" className="py-32 lg:py-40" ref={sectionRef}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-20"
        >
          <p className="font-mono text-[11px] tracking-[3px] uppercase text-text-muted mb-4">
            METHODOLOGY
          </p>
          <h2 className="font-display text-[32px] md:text-[40px] font-light text-text-main tracking-[1.5px] uppercase">
            The Rational Workflow
          </h2>
        </motion.div>

        {/* Steps — staggered left to right */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.15 + index * 0.12,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="text-center md:text-left"
            >
              {/* Step number — mono, outlined circle */}
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-card-border text-accent font-mono text-[13px] tracking-[1px] mb-6">
                {step.num}
              </div>

              {/* Title — Outfit */}
              <h3 className="font-display text-[18px] font-medium text-text-main tracking-[0.5px] mb-3">
                {step.title}
              </h3>

              {/* Description — Source Serif */}
              <p className="font-body text-[14px] text-text-secondary leading-relaxed max-w-[220px] mx-auto md:mx-0">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;
