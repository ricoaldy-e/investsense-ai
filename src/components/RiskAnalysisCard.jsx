import { useTranslation } from 'react-i18next';

const RiskAnalysisCard = ({ data, mode }) => {
  const { t } = useTranslation();
  if (!data) return null;

  const rsi = data.metrics?.rsi14 ?? 50;
  const volatility = data.metrics?.volatility || null;
  const peRatio = data.metrics?.peRatio ?? null;
  const antiFomoWarning = data.aiInsights?.antiFomoWarning || 'Always research before investing.';

  const isPro = mode === 'pro';

  const riskLevel = rsi >= 70 ? 'HIGH' : rsi <= 30 ? 'LOW' : (volatility === 'High' ? 'HIGH' : 'MODERATE');
  const riskColor = riskLevel === 'HIGH' ? 'text-danger' : riskLevel === 'LOW' ? 'text-success' : 'text-text-main';

  const conditionSummary = isPro
    ? (rsi >= 70
        ? `RSI at ${rsi.toFixed(1)} indicates overbought conditions.${peRatio ? ` Elevated P/E (${peRatio}) compounds valuation risk.` : ''} Consider profit-taking or tightening stops.`
        : rsi <= 30
          ? `RSI at ${rsi.toFixed(1)} signals oversold territory. If fundamentals hold, this may present a value entry point. Confirm with volume analysis.`
          : `RSI ${rsi.toFixed(1)}: neutral range.${volatility ? ` Volatility: ${volatility}.` : ''} No extreme conditions detected. Standard position sizing recommended.`)
    : (rsi >= 70
        ? t('risk_card.condition_beginner_high')
        : rsi <= 30
          ? t('risk_card.condition_beginner_low')
          : t('risk_card.condition_beginner_neutral'));

  return (
    <div className="bg-card-dark border border-card-border p-4 sm:p-6 h-full flex flex-col">
      <p className="font-mono text-[11px] tracking-[2px] uppercase text-accent mb-4 sm:mb-6">
        {isPro ? t('risk_card.title_pro') : t('risk_card.title_beginner')}
      </p>

      <div className="space-y-0 divide-y divide-hairline mb-6 sm:mb-8">
        <div className="flex justify-between items-center py-3">
          <span className="font-mono text-[12px] tracking-[1px] uppercase text-text-muted">
            {isPro ? t('risk_card.classification') : t('risk_card.title_beginner')}
          </span>
          <span className={`font-mono text-[11px] tracking-[2px] uppercase ${riskColor}`}>
            {riskLevel}
          </span>
        </div>
        {volatility && (
          <div className="flex justify-between items-center py-3">
            <span className="font-mono text-[12px] tracking-[1px] uppercase text-text-muted">
              {isPro ? t('risk_card.volatility') : t('risk_card.price_swings')}
            </span>
            <span className="font-mono text-[13px] text-text-main">{volatility}</span>
          </div>
        )}
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
          {isPro ? t('risk_card.technical_assessment') : t('risk_card.what_this_means')}
        </p>
        <p className={`${isPro ? 'font-mono text-[12px]' : 'font-body text-[14px]'} text-text-secondary leading-relaxed`}>
          {conditionSummary}
        </p>
      </div>

      <div className="border-l-2 border-accent pl-4 py-3">
        <p className="font-mono text-[10px] tracking-[2px] uppercase text-accent mb-2">
          {isPro ? t('risk_card.behavioral_bias') : t('risk_card.behavioral_guardrail')}
        </p>
        <p className={`${isPro ? 'font-mono text-[12px]' : 'font-body text-[14px]'} text-text-secondary italic leading-relaxed`}>
          &ldquo;{antiFomoWarning}&rdquo;
        </p>
      </div>
    </div>
  );
};

export default RiskAnalysisCard;
