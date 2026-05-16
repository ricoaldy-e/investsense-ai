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
          
          {/* Left Text — reveals first */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p className="font-mono text-[11px] tracking-[3px] uppercase text-text-muted mb-4">
              BEHAVIORAL INTELLIGENCE
            </p>
            <h2 className="font-display text-[32px] md:text-[40px] font-light text-text-main tracking-[1.5px] uppercase leading-tight mb-8">
              Silence the<br />Market Noise.
            </h2>
            <p className="font-body text-[16px] text-text-secondary leading-relaxed mb-12">
              Emotional investing is the primary cause of retail underperformance. InvestSense AI acts as your analytical buffer, providing objective risk assessment when the market enters a frenzy.
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
                  <h4 className="font-display text-[16px] font-medium text-text-main tracking-[0.5px] mb-1.5">Reduce Impulse</h4>
                  <p className="font-body text-[14px] text-text-secondary leading-relaxed">Recognize high-risk situations before acting on pure momentum.</p>
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
                  <h4 className="font-display text-[16px] font-medium text-text-main tracking-[0.5px] mb-1.5">Data-Backed Logic</h4>
                  <p className="font-body text-[14px] text-text-secondary leading-relaxed">Receive neutral, unbiased analysis before any major market movement.</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Card — slides in after left text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-8 lg:mt-0"
          >
             <div className="bg-card-dark border border-card-border p-6 md:p-8">
               {/* Card header */}
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
                     ANTI-FOMO REMINDER
                   </span>
                 </div>
                 <p className="font-body text-[14px] text-text-secondary leading-relaxed">
                   Market sentiment is currently detached from fundamentals. Wait for price correction before establishing new positions.
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
