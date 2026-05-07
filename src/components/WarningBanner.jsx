import { TriangleAlert } from 'lucide-react';

const WarningBanner = () => {
  return (
    <div className="bg-danger-bg border border-danger/20 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-start gap-4 flex-1">
        <div className="flex-shrink-0 mt-0.5">
          <TriangleAlert className="w-5 h-5 text-danger" />
        </div>
        <div>
          <h3 className="text-white font-semibold mb-1 text-sm md:text-base">
            Market Caution: High Greed
          </h3>
          <p className="text-text-muted text-xs md:text-sm leading-relaxed">
            Prices are currently very high. Our AI suggests waiting for a better time to start new positions.
          </p>
        </div>
      </div>
      <button className="shrink-0 w-full sm:w-auto px-4 py-2 sm:px-3 sm:py-1.5 bg-card-dark hover:bg-[#1a1a1a] border border-card-border rounded-md text-sm sm:text-xs font-medium text-white transition-colors">
        Dismiss
      </button>
    </div>
  );
};

export default WarningBanner;
