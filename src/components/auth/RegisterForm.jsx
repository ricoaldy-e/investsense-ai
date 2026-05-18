import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { authService } from '../../services/authService';
import InputField from '../ui/InputField';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ username: '', email: '', password: '', global: '' });
  
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  const handleKeyDown = (e, field) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      if (field === 'username') {
        if (!username) {
          setErrors(prev => ({...prev, username: 'Username required'}));
          return;
        } else if (username.length < 3) {
          setErrors(prev => ({...prev, username: 'Min 3 characters'}));
          return;
        }
        
        if (!email) emailRef.current?.focus();
        else if (!password) passwordRef.current?.focus();
        else handleRegister(e);
      } else if (field === 'email') {
        if (!email) {
          setErrors(prev => ({...prev, email: 'Email required'}));
          return;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          setErrors(prev => ({...prev, email: 'Invalid format'}));
          return;
        }
        
        if (!username) usernameRef.current?.focus();
        else if (!password) passwordRef.current?.focus();
        else handleRegister(e);
      } else if (field === 'password') {
        if (!password) {
          setErrors(prev => ({...prev, password: 'Password required'}));
          return;
        } else if (password.length < 8) {
          setErrors(prev => ({...prev, password: 'Min 8 characters'}));
          return;
        }
        
        if (!username) usernameRef.current?.focus();
        else if (!email) emailRef.current?.focus();
        else handleRegister(e);
      }
    }
  };

  const handleModeSwitch = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({ username: '', email: '', password: '', global: '' });
    
    let hasError = false;
    const newErrors = { username: '', email: '', password: '', global: '' };

    if (!username) {
      newErrors.username = 'Username required';
      hasError = true;
    } else if (username.length < 3) {
      newErrors.username = 'Min 3 characters';
      hasError = true;
    }

    if (!email) {
      newErrors.email = 'Email required';
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid format';
      hasError = true;
    }

    if (!password) {
      newErrors.password = 'Password required';
      hasError = true;
    } else if (password.length < 8) {
      newErrors.password = 'Min 8 characters';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await authService.register(username, email, password);
      // Redirection pintar: Setelah sukses, lempar user ke halaman login
      // agar mereka membuktikan kredensial dengan login mandiri.
      navigate('/login');
    } catch (err) {
      setErrors({ ...newErrors, global: err.message || 'Registration failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] bg-card-dark border border-card-border p-8 sm:p-10 relative z-10">
      <h2 className="font-display text-[24px] font-light text-text-main tracking-[1px] uppercase mb-2">Create Account</h2>
      <p className="font-body text-[14px] text-text-secondary mb-8 leading-relaxed">
        Start your rational investing journey today.
      </p>

      <form className="space-y-6" onSubmit={handleRegister}>
        {errors.global && (
          <div className="bg-danger/10 border border-danger/20 text-danger p-3 text-[13px] font-body rounded-sm flex items-center">
            {errors.global}
          </div>
        )}

        {/* Username */}
        <InputField 
          label="Username"
          type="text"
          placeholder="johndoe"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (errors.username) setErrors({ ...errors, username: '' });
          }}
          onKeyDown={(e) => handleKeyDown(e, 'username')}
          ref={usernameRef}
          error={errors.username}
        />

        {/* Email */}
        <InputField 
          label="Email Address"
          type="email"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors({ ...errors, email: '' });
          }}
          onKeyDown={(e) => handleKeyDown(e, 'email')}
          ref={emailRef}
          error={errors.email}
        />

        {/* Password */}
        <InputField 
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors({ ...errors, password: '' });
          }}
          onKeyDown={(e) => handleKeyDown(e, 'password')}
          ref={passwordRef}
          error={errors.password}
        />

        {/* Submit */}
        <div className="pt-3">
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full font-mono text-[12px] tracking-[2.5px] uppercase text-accent border border-accent/40 rounded-full py-3.5 hover:bg-accent hover:text-bg-dark disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-accent transition-all duration-300 flex justify-center items-center h-[46px]"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'CREATE ACCOUNT'}
          </button>
        </div>
      </form>

      <div className="mt-8 text-center">
        <p className="font-body text-[14px] text-text-secondary">
          Already have an account?{' '}
          <a href="/login" onClick={handleModeSwitch} className="text-accent hover:text-accent-hover transition-colors cursor-pointer">
            Log in here
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

export default RegisterForm;
