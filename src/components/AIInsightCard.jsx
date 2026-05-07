import { Bot } from 'lucide-react';

const AIInsightCard = () => {
  return (
    <div className="bg-card-dark border border-card-border rounded-xl sm:rounded-2xl p-4 sm:p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <Bot className="w-5 h-5 text-brand-blue" />
        <h3 className="text-lg font-bold text-white">AI Advice</h3>
      </div>

      <div className="space-y-4 flex-1">
        {/* Observation */}
        <div className="border-l-2 border-[#fca5a5] pl-4 py-1">
          <h4 className="text-[10px] font-bold text-[#fca5a5] uppercase tracking-wider mb-2">
            Observation
          </h4>
          <p className="text-sm text-gray-200 leading-relaxed">
            The stock has risen very fast recently. It is likely to take a small break or dip soon.
          </p>
        </div>

        {/* Suggested Plan */}
        <div className="bg-brand-blue/5 border-l-2 border-brand-blue rounded-r-lg p-4 mt-2">
          <h4 className="text-[10px] font-bold text-brand-blue uppercase tracking-wider mb-2">
            Suggested Plan
          </h4>
          <p className="text-sm text-gray-200 leading-relaxed">
            Do not buy right now. Wait for the price to settle before considering an entry.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIInsightCard;
