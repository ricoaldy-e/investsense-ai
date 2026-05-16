const RiskAnalysisCard = () => {
  return (
    <div className="bg-card-dark border border-card-border p-4 sm:p-6 h-full flex flex-col">
      <p className="font-mono text-[11px] tracking-[2px] uppercase text-accent mb-4 sm:mb-6">Risk Analysis</p>

      <div className="space-y-0 divide-y divide-hairline mb-6 sm:mb-8">
        <div className="flex justify-between items-center py-3">
          <span className="font-mono text-[12px] tracking-[1px] uppercase text-text-muted">Risk Level</span>
          <span className="font-mono text-[11px] tracking-[2px] uppercase text-accent">
            MODERATE
          </span>
        </div>
        <div className="flex justify-between items-center py-3">
          <span className="font-mono text-[12px] tracking-[1px] uppercase text-text-muted">Volatility</span>
          <span className="font-mono text-[13px] text-text-main">Low</span>
        </div>
      </div>

      <div className="mb-6 flex-1">
        <p className="font-mono text-[10px] tracking-[2px] uppercase text-text-muted mb-3">
          Market Condition Summary
        </p>
        <p className="font-body text-[14px] text-text-secondary leading-relaxed">
          Overall stable environment with moderate buying pressure. No immediate signals for extreme price shifts detected.
        </p>
      </div>

      <div className="border-l-2 border-accent pl-4 py-3">
        <p className="font-mono text-[10px] tracking-[2px] uppercase text-accent mb-2">
          Anti-FOMO Reminder
        </p>
        <p className="font-body text-[14px] text-text-secondary italic leading-relaxed">
          "Avoid entering during high-volatility peaks. Stick to your research."
        </p>
      </div>
    </div>
  );
};

export default RiskAnalysisCard;
