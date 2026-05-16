import { BarChart3 } from 'lucide-react';

const SentimentAnalysisCard = () => {
  return (
    <div className="bg-card-dark border border-card-border p-4 sm:p-6 h-full flex flex-col">
      <div className="flex items-center gap-2.5 mb-4 sm:mb-6">
        <BarChart3 className="w-4 h-4 text-accent" />
        <h3 className="font-mono text-[11px] tracking-[2px] uppercase text-accent">Sentiment Analysis</h3>
      </div>

      <div className="space-y-5 flex-1">
        {/* Positive */}
        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-[11px] tracking-[1px] uppercase text-text-muted w-16">Positive</span>
          <div className="flex-1 h-1.5 bg-surface overflow-hidden">
            <div className="h-full bg-accent/50 w-[35%]"></div>
          </div>
        </div>

        {/* Neutral */}
        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-[11px] tracking-[1px] uppercase text-text-main w-16">Neutral</span>
          <div className="flex-1 h-1.5 bg-surface overflow-hidden">
            <div className="h-full bg-accent w-[65%]"></div>
          </div>
        </div>

        {/* Negative */}
        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-[11px] tracking-[1px] uppercase text-text-muted w-16">Negative</span>
          <div className="flex-1 h-1.5 bg-surface overflow-hidden">
            <div className="h-full bg-text-muted/40 w-[15%]"></div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-hairline">
        <p className="font-body text-[14px] text-text-secondary leading-relaxed">
          Aggregated news and market data suggest a <span className="text-text-main">neutral sentiment</span> for AAPL today.
        </p>
      </div>
    </div>
  );
};

export default SentimentAnalysisCard;
