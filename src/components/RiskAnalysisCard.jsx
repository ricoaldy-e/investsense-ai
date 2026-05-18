const RiskAnalysisCard = ({ data, mode }) => {
  if (!data) return null;

  const rsi = data.metrics?.rsi14 ?? 50;
  const volatility = data.metrics?.volatility || 'Unknown';
  const antiFomoWarning = data.aiInsights?.antiFomoWarning || 'Always research before investing.';

  // Derive risk level from RSI and volatility
  const riskLevel = rsi >= 70 || volatility === 'High' ? 'HIGH' : rsi <= 30 ? 'LOW' : 'MODERATE';
  const riskColor = riskLevel === 'HIGH' ? 'text-danger' : riskLevel === 'LOW' ? 'text-accent' : 'text-accent';

  // Market condition summary
  const conditionSummary = rsi >= 70
    ? 'Asset appears overvalued with elevated buying pressure. Consider waiting for a correction before entering.'
    : rsi <= 30
      ? 'Asset appears undervalued. Potential opportunity, but confirm with additional indicators before acting.'
      : 'Overall stable environment with moderate buying pressure. No immediate signals for extreme price shifts detected.';

  return (
    <div className="bg-card-dark border border-card-border p-4 sm:p-6 h-full flex flex-col">
      <p className="font-mono text-[11px] tracking-[2px] uppercase text-accent mb-4 sm:mb-6">Risk Analysis</p>

      <div className="space-y-0 divide-y divide-hairline mb-6 sm:mb-8">
        <div className="flex justify-between items-center py-3">
          <span className="font-mono text-[12px] tracking-[1px] uppercase text-text-muted">Risk Level</span>
          <span className={`font-mono text-[11px] tracking-[2px] uppercase ${riskColor}`}>
            {riskLevel}
          </span>
        </div>
        <div className="flex justify-between items-center py-3">
          <span className="font-mono text-[12px] tracking-[1px] uppercase text-text-muted">
            {mode === 'beginner' ? 'Price Swings' : 'Volatility'}
          </span>
          <span className="font-mono text-[13px] text-text-main">{volatility}</span>
        </div>
      </div>

      <div className="mb-6 flex-1">
        <p className="font-mono text-[10px] tracking-[2px] uppercase text-text-muted mb-3">
          Market Condition Summary
        </p>
        <p className="font-body text-[14px] text-text-secondary leading-relaxed">
          {mode === 'beginner' 
            ? conditionSummary.replace('overvalued', 'too expensive').replace('undervalued', 'cheaper than usual').replace('buying pressure', 'buying interest')
            : conditionSummary
          }
        </p>
      </div>

      <div className="border-l-2 border-accent pl-4 py-3">
        <p className="font-mono text-[10px] tracking-[2px] uppercase text-accent mb-2">
          Anti-FOMO Reminder
        </p>
        <p className="font-body text-[14px] text-text-secondary italic leading-relaxed">
          "{antiFomoWarning}"
        </p>
      </div>
    </div>
  );
};

export default RiskAnalysisCard;
