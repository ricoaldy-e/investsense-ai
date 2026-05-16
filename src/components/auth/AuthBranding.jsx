import { Link } from 'react-router-dom';
import { ShieldCheck, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AuthBranding = ({ isRegister }) => {
  return (
    <div className="relative w-full h-full bg-surface flex flex-col justify-between p-12 xl:p-16 overflow-hidden">
      {/* Very subtle ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-accent/[0.03] blur-[100px] rounded-full pointer-events-none"></div>

      <div className="relative z-10">
        <Link 
          to="/" 
          className="font-mono text-[13px] text-text-main tracking-[3px] uppercase inline-block hover:text-accent transition-colors duration-300"
        >
          INVESTSENSE AI
        </Link>

        <div className="mt-20 max-w-xl h-[200px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={isRegister ? 'register' : 'login'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute top-0 left-0 w-full"
            >
              <h1 className="font-display text-[36px] xl:text-[42px] font-light text-text-main leading-[1.2] tracking-[1.5px] uppercase mb-6">
                {isRegister ? (
                  <>Join the future of<br />rational investing.</>
                ) : (
                  <>Invest smarter,<br />not emotionally.</>
                )}
              </h1>
              <p className="font-body text-[16px] text-text-secondary leading-relaxed max-w-md">
                Professional AI-powered stock analysis, sentiment tracking, and behavioral risk awareness to guide your rational investing journey.
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex gap-8">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-3.5 h-3.5 text-text-muted" />
            <span className="font-mono text-[10px] text-text-muted tracking-[2px] uppercase">Clinical Grade Data</span>
          </div>
          <div className="flex items-center gap-2.5">
            <BrainCircuit className="w-3.5 h-3.5 text-text-muted" />
            <span className="font-mono text-[10px] text-text-muted tracking-[2px] uppercase">Behavioral AI</span>
          </div>
        </div>
        <p className="font-mono text-[10px] text-text-muted tracking-[1.5px] uppercase">
          © {new Date().getFullYear()} InvestSense AI. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthBranding;
