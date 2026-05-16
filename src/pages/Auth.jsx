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
    <div className="min-h-screen relative w-full overflow-hidden bg-bg-dark text-text-main flex flex-col lg:block">

      {/* MOBILE ONLY: Forms with AnimatePresence */}
      <div className="lg:hidden flex-1 flex flex-col min-h-0 overflow-y-auto">
        <div className="flex-1 flex flex-col items-center justify-center p-5 py-8 relative">
          {/* Logo above card */}
          <div className="w-full max-w-[420px] mb-8 flex flex-col items-center text-center">
            <Link to="/" className="font-mono text-[13px] text-text-main tracking-[3px] uppercase hover:text-accent transition-colors duration-300">
              INVESTSENSE AI
            </Link>
            <p className="font-body text-[12px] text-text-muted mt-2">Professional AI-powered stock analysis</p>
          </div>
          <AnimatePresence mode="wait">
            {isRegister ? (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full flex justify-center"
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
                className="w-full flex justify-center"
              >
                <LoginForm />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="py-4 px-5 flex justify-center border-t border-card-border">
          <p className="font-mono text-[10px] text-text-muted uppercase tracking-[1.5px] text-center">
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
          className="absolute top-0 w-1/2 h-full z-20 border-card-border"
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
