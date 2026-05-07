const RiskAnalysisCard = () => {
  return (
    <div className="bg-card-dark border border-card-border rounded-xl sm:rounded-2xl p-4 sm:p-6 h-full flex flex-col">
      <h3 className="text-sm font-bold text-brand-blue mb-4 sm:mb-6">Risk Analysis</h3>

      <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
        <div className="flex justify-between items-center">
          <span className="text-sm text-text-muted">Current Risk Level</span>
          <span className="px-2 py-0.5 text-[10px] font-bold text-brand-blue bg-brand-blue/10 border border-brand-blue/20 rounded tracking-wider">
            MODERATE
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-text-muted">Volatility</span>
          <span className="text-sm font-medium text-white">Low</span>
        </div>
      </div>

      <div className="mb-6 flex-1">
        <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">
          Market Condition Summary
        </h4>
        <p className="text-sm text-gray-200 leading-relaxed">
          Overall stable environment with moderate buying pressure. No immediate signals for extreme price shifts detected.
        </p>
      </div>

      <div className="bg-[#0f1115] border border-card-border border-l-2 border-l-brand-blue rounded-lg p-4">
        <h4 className="text-[10px] font-bold text-brand-blue uppercase tracking-wider mb-2">
          Anti-FOMO Reminder
        </h4>
        <p className="text-sm text-gray-300 italic leading-relaxed">
          "Avoid entering during high-volatility peaks. Stick to your research."
        </p>
      </div>
    </div>
  );
};

export default RiskAnalysisCard;
