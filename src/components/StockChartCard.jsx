import { useState } from 'react';
import { Info } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import Tooltip from './Tooltip';

const StockChartCard = ({ data, mode }) => {
  const [timeRange, setTimeRange] = useState('1D');
  const ranges = ['1H', '1D', '1W', '1M'];

  if (!data) return null;

  // Derive RSI status
  const rsi = data.metrics?.rsi14 ?? 0;
  const rsiLabel = rsi >= 70 ? 'Overbought' : rsi <= 30 ? 'Oversold' : 'Stable';
  const rsiColor = rsi >= 70 ? 'text-danger' : rsi <= 30 ? 'text-accent' : 'text-text-main';
  const rsiBarWidth = `${Math.min(rsi, 100)}%`;

  // Derive trend status
  const trendLabel = data.trend === 'up' ? 'Upward Trend' : data.trend === 'down' ? 'Downward Pressure' : 'Sideways';
  const trendColor = data.trend === 'up' ? 'text-accent' : data.trend === 'down' ? 'text-danger' : 'text-text-muted';
  const trendBarWidth = data.trend === 'up' ? '85%' : data.trend === 'down' ? '35%' : '50%';

  // Price change color
  const priceChangeColor = data.percentChange >= 0 ? 'text-accent' : 'text-danger';
  const priceChangePrefix = data.percentChange >= 0 ? '+' : '';

  // Tooltip content based on mode
  const rsiTooltip = mode === 'beginner'
    ? "A speed limit gauge for stock prices. Above 70 means it's running too hot (Overbought), below 30 means it's heavily sold (Oversold)."
    : "Relative Strength Index (RSI) measures the speed and magnitude of recent price changes to evaluate overvalued or undervalued conditions.";

  const trendTooltip = mode === 'beginner'
    ? "Shows the general direction the stock is heading. 'Upward' means buyers are currently in control."
    : "Moving Average based trend detection analyzing momentum shifts and prevailing price direction.";

  // Transform chartData for Recharts (expects { value })
  const chartPoints = (data.chartData || []).map(point => ({ value: point.price }));

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
              <span className="font-mono text-[14px] text-text-main tracking-[0.5px]">${data.currentPrice?.toFixed(2)}</span>
              <span className={`font-mono text-[12px] ${priceChangeColor} tracking-[0.5px]`}>{priceChangePrefix}{data.percentChange?.toFixed(2)}%</span>
            </div>
          </div>
        </div>

        {/* Time Range Selector (Di-comment sementara menunggu konfirmasi Backend) */}
        {/* 
        <div className="flex border border-card-border p-1 w-full sm:w-auto">
          {ranges.map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`flex-1 sm:flex-none px-3 py-2 md:px-4 font-mono text-[11px] tracking-[1px] uppercase transition-colors text-center ${
                timeRange === range
                  ? 'bg-accent text-bg-dark'
                  : 'text-text-muted hover:text-text-main'
              }`}
            >
              {range}
            </button>
          ))}
        </div> 
        */}
      </div>

      {/* Chart Area */}
      <div className="flex-1 w-full min-h-[200px] md:min-h-[250px] mb-8 relative -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartPoints} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7b8fa8" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#7b8fa8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis domain={['dataMin - 10', 'dataMax + 10']} hide />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#a8b5c8"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
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
                {mode === 'beginner' ? 'Price Momentum (RSI)' : 'RSI Indicator'}
              </span>
              <Tooltip content={rsiTooltip}>
                <button className="text-text-muted hover:text-accent transition-colors flex-shrink-0 focus:outline-none flex items-center">
                  <Info className="w-3.5 h-3.5" />
                </button>
              </Tooltip>
            </div>
            <div className={`font-mono text-[12px] ${rsiColor} tracking-[0.5px] text-right shrink-0`}>
              {rsi.toFixed(1)} <span className="hidden sm:inline sm:ml-1">({rsiLabel})</span>
            </div>
          </div>
          <div className="h-1.5 w-full bg-surface overflow-hidden flex mb-2">
            <div className="h-full bg-accent/40" style={{ width: rsiBarWidth }}></div>
          </div>
          <p className="font-body text-[12px] text-text-muted mt-2 leading-relaxed">
            {mode === 'beginner'
              ? (rsi >= 70 ? 'The price has gone up too fast recently. It might be slightly expensive right now.' : rsi <= 30 ? 'The stock has been sold heavily. It might be cheap, but be careful.' : 'The stock price is moving at a normal, healthy pace.')
              : (rsi >= 70 ? 'Elevated RSI suggests potential overvaluation in the short term.' : rsi <= 30 ? 'Low RSI suggests the asset may be undervalued.' : 'RSI is in a healthy neutral range.')}
          </p>
        </div>

        {/* Price Trend */}
        <div>
          <div className="flex justify-between items-center mb-3 gap-2">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <span className="font-mono text-[12px] tracking-[0.5px] text-text-secondary leading-tight truncate">
                Price Trend
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
            {data.trend === 'up' ? 'Consistent upward channel established over the current period.' : data.trend === 'down' ? 'Downward momentum detected. Exercise caution.' : 'No significant directional movement observed.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StockChartCard;
