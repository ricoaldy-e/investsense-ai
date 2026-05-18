import { Bot } from 'lucide-react';

const AIInsightCard = ({ data }) => {
  if (!data) return null;

  const { observation, suggestedPlan } = data.aiInsights || {};

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
            {observation || 'No observation data available.'}
          </p>
        </div>

        {/* Suggested Plan */}
        <div className="border-l-2 border-accent pl-4 py-1">
          <p className="font-mono text-[10px] tracking-[2px] uppercase text-accent mb-2">
            Suggested Plan
          </p>
          <p className="font-body text-[14px] text-text-secondary leading-relaxed">
            {suggestedPlan || 'No plan data available.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIInsightCard;
