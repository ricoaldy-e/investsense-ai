import { useState } from 'react';
import { TriangleAlert } from 'lucide-react';

/**
 * WarningBanner — Dynamic risk awareness banner.
 * 
 * Derives warning from stock metrics:
 * - RSI >= 70 → Overbought warning
 * - RSI <= 30 → Oversold warning
 * - Volatility "High" → Volatility caution
 * - Negative sentiment dominant → Bearish caution
 * 
 * If no risk condition is detected, banner does not render.
 * 
 * Mode-aware:
 * - Beginner: friendly, educational language
 * - Pro: technical, concise language
 */
const WarningBanner = ({ data, mode }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || !data) return null;

  const rsi = data.metrics?.rsi14 ?? 50;
  const volatility = data.metrics?.volatility || 'Medium';
  const sentiment = data.sentiment || {};
  const isPro = mode === 'pro';

  // Derive warning condition
  let title = '';
  let message = '';

  if (rsi >= 70) {
    title = isPro
      ? `Overbought: ${data.ticker} RSI ${rsi.toFixed(1)}`
      : `Valuation Alert: ${data.ticker} Trading Near Historical Highs`;
    message = isPro
      ? `RSI ${rsi.toFixed(1)} exceeds 70 threshold. Momentum exhaustion likely. Consider trailing stop or partial profit-taking.`
      : `This asset is experiencing rapid upward momentum. While bullish, current price levels may represent a short-term premium. Consider evaluating entry points after a consolidation phase.`;
  } else if (rsi <= 30) {
    title = isPro
      ? `Oversold: ${data.ticker} RSI ${rsi.toFixed(1)}`
      : `Market Alert: Significant Price Correction on ${data.ticker}`;
    message = isPro
      ? `RSI ${rsi.toFixed(1)} below 30 threshold. Oversold conditions detected. Watch for reversal patterns and volume confirmation before entry.`
      : `This asset has undergone a significant valuation decrease. While potentially representing a value entry point, verify the underlying drivers of this decline before initiating exposure.`;
  } else if (volatility === 'High') {
    title = isPro
      ? `High Volatility: ${data.ticker}`
      : `Volatility Alert: Elevated Price Swings on ${data.ticker}`;
    message = isPro
      ? `Elevated volatility detected. Wider stop-loss recommended. Reduce position sizing to manage risk exposure.`
      : `This asset displays high intraday volatility. Price fluctuations carry increased capital risk; ensure position sizing is aligned with your risk tolerance.`;
  } else if (sentiment.negative > sentiment.positive && sentiment.negative >= 40) {
    title = isPro
      ? `Bearish Sentiment: ${data.ticker} (${sentiment.negative}%)`
      : `Sentiment Shift: Dominant Negative Coverage on ${data.ticker}`;
    message = isPro
      ? `Sentiment skew: ${sentiment.negative}% bearish. Cross-reference with technical indicators before position changes.`
      : `News coverage and market discussions show a negative sentiment bias. While market price does not always track media sentiment cycles, further research is advised.`;
  }

  // No warning condition detected — don't render
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
        Dismiss
      </button>
    </div>
  );
};

export default WarningBanner;
