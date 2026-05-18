import { useState, useRef, useEffect } from 'react';

const Tooltip = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef(null);

  // Close on outside click (for mobile)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onClick={() => setIsVisible(!isVisible)}
      ref={tooltipRef}
    >
      {children}
      
      {isVisible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 sm:w-60 p-3 bg-surface border border-card-border shadow-2xl z-[100] animate-in fade-in zoom-in duration-200">
          <p className="font-body text-[11px] text-text-secondary leading-relaxed normal-case tracking-normal">
            {content}
          </p>
          
          {/* Arrow pointing down */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-[5px] border-transparent border-t-card-border"></div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[2.5px] border-[5px] border-transparent border-t-surface"></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
