import { Bot } from 'lucide-react';

const AIInsightCard = () => {
  return (
    <div className="bg-card-dark border border-card-border p-4 sm:p-6 h-full flex flex-col">
      <div className="flex items-center gap-2.5 mb-4 sm:mb-6">
        <Bot className="w-4 h-4 text-accent" />
        <h3 className="font-mono text-[11px] tracking-[2px] uppercase text-accent">AI Advice</h3>
      </div>

      <div className="space-y-5 flex-1">
        {/* Observation */}
        <div className="border-l-2 border-danger pl-4 py-1">
          <p className="font-mono text-[10px] tracking-[2px] uppercase text-danger mb-2">
            Observation
          </p>
          <p className="font-body text-[14px] text-text-secondary leading-relaxed">
            The stock has risen very fast recently. It is likely to take a small break or dip soon.
          </p>
        </div>

        {/* Suggested Plan */}
        <div className="border-l-2 border-accent pl-4 py-1">
          <p className="font-mono text-[10px] tracking-[2px] uppercase text-accent mb-2">
            Suggested Plan
          </p>
          <p className="font-body text-[14px] text-text-secondary leading-relaxed">
            Do not buy right now. Wait for the price to settle before considering an entry.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIInsightCard;
