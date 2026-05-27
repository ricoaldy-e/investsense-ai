const RiskAnalysisCard = ({ data, mode }) => {
  if (!data) return null;

  const rsi = data.metrics?.rsi14 ?? 50;
  const volatility = data.metrics?.volatility || null;
  const peRatio = data.metrics?.peRatio ?? null;
  const antiFomoWarning = data.aiInsights?.antiFomoWarning || 'Always research before investing.';

  const isPro = mode === 'pro';

  // Derive risk level from RSI (volatility may be null from BE — RSI-only fallback)
  const riskLevel = rsi >= 70 ? 'HIGH' : rsi <= 30 ? 'LOW' : (volatility === 'High' ? 'HIGH' : 'MODERATE');
  const riskColor = riskLevel === 'HIGH' ? 'text-danger' : riskLevel === 'LOW' ? 'text-success' : 'text-text-main';

  // Market condition summary - different tone per mode
  const conditionSummary = isPro
    ? (rsi >= 70
        ? `RSI at ${rsi.toFixed(1)} indicates overbought conditions.${peRatio ? ` Elevated P/E (${peRatio}) compounds valuation risk.` : ''} Consider profit-taking or tightening stops.`
        : rsi <= 30
          ? `RSI at ${rsi.toFixed(1)} signals oversold territory. If fundamentals hold, this may present a value entry point. Confirm with volume analysis.`
          : `RSI ${rsi.toFixed(1)}: neutral range.${volatility ? ` Volatility: ${volatility}.` : ''} No extreme conditions detected. Standard position sizing recommended.`)
    : (rsi >= 70
        ? 'This stock has been going up very quickly. It might be too expensive right now. Consider waiting for the price to come down a bit.'
        : rsi <= 30
          ? 'This stock has dropped a lot recently. It could be a good deal, but make sure to do your research first before buying.'
          : 'Everything looks normal right now. The stock isn\'t too expensive or too cheap.');

  return (
    <div className="bg-card-dark border border-card-border p-4 sm:p-6 h-full flex flex-col">
      <p className="font-mono text-[11px] tracking-[2px] uppercase text-accent mb-4 sm:mb-6">
        {isPro ? 'Risk Assessment' : 'Risk Level'}
      </p>

      <div className="space-y-0 divide-y divide-hairline mb-6 sm:mb-8">
        <div className="flex justify-between items-center py-3">
          <span className="font-mono text-[12px] tracking-[1px] uppercase text-text-muted">
            {isPro ? 'Classification' : 'Risk Level'}
          </span>
          <span className={`font-mono text-[11px] tracking-[2px] uppercase ${riskColor}`}>
            {riskLevel}
          </span>
        </div>
        {volatility && (
          <div className="flex justify-between items-center py-3">
            <span className="font-mono text-[12px] tracking-[1px] uppercase text-text-muted">
              {isPro ? 'Volatility' : 'Price Swings'}
            </span>
            <span className="font-mono text-[13px] text-text-main">{volatility}</span>
          </div>
        )}
        {/* Pro mode: show extra metrics */}
        {isPro && peRatio && (
          <div className="flex justify-between items-center py-3">
            <span className="font-mono text-[12px] tracking-[1px] uppercase text-text-muted">P/E Ratio</span>
            <span className="font-mono text-[13px] text-text-main">{peRatio}</span>
          </div>
        )}
        {isPro && (
          <div className="flex justify-between items-center py-3">
            <span className="font-mono text-[12px] tracking-[1px] uppercase text-text-muted">RSI-14</span>
            <span className={`font-mono text-[13px] ${riskColor}`}>{rsi.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="mb-6 flex-1">
        <p className="font-mono text-[10px] tracking-[2px] uppercase text-text-muted mb-3">
          {isPro ? 'Technical Assessment' : 'What This Means'}
        </p>
        <p className={`${isPro ? 'font-mono text-[12px]' : 'font-body text-[14px]'} text-text-secondary leading-relaxed`}>
          {conditionSummary}
        </p>
      </div>

      <div className="border-l-2 border-accent pl-4 py-3">
        <p className="font-mono text-[10px] tracking-[2px] uppercase text-accent mb-2">
          {isPro ? 'Behavioral Bias Signal' : 'Behavioral Guardrail'}
        </p>
        <p className={`${isPro ? 'font-mono text-[12px]' : 'font-body text-[14px]'} text-text-secondary italic leading-relaxed`}>
          &ldquo;{antiFomoWarning}&rdquo;
        </p>
      </div>
    </div>
  );
};

export default RiskAnalysisCard;
