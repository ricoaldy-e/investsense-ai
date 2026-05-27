import { Info } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis, XAxis, CartesianGrid, Tooltip as RechartsTooltip } from 'recharts';
import Tooltip from './Tooltip';

// Helper to format price with appropriate currency symbol
const formatPrice = (value, currency) => {
  if (value == null) return 'N/A';
  if (currency === 'IDR') return `Rp${value.toLocaleString('id-ID')}`;
  return `$${value.toFixed(2)}`;
};

// Pro mode: custom tooltip for chart hover (defined outside component to avoid re-creation)
const ProChartTooltip = ({ active, payload, currency }) => {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="bg-surface border border-card-border px-3 py-2">
      <p className="font-mono text-[10px] text-text-main">{formatPrice(payload[0].value, currency)}</p>
      <p className="font-mono text-[9px] text-text-muted">{point?.time}</p>
    </div>
  );
};

const StockChartCard = ({ data, mode }) => {
  if (!data) return null;

  // Derive RSI status
  const rsi = data.metrics?.rsi14 ?? 0;
  const isPro = mode === 'pro';

  const rsiLabel = rsi >= 70 ? 'Overbought' : rsi <= 30 ? 'Oversold' : 'Stable';
  const rsiColor = rsi >= 70 ? 'text-danger' : rsi <= 30 ? 'text-success' : 'text-text-main';
  const rsiBarWidth = `${Math.min(rsi, 100)}%`;

  // Derive trend status
  const trendLabel = data.trend === 'up' ? 'Upward Trend' : data.trend === 'down' ? 'Downward Pressure' : 'Sideways';
  const trendColor = data.trend === 'up' ? 'text-success' : data.trend === 'down' ? 'text-danger' : 'text-text-muted';
  const trendBarWidth = data.trend === 'up' ? '85%' : data.trend === 'down' ? '35%' : '50%';

  // Price change color
  const priceChangeColor = data.percentChange >= 0 ? 'text-success' : 'text-danger';
  const priceChangePrefix = data.percentChange >= 0 ? '+' : '';

  // Tooltip content based on mode
  const rsiTooltip = isPro
    ? "Relative Strength Index (RSI) measures the speed and magnitude of recent price changes to evaluate overvalued or undervalued conditions."
    : "A speed limit gauge for stock prices. Above 70 means it's running too hot (Overbought), below 30 means it's heavily sold (Oversold).";

  const trendTooltip = isPro
    ? "Moving Average based trend detection analyzing momentum shifts and prevailing price direction."
    : "Shows the general direction the stock is heading. 'Upward' means buyers are currently in control.";

  // Transform chartData for Recharts
  const chartPoints = (data.chartData || []).map(point => ({ time: point.time, value: point.price }));

  return (
    <div className="bg-card-dark border border-card-border p-4 sm:p-6 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-surface border border-card-border flex items-center justify-center shrink-0">
            <span className="font-mono text-[11px] text-text-muted tracking-[1px]">{data.ticker?.[0]}</span>
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-[20px] font-medium text-text-main tracking-[0.5px] mb-1 truncate">{data.name} ({data.ticker})</h2>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-mono text-[14px] text-text-main tracking-[0.5px]">{formatPrice(data.currentPrice, data.currency)}</span>
              <span className={`font-mono text-[12px] ${priceChangeColor} tracking-[0.5px]`}>{priceChangePrefix}{data.percentChange?.toFixed(2)}%</span>
              {isPro && data.priceChange != null && (
                <span className="font-mono text-[10px] text-text-muted tracking-[1px]">
                  {priceChangePrefix}{formatPrice(Math.abs(data.priceChange || 0), data.currency)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Pro mode: extra metrics badge */}
        {isPro && (
          <div className="flex items-center gap-3 flex-wrap">
            {data.metrics?.peRatio != null && (
              <div className="border border-card-border px-3 py-1.5">
                <span className="font-mono text-[9px] tracking-[1.5px] uppercase text-text-muted block">P/E</span>
                <span className="font-mono text-[12px] text-text-main">{data.metrics.peRatio}</span>
              </div>
            )}
            {data.metrics?.volatility != null && (
              <div className="border border-card-border px-3 py-1.5">
                <span className="font-mono text-[9px] tracking-[1.5px] uppercase text-text-muted block">VOL</span>
                <span className="font-mono text-[12px] text-text-main">{data.metrics.volatility}</span>
              </div>
            )}
            <div className="border border-card-border px-3 py-1.5">
              <span className="font-mono text-[9px] tracking-[1.5px] uppercase text-text-muted block">RSI</span>
              <span className={`font-mono text-[12px] ${rsiColor}`}>{rsi ? rsi.toFixed(1) : 'N/A'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Chart Area */}
      <div className="flex-1 w-full min-h-[200px] md:min-h-[250px] mb-8 relative -ml-2">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <AreaChart data={chartPoints} margin={{ top: 10, right: isPro ? 10 : 0, left: isPro ? 10 : 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7b8fa8" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#7b8fa8" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Pro mode: show grid + axes */}
            {isPro && (
              <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
            )}

            <YAxis
              domain={['dataMin - 2', 'dataMax + 2']}
              hide={!isPro}
              tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => data.currency === 'IDR' ? `Rp${v.toLocaleString('id-ID')}` : `$${v}`}
              width={55}
            />

            <XAxis
              dataKey="time"
              hide={!isPro}
              tick={{ fill: '#52525b', fontSize: 9, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
            />

            {isPro && (
              <RechartsTooltip content={<ProChartTooltip currency={data.currency} />} />
            )}

            <Area
              type="monotone"
              dataKey="value"
              stroke="#a8b5c8"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 border-t border-card-border pt-6">
        {/* RSI */}
        <div>
          <div className="flex justify-between items-center mb-3 gap-2">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <span className="font-mono text-[12px] tracking-[0.5px] text-text-secondary leading-tight truncate">
                {mode === 'beginner' ? 'Price Momentum' : 'RSI-14'}
              </span>
              <Tooltip content={rsiTooltip}>
                <button className="text-text-muted hover:text-accent transition-colors flex-shrink-0 focus:outline-none flex items-center">
                  <Info className="w-3.5 h-3.5" />
                </button>
              </Tooltip>
            </div>
            <div className={`font-mono text-[12px] ${rsiColor} tracking-[0.5px] text-right shrink-0`}>
              {isPro
                ? <>{rsi.toFixed(1)} <span className="text-text-muted">/ 100</span></>
                : rsiLabel
              }
            </div>
          </div>
          <div className="h-1.5 w-full bg-surface overflow-hidden flex mb-2">
            <div className="h-full bg-accent/40" style={{ width: rsiBarWidth }}></div>
          </div>
          <p className="font-body text-[12px] text-text-muted mt-2 leading-relaxed">
            {mode === 'beginner'
              ? (rsi >= 70 ? 'The price has gone up too fast recently. It might be slightly expensive right now.' : rsi <= 30 ? 'The stock has been sold heavily. It might be cheap, but be careful.' : 'The stock price is moving at a normal, healthy pace.')
              : (rsi >= 70 ? 'Elevated RSI suggests potential overvaluation. Consider trailing stop.' : rsi <= 30 ? 'Low RSI indicates oversold conditions. Watch for reversal patterns.' : 'RSI neutral range. No immediate momentum signal.')}
          </p>
        </div>

        {/* Price Trend */}
        <div>
          <div className="flex justify-between items-center mb-3 gap-2">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <span className="font-mono text-[12px] tracking-[0.5px] text-text-secondary leading-tight truncate">
                {mode === 'beginner' ? 'Price Direction' : 'Trend Analysis'}
              </span>
              <Tooltip content={trendTooltip}>
                <button className="text-text-muted hover:text-accent transition-colors flex-shrink-0 focus:outline-none flex items-center">
                  <Info className="w-3.5 h-3.5" />
                </button>
              </Tooltip>
            </div>
            <div className={`font-mono text-[12px] ${trendColor} tracking-[0.5px] text-right shrink-0`}>
              {trendLabel}
            </div>
          </div>
          <div className="h-1.5 w-full bg-surface overflow-hidden mb-2">
            <div className="h-full bg-accent/60" style={{ width: trendBarWidth }}></div>
          </div>
          <p className="font-body text-[12px] text-text-muted mt-2 leading-relaxed">
            {mode === 'beginner'
              ? (data.trend === 'up' ? 'The stock is generally going up. Buyers are in control.' : data.trend === 'down' ? 'The stock is going down. Sellers are in control right now.' : 'The stock isn\'t moving much in either direction.')
              : (data.trend === 'up' ? 'Consistent upward channel. MA crossover confirms bullish momentum.' : data.trend === 'down' ? 'Downward pressure with bearish MA alignment. Risk elevated.' : 'Consolidation phase. Awaiting breakout confirmation.')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StockChartCard;
