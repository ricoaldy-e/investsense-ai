import { useState } from 'react';
import { TriangleAlert } from 'lucide-react';

const WarningBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-danger-soft border border-danger/20 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-start gap-4 flex-1">
        <div className="flex-shrink-0 mt-0.5">
          <TriangleAlert className="w-4 h-4 text-danger" />
        </div>
        <div>
          <h3 className="font-display text-[15px] font-medium text-text-main tracking-[0.5px] mb-1">
            Market Caution: High Greed
          </h3>
          <p className="font-body text-[13px] text-text-secondary leading-relaxed">
            Prices are currently very high. Our AI suggests waiting for a better time to start new positions.
          </p>
        </div>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="shrink-0 w-full sm:w-auto font-mono text-[10px] tracking-[2px] uppercase text-text-muted border border-card-border px-4 py-2 hover:text-text-main hover:border-text-muted transition-colors"
      >
        Dismiss
      </button>
    </div>
  );
};

export default WarningBanner;
