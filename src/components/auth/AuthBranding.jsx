import { Link } from 'react-router-dom';
import { ShieldCheck, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AuthBranding = ({ isRegister }) => {
  return (
    <div className="relative w-full h-full bg-[#050505] flex flex-col justify-between p-12 xl:p-16 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#00e5ff]/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10">
        <Link to="/" className="text-xl font-bold text-white tracking-wide group flex items-center transition-transform hover:scale-[1.02] w-fit">
          InvestSense <span className="text-[#00e5ff] ml-1 group-hover:text-[#00cce6] transition-colors">AI</span>
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
              <h1 className="text-4xl xl:text-5xl font-bold text-white leading-[1.2] mb-6">
                {isRegister ? (
                  <>Join the future of <span className="text-[#00e5ff]">rational investing.</span></>
                ) : (
                  <>Invest smarter, <span className="text-[#00e5ff]">not emotionally.</span></>
                )}
              </h1>
              <p className="text-base text-gray-400 leading-relaxed max-w-md">
                Professional <span className="text-[#00e5ff] font-medium">AI</span>-powered stock analysis, sentiment tracking, and behavioral risk awareness to guide your rational investing journey.
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex gap-8">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-gray-500" />
            <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Clinical Grade Data</span>
          </div>
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-gray-500" />
            <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Behavioral AI</span>
          </div>
        </div>
        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">
          © {new Date().getFullYear()} InvestSense AI. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthBranding;
