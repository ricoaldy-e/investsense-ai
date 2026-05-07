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
    <div className="bg-card-dark border border-card-border rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#2a2a2a] rounded-xl flex items-center justify-center border border-gray-700 shrink-0">
            {/* Placeholder for Apple Logo */}
            <span className="text-white font-bold text-lg"></span>
          </div>
          <div className="min-w-0">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-1 truncate">Apple Inc. (AAPL)</h2>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-gray-300 font-medium">$189.43</span>
              <span className="text-danger font-medium text-sm">-1.24% today</span>
            </div>
          </div>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex bg-[#1a1a1a] rounded-lg p-1 border border-card-border w-full sm:w-auto">
          {ranges.map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`flex-1 sm:flex-none px-3 py-2 md:px-4 text-xs md:text-sm font-medium rounded-md transition-colors text-center ${
                timeRange === range
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'text-text-muted hover:text-white'
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
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <YAxis domain={['dataMin - 10', 'dataMax + 10']} hide />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              strokeWidth={3}
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
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-gray-300">RSI Intensity</span>
              <Info className="w-4 h-4 text-text-muted" />
            </div>
            <span className="text-sm font-semibold text-[#f87171]">78.4 (Hot)</span>
          </div>
          <div className="h-2 w-full bg-card-border rounded-full overflow-hidden flex mb-2">
            <div className="h-full bg-brand-blue w-3/4 opacity-50 rounded-l-full"></div>
            <div className="h-full bg-[#f87171] w-1/4 rounded-r-full"></div>
          </div>
          <p className="text-xs text-text-muted italic">A "Hot" signal suggests waiting for a lower price.</p>
        </div>

        {/* Price Trend */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-gray-300">Price Trend</span>
              <Info className="w-4 h-4 text-text-muted" />
            </div>
            <span className="text-sm font-semibold text-brand-blue">Steady Growth</span>
          </div>
          <div className="h-2 w-full bg-card-border rounded-full overflow-hidden mb-2">
            <div className="h-full bg-brand-blue w-[85%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
          </div>
          <p className="text-xs text-text-muted italic">The stock is generally moving upwards over time.</p>
        </div>
      </div>
    </div>
  );
};

export default StockChartCard;
