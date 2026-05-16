import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleModeSwitch = (e) => {
    e.preventDefault();
    navigate('/register');
  };

  return (
    <div className="w-full max-w-[420px] bg-card-dark border border-card-border p-8 sm:p-10 relative z-10">
      <h2 className="font-display text-[24px] font-light text-text-main tracking-[1px] uppercase mb-2">Welcome Back</h2>
      <p className="font-body text-[14px] text-text-secondary mb-8 leading-relaxed">
        Continue your rational investing journey.
      </p>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        {/* Email */}
        <div>
          <label className="block font-mono text-[10px] text-text-muted uppercase tracking-[2px] mb-3">Email Address</label>
          <input 
            type="email" 
            placeholder="name@company.com" 
            className="w-full bg-transparent border-b border-card-border text-[15px] font-body text-text-main px-0 py-3 focus:outline-none focus:border-accent transition-colors placeholder:text-text-muted/50" 
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block font-mono text-[10px] text-text-muted uppercase tracking-[2px]">Password</label>
            <a href="#" className="font-mono text-[10px] text-accent hover:text-accent-hover uppercase tracking-[2px] transition-colors">Forgot?</a>
          </div>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              className="w-full bg-transparent border-b border-card-border text-[15px] font-body text-text-main px-0 py-3 pr-10 focus:outline-none focus:border-accent transition-colors placeholder:text-text-muted/50" 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-0 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember */}
        <div className="flex items-center gap-3 pt-1">
          <input 
            type="checkbox" 
            id="remember" 
            className="w-4 h-4 bg-transparent border border-card-border checked:bg-accent checked:border-accent focus:ring-accent focus:ring-offset-card-dark transition-colors cursor-pointer" 
          />
          <label htmlFor="remember" className="font-body text-[13px] text-text-secondary select-none cursor-pointer">Remember this device for 30 days</label>
        </div>

        {/* Submit */}
        <div className="pt-3">
          <Link to="/dashboard" className="w-full block">
            <button type="button" className="w-full font-mono text-[12px] tracking-[2.5px] uppercase text-accent border border-accent/40 rounded-full py-3.5 hover:bg-accent hover:text-bg-dark transition-all duration-300">
              LOG IN
            </button>
          </Link>
        </div>
      </form>

      <div className="mt-8 text-center">
        <p className="font-body text-[14px] text-text-secondary">
          New to InvestSense?{' '}
          <a href="/register" onClick={handleModeSwitch} className="text-accent hover:text-accent-hover transition-colors cursor-pointer">
            Create an account
          </a>
        </p>
      </div>

      <div className="mt-8 flex justify-center items-center">
        <Link to="/" className="font-mono text-[10px] tracking-[2px] uppercase text-text-muted hover:text-text-secondary transition-colors flex items-center gap-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
