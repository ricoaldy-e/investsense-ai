import { useState } from 'react';
import { Info } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

const data = [
  { value: 150 }, { value: 148 }, { value: 145 }, { value: 142 },
  { value: 143 }, { value: 147 }, { value: 155 }, { value: 160 },
  { value: 162 }, { value: 165 }, { value: 175 }, { value: 185 },
  { value: 180 }, { value: 170 }, { value: 165 }, { value: 160 },
  { value: 158 }, { value: 155 }, { value: 152 }, { value: 150 },
];

const StockChartCard = () => {
  const [timeRange, setTimeRange] = useState('1D');
  const ranges = ['1H', '1D', '1W', '1M'];

  return (
    <div className="bg-card-dark border border-card-border p-4 sm:p-6 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-surface border border-card-border flex items-center justify-center shrink-0">
            {/* Placeholder for Logo */}
            <span className="font-mono text-[11px] text-text-muted tracking-[1px]">A</span>
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-[20px] font-medium text-text-main tracking-[0.5px] mb-1 truncate">Apple Inc. (AAPL)</h2>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-mono text-[14px] text-text-main tracking-[0.5px]">$189.43</span>
              <span className="font-mono text-[12px] text-danger tracking-[0.5px]">-1.24%</span>
            </div>
          </div>
        </div>
        
        {/* Time Range Selector */}
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
      </div>

      {/* Chart Area */}
      <div className="flex-1 w-full min-h-[200px] md:min-h-[250px] mb-8 relative -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7b8fa8" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#7b8fa8" stopOpacity={0}/>
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
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[12px] tracking-[0.5px] text-text-secondary">RSI Indicator</span>
              <Info className="w-3.5 h-3.5 text-text-muted" />
            </div>
            <span className="font-mono text-[12px] text-danger tracking-[0.5px]">78.4 (Overbought)</span>
          </div>
          <div className="h-1.5 w-full bg-surface overflow-hidden flex mb-2">
            <div className="h-full bg-accent/40 w-3/4"></div>
            <div className="h-full bg-danger w-1/4"></div>
          </div>
          <p className="font-body text-[12px] text-text-muted mt-2 leading-relaxed">Elevated RSI suggests potential overvaluation in the short term.</p>
        </div>

        {/* Price Trend */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[12px] tracking-[0.5px] text-text-secondary">Price Trend</span>
              <Info className="w-3.5 h-3.5 text-text-muted" />
            </div>
            <span className="font-mono text-[12px] text-accent tracking-[0.5px]">Steady Growth</span>
          </div>
          <div className="h-1.5 w-full bg-surface overflow-hidden mb-2">
            <div className="h-full bg-accent/60 w-[85%]"></div>
          </div>
          <p className="font-body text-[12px] text-text-muted mt-2 leading-relaxed">Consistent upward channel established over the current period.</p>
        </div>
      </div>
    </div>
  );
};

export default StockChartCard;
