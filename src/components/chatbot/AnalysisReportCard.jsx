import { TrendingUp, BarChart3, ShieldCheck, Bookmark, Eye } from 'lucide-react';

const AnalysisReportCard = () => {
  return (
    <div className="space-y-6">
      {/* User query */}
      <div className="flex justify-end">
        <div className="max-w-[85%] bg-card-dark border border-card-border p-5">
          <p className="font-mono text-[9px] tracking-[2px] uppercase text-text-muted mb-2">YOUR QUERY</p>
          <p className="font-body text-[14px] text-text-main leading-relaxed">
            Evaluate the current risk/reward ratio for BBCA considering recent volatility and market sentiment shifts in the Indonesian banking sector.
          </p>
        </div>
      </div>

      {/* AI Analysis Report */}
      <div className="max-w-[90%]">
        {/* Report header */}
        <div className="border border-card-border">
          <div className="border-b border-hairline px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
              <p className="font-mono text-[10px] tracking-[2px] uppercase text-accent">
                AI ANALYSIS REPORT
              </p>
            </div>
            <p className="font-mono text-[9px] text-text-muted tracking-[1px]">
              BBCA.JK
            </p>
          </div>

          {/* Analysis body */}
          <div className="p-5 space-y-6">
            {/* Summary */}
            <p className="font-body text-[14px] text-text-secondary leading-relaxed">
              Based on current technical indicators and fundamental analysis, BBCA shows a moderately positive outlook with manageable risk levels. The banking sector is experiencing stable macro conditions despite global volatility.
            </p>

            {/* Indicators grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-card-border">
              {/* Technical */}
              <div className="bg-bg-dark p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-3.5 h-3.5 text-accent" />
                  <p className="font-mono text-[9px] tracking-[2px] uppercase text-text-muted">
                    TECHNICAL
                  </p>
                </div>
                <p className="font-mono text-[18px] text-success tracking-[1px] mb-1">
                  POSITIVE
                </p>
                <p className="font-body text-[12px] text-text-muted leading-relaxed">
                  Positive momentum signal detected on MACD crossover
                </p>
              </div>

              {/* Fundamental */}
              <div className="bg-bg-dark p-4">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-3.5 h-3.5 text-accent" />
                  <p className="font-mono text-[9px] tracking-[2px] uppercase text-text-muted">
                    FUNDAMENTAL
                  </p>
                </div>
                <p className="font-mono text-[18px] text-accent tracking-[1px] mb-1">
                  MODERATE
                </p>
                <p className="font-body text-[12px] text-text-muted leading-relaxed">
                  Positive sentiment with stable earnings growth
                </p>
              </div>

              {/* Confidence */}
              <div className="bg-bg-dark p-4">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                  <p className="font-mono text-[9px] tracking-[2px] uppercase text-text-muted">
                    CONFIDENCE
                  </p>
                </div>
                <p className="font-mono text-[18px] text-text-main tracking-[1px] mb-1">
                  72%
                </p>
                <div className="w-full h-[2px] bg-card-border mt-2">
                  <div className="h-full bg-accent" style={{ width: '72%' }} />
                </div>
              </div>
            </div>

            {/* Key findings */}
            <div>
              <p className="font-mono text-[9px] tracking-[2px] uppercase text-text-muted mb-3">
                KEY FINDINGS
              </p>
              <ul className="space-y-2.5">
                {[
                  'RSI at 58 — within healthy range, no overbought signal',
                  'Positive momentum on 20-day EMA alignment',
                  'Banking sector index shows resilient domestic demand',
                  'Volatility index remains below historical average',
                ].map((finding, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="font-mono text-[10px] text-accent mt-0.5">—</span>
                    <span className="font-body text-[13px] text-text-secondary leading-relaxed">
                      {finding}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2 border-t border-hairline">
              <button className="flex items-center gap-2 font-mono text-[10px] tracking-[2px] uppercase text-accent border border-accent/40 rounded-full px-5 py-2 hover:bg-accent hover:text-bg-dark transition-all duration-200">
                <Eye className="w-3 h-3" />
                VIEW INSIGHTS
              </button>
              <button className="flex items-center gap-2 font-mono text-[10px] tracking-[2px] uppercase text-text-muted border border-card-border rounded-full px-5 py-2 hover:text-text-secondary hover:border-text-muted transition-all duration-200">
                <Bookmark className="w-3 h-3" />
                SAVE ANALYSIS
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisReportCard;
