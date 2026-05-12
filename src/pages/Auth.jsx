import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import AuthBranding from '../components/auth/AuthBranding';
import { Link } from 'react-router-dom';

const Auth = () => {
  const location = useLocation();
  const isRegister = location.pathname === '/register';
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-[#111111] text-text-main font-sans selection:bg-[#00e5ff]/30 selection:text-white flex flex-col lg:block">
      
      {/* MOBILE ONLY: Minimal Branding Header */}
      <div className="lg:hidden w-full bg-[#050505] p-6 border-b border-gray-800/50 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[200px] bg-[#00e5ff]/5 blur-[80px] rounded-full pointer-events-none"></div>
        <Link to="/" className="relative z-10 text-xl font-bold text-white tracking-wide group flex items-center transition-transform hover:scale-[1.02] mb-2">
          InvestSense <span className="text-[#00e5ff] ml-1 group-hover:text-[#00cce6] transition-colors">AI</span>
        </Link>
        <p className="relative z-10 text-xs text-gray-400">Professional AI-powered stock analysis</p>
      </div>

      {/* MOBILE ONLY: Forms with AnimatePresence */}
      <div className="lg:hidden flex-1 flex flex-col justify-center p-6 relative">
        <AnimatePresence mode="wait">
          {isRegister ? (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center"
            >
              <RegisterForm />
            </motion.div>
          ) : (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center"
            >
              <LoginForm />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-auto pt-8 flex justify-center">
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider text-center">
            © {currentYear} InvestSense AI. Precision Clinical Intelligence.
          </p>
        </div>
      </div>

      {/* DESKTOP SPLIT LAYOUT (Large Screens Only) */}
      <div className="hidden lg:block relative w-full h-screen overflow-hidden">
        
        {/* LOGIN FORM (Static on Left) */}
        <div className="absolute top-0 left-0 w-1/2 h-full flex items-center justify-center p-12 z-10">
           <LoginForm />
        </div>

        {/* REGISTER FORM (Static on Right) */}
        <div className="absolute top-0 right-0 w-1/2 h-full flex items-center justify-center p-12 z-10">
           <RegisterForm />
        </div>

        {/* THE SLIDING BRANDING OVERLAY */}
        <motion.div 
          className="absolute top-0 w-1/2 h-full shadow-[0_0_50px_rgba(0,0,0,0.5)] z-20 border-gray-800/50"
          initial={false}
          animate={{ x: isRegister ? "0%" : "100%" }}
          transition={{ 
            type: "spring", 
            stiffness: 70, 
            damping: 15,
            mass: 0.8
          }}
          style={{
            borderRightWidth: isRegister ? '1px' : '0px',
            borderLeftWidth: !isRegister ? '1px' : '0px',
          }}
        >
          <AuthBranding isRegister={isRegister} />
        </motion.div>

      </div>
    </div>
  );
};

export default Auth;
