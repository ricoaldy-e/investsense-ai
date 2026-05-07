import { BarChart3 } from 'lucide-react';

const SentimentAnalysisCard = () => {
  return (
    <div className="bg-card-dark border border-card-border rounded-xl sm:rounded-2xl p-4 sm:p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <BarChart3 className="w-5 h-5 text-brand-blue" />
        <h3 className="text-lg font-bold text-white">Sentiment Analysis</h3>
      </div>

      <div className="space-y-5 flex-1">
        {/* Positive */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium text-text-muted w-16">Positive</span>
          <div className="flex-1 h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
            <div className="h-full bg-brand-blue w-[35%] rounded-full opacity-70"></div>
          </div>
        </div>

        {/* Neutral */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium text-white w-16">Neutral</span>
          <div className="flex-1 h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
            <div className="h-full bg-brand-blue w-[65%] rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
          </div>
        </div>

        {/* Negative */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium text-text-muted w-16">Negative</span>
          <div className="flex-1 h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
            <div className="h-full bg-[#9ca3af] w-[15%] rounded-full opacity-50"></div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-card-border">
        <p className="text-sm text-text-muted leading-relaxed">
          Aggregated news and market data suggest a <span className="text-white font-semibold">neutral sentiment</span> for AAPL today.
        </p>
      </div>
    </div>
  );
};

export default SentimentAnalysisCard;
