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
    <div className="w-full max-w-[420px] bg-[#18181b] border border-[#27272a] rounded-xl p-8 sm:p-10 shadow-2xl relative z-10">
      <h2 className="text-[24px] font-bold text-white mb-2 tracking-tight">Welcome Back</h2>
      <p className="text-sm text-gray-400 mb-8 leading-relaxed">
        Continue your rational investing journey.
      </p>

      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-2">Email Address</label>
          <input 
            type="email" 
            placeholder="name@company.com" 
            className="w-full bg-[#111113] border border-[#27272a] text-sm text-white px-4 py-3 rounded-md focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff] transition-all placeholder:text-gray-600" 
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-[10px] font-bold text-gray-300 uppercase tracking-widest">Password</label>
            <a href="#" className="text-[10px] font-bold text-[#00e5ff] hover:text-[#00cce6] uppercase tracking-widest transition-colors">Forgot?</a>
          </div>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              className="w-full bg-[#111113] border border-[#27272a] text-sm text-white px-4 py-3 pr-10 rounded-md focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff] transition-all placeholder:text-gray-600" 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1 pb-3">
          <input 
            type="checkbox" 
            id="remember" 
            className="w-4 h-4 rounded bg-[#111113] border-[#27272a] checked:bg-[#00e5ff] checked:border-[#00e5ff] focus:ring-[#00e5ff] focus:ring-offset-[#18181b] transition-colors cursor-pointer" 
          />
          <label htmlFor="remember" className="text-sm text-gray-400 select-none cursor-pointer">Remember this device for 30 days</label>
        </div>

        <div className="pt-2">
          <Link to="/dashboard" className="w-full block">
            <button type="button" className="w-full bg-[#00e5ff] hover:bg-[#00cce6] hover:scale-[1.02] text-black font-semibold text-sm py-3 rounded-md transition-all shadow-sm">
              Log In
            </button>
          </Link>
        </div>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-400">
          New to InvestSense? <a href="/register" onClick={handleModeSwitch} className="text-[#00e5ff] font-medium hover:underline transition-colors cursor-pointer ml-1">Create an account</a>
        </p>
      </div>

      <div className="mt-8 flex justify-center items-center text-[10px] font-bold text-gray-500 uppercase tracking-wider">
        <Link to="/" className="flex items-center gap-2 hover:text-gray-300 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
