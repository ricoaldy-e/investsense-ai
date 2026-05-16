import { TrendingUp, AlertTriangle, Activity, Lightbulb, PanelRightClose, PanelRightOpen } from 'lucide-react';

const InsightPanel = ({ isOpen, onToggle }) => {
  return (
    <>
      {/* Toggle button — always visible */}
      <button
        onClick={onToggle}
        className="hidden lg:flex fixed right-0 top-1/2 -translate-y-1/2 z-30 items-center justify-center w-6 h-14 bg-card-dark border border-card-border border-r-0 text-text-muted hover:text-accent transition-colors"
        style={{ display: isOpen ? 'none' : undefined }}
      >
        <PanelRightOpen className="w-3.5 h-3.5" />
      </button>

      {/* Panel */}
      <aside className={`
        ${isOpen ? 'w-[280px]' : 'w-0'}
        hidden lg:block flex-shrink-0 border-l border-card-border bg-surface
        overflow-hidden transition-all duration-300
      `}>
        <div className="w-[280px] h-full overflow-y-auto">
          {/* Panel header */}
          <div className="p-4 border-b border-hairline flex items-center justify-between">
            <p className="font-mono text-[9px] tracking-[2px] uppercase text-text-muted">
              MARKET CONTEXT
            </p>
            <button
              onClick={onToggle}
              className="text-text-muted hover:text-text-secondary transition-colors"
            >
              <PanelRightClose className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* Global Sentiment */}
            <div className="border border-card-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-3 h-3 text-accent" />
                <p className="font-mono text-[9px] tracking-[2px] uppercase text-text-muted">
                  GLOBAL SENTIMENT
                </p>
              </div>
              <div className="space-y-2.5">
                {[
                  { market: 'IDX Composite', value: '+0.32%', positive: true },
                  { market: 'S&P 500', value: '-0.14%', positive: false },
                  { market: 'Nikkei 225', value: '+0.58%', positive: true },
                ].map((item) => (
                  <div key={item.market} className="flex justify-between items-center">
                    <span className="font-mono text-[10px] text-text-secondary tracking-[0.5px]">
                      {item.market}
                    </span>
                    <span className={`font-mono text-[11px] tracking-[1px] ${item.positive ? 'text-success' : 'text-danger'}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Assets */}
            <div className="border border-card-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-3 h-3 text-accent" />
                <p className="font-mono text-[9px] tracking-[2px] uppercase text-text-muted">
                  TRENDING ASSETS
                </p>
              </div>
              <div className="space-y-2.5">
                {[
                  { ticker: 'BBCA', sector: 'Banking', change: '+1.2%' },
                  { ticker: 'TLKM', sector: 'Telecom', change: '-0.8%' },
                  { ticker: 'ASII', sector: 'Automotive', change: '+0.5%' },
                ].map((item) => (
                  <div key={item.ticker} className="flex justify-between items-center">
                    <div>
                      <span className="font-mono text-[11px] text-text-main tracking-[1px]">
                        {item.ticker}
                      </span>
                      <span className="font-mono text-[9px] text-text-muted ml-2">
                        {item.sector}
                      </span>
                    </div>
                    <span className={`font-mono text-[10px] tracking-[1px] ${item.change.startsWith('+') ? 'text-success' : 'text-danger'}`}>
                      {item.change}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Alert */}
            <div className="border border-card-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-3 h-3 text-danger" />
                <p className="font-mono text-[9px] tracking-[2px] uppercase text-danger">
                  RISK ALERT
                </p>
              </div>
              <p className="font-body text-[12px] text-text-secondary leading-relaxed">
                Elevated volatility in emerging market currencies. Monitor IDR/USD movement before new positions.
              </p>
            </div>

            {/* AI Insight Summary */}
            <div className="border border-card-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-3 h-3 text-accent" />
                <p className="font-mono text-[9px] tracking-[2px] uppercase text-text-muted">
                  AI INSIGHT
                </p>
              </div>
              <p className="font-mono text-[12px] text-success tracking-[0.5px] mb-2">
                Positive Momentum
              </p>
              <p className="font-body text-[12px] text-text-secondary leading-relaxed">
                Banking sector sentiment remains resilient. Domestic consumption data supports positive medium-term outlook for BBCA and peers.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default InsightPanel;
