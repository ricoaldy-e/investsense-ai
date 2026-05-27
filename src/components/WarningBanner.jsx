import { useState } from 'react';
import { TriangleAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * WarningBanner — Dynamic risk awareness banner.
 * Mode-aware, i18n-aware.
 */
const WarningBanner = ({ data, mode }) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || !data) return null;

  const rsi = data.metrics?.rsi14 ?? 50;
  const volatility = data.metrics?.volatility || null;
  const sentiment = data.sentiment || {};
  const isPro = mode === 'pro';

  let title = '';
  let message = '';

  if (rsi >= 70) {
    title = isPro
      ? `Overbought: ${data.ticker} RSI ${rsi.toFixed(1)}`
      : `${t('warning_banner.fomo_title')}: ${data.ticker}`;
    message = isPro
      ? `RSI ${rsi.toFixed(1)} exceeds 70 threshold. Momentum exhaustion likely. Consider trailing stop or partial profit-taking.`
      : t('warning_banner.high_rsi', { value: rsi.toFixed(1) });
  } else if (rsi <= 30) {
    title = isPro
      ? `Oversold: ${data.ticker} RSI ${rsi.toFixed(1)}`
      : `${t('warning_banner.risk_title')}: ${data.ticker}`;
    message = isPro
      ? `RSI ${rsi.toFixed(1)} below 30 threshold. Oversold conditions detected. Watch for reversal patterns and volume confirmation before entry.`
      : t('warning_banner.low_rsi', { value: rsi.toFixed(1) });
  } else if (volatility === 'High') {
    title = isPro
      ? `High Volatility: ${data.ticker}`
      : `${t('warning_banner.risk_title')}: ${data.ticker}`;
    message = isPro
      ? `Elevated volatility detected. Wider stop-loss recommended. Reduce position sizing to manage risk exposure.`
      : t('warning_banner.high_rsi', { value: 'N/A' });
  } else if (sentiment.negative > sentiment.positive && sentiment.negative >= 40) {
    title = isPro
      ? `Bearish Sentiment: ${data.ticker} (${sentiment.negative}%)`
      : `${t('warning_banner.risk_title')}: ${data.ticker}`;
    message = isPro
      ? `Sentiment skew: ${sentiment.negative}% bearish. Cross-reference with technical indicators before position changes.`
      : t('warning_banner.low_rsi', { value: sentiment.negative + '%' });
  }

  if (!title) return null;

  return (
    <div className="bg-danger-soft border border-danger/20 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-start gap-4 flex-1">
        <div className="flex-shrink-0 mt-0.5">
          <TriangleAlert className="w-4 h-4 text-danger" />
        </div>
        <div>
          <h3 className="font-display text-[15px] font-medium text-text-main tracking-[0.5px] mb-1">
            {title}
          </h3>
          <p className={`${isPro ? 'font-mono text-[12px]' : 'font-body text-[13px]'} text-text-secondary leading-relaxed`}>
            {message}
          </p>
        </div>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="shrink-0 w-full sm:w-auto font-mono text-[10px] tracking-[2px] uppercase text-text-muted border border-card-border px-4 py-2 hover:text-text-main hover:border-text-muted transition-colors"
      >
        {t('warning_banner.dismiss')}
      </button>
    </div>
  );
};

export default WarningBanner;
