import { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const InputField = forwardRef(({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  onKeyDown, 
  error 
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <label className="block font-mono text-[10px] text-text-muted uppercase tracking-[2px]">{label}</label>
        {error && <span className="font-mono text-[10px] text-danger tracking-[1px] uppercase" id={`${label}-error`}>{error}</span>}
      </div>
      <div className="relative">
        <input 
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          ref={ref}
          aria-invalid={!!error}
          aria-errormessage={error ? `${label}-error` : undefined}
          className={`w-full bg-transparent border-b text-[15px] font-body text-text-main px-0 py-3 focus:outline-none transition-colors placeholder:text-text-muted/50 ${
            error ? 'border-danger focus:border-danger' : 'border-card-border focus:border-accent'
          } ${isPassword ? 'pr-10' : ''}`}
        />
        {isPassword && (
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)} 
            className="absolute right-0 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
});

InputField.displayName = 'InputField';

export default InputField;
