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
 */
const WarningBanner = ({ data }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || !data) return null;

  const rsi = data.metrics?.rsi14 ?? 50;
  const volatility = data.metrics?.volatility || 'Medium';
  const sentiment = data.sentiment || {};

  // Derive warning condition
  let title = '';
  let message = '';

  if (rsi >= 70) {
    title = `Market Caution: ${data.ticker} Overbought`;
    message = `RSI is at ${rsi.toFixed(1)}, indicating elevated buying pressure. Prices may be running ahead of fundamentals. Consider waiting for a pullback before entering new positions.`;
  } else if (rsi <= 30) {
    title = `Market Caution: ${data.ticker} Oversold`;
    message = `RSI is at ${rsi.toFixed(1)}, suggesting heavy selling pressure. While this may signal a potential opportunity, wait for clear reversal confirmation before acting.`;
  } else if (volatility === 'High') {
    title = `Volatility Alert: ${data.ticker}`;
    message = `This asset is experiencing high price volatility. Rapid price swings increase risk. Exercise caution and avoid impulsive decisions.`;
  } else if (sentiment.negative > sentiment.positive && sentiment.negative >= 40) {
    title = `Bearish Sentiment: ${data.ticker}`;
    message = `Market sentiment is predominantly negative (${sentiment.negative}%). News and analysis suggest caution. Verify with multiple sources before making decisions.`;
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
          <p className="font-body text-[13px] text-text-secondary leading-relaxed">
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

