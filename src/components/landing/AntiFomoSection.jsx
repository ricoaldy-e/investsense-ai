import { ShieldAlert, CheckCircle2, TriangleAlert } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const AntiFomoSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section id="about" className="py-32 lg:py-40" ref={sectionRef}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p className="font-mono text-[11px] tracking-[3px] uppercase text-text-muted mb-4">
              BEHAVIORAL INTELLIGENCE
            </p>
            <h2 className="font-display text-[32px] md:text-[40px] font-light text-text-main tracking-[1.5px] uppercase leading-tight mb-8">
              Neutralize Speculative<br />Sentiment.
            </h2>
            <p className="font-body text-[16px] text-text-secondary leading-relaxed mb-12">
              Speculative momentum and emotional biases consistently erode capital. InvestSense AI functions as a behavioral guardrail, providing a clinical analytical buffer that isolates fundamentals from market hysteria.
            </p>
            
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex gap-5"
              >
                <div className="mt-0.5">
                  <ShieldAlert className="w-4 h-4 text-danger" />
                </div>
                <div>
                  <h4 className="font-display text-[16px] font-medium text-text-main tracking-[0.5px] mb-1.5">Mitigate Cognitive Bias</h4>
                  <p className="font-body text-[14px] text-text-secondary leading-relaxed">Identify high-risk speculative patterns and market anomalies before deploying capital.</p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex gap-5"
              >
                <div className="mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <h4 className="font-display text-[16px] font-medium text-text-main tracking-[0.5px] mb-1.5">Empirical Validation</h4>
                  <p className="font-body text-[14px] text-text-secondary leading-relaxed">Access objective, multi-layered telemetry and news sentiment indicators before key market events.</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-8 lg:mt-0"
          >
             <div className="bg-card-dark border border-card-border p-6 md:p-8">
               
               <p className="font-mono text-[10px] tracking-[2px] uppercase text-accent mb-6">
                 RISK ANALYSIS
               </p>

               <div className="space-y-4 mb-8">
                 <div className="flex justify-between items-center py-3 border-b border-hairline">
                   <span className="font-mono text-[12px] tracking-[1px] uppercase text-text-muted">Risk Level</span>
                   <span className="font-mono text-[11px] tracking-[2px] uppercase text-danger">
                     EXTREME
                   </span>
                 </div>
                 <div className="flex justify-between items-center py-3 border-b border-hairline">
                   <span className="font-mono text-[12px] tracking-[1px] uppercase text-text-muted">Volatility</span>
                   <span className="font-mono text-[13px] text-text-main">High</span>
                 </div>
               </div>

               <div className="border-l-2 border-danger pl-5 py-1">
                  <div className="flex items-center gap-2 mb-2">
                    <TriangleAlert className="w-3.5 h-3.5 text-danger" />
                    <span className="font-mono text-[10px] tracking-[2px] uppercase text-danger">
                      BEHAVIORAL BIAS WARNING
                    </span>
                  </div>
                  <p className="font-body text-[14px] text-text-secondary leading-relaxed">
                    Speculative sentiment has reached statistical extremes, detaching from underlying technical indicators. Exercise caution before initiating new long exposure.
                  </p>
               </div>
             </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AntiFomoSection;
