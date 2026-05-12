import { TriangleAlert, ShieldAlert, CheckCircle2 } from 'lucide-react';

const AntiFomoSection = () => {
  return (
    <section id="about" className="py-24 bg-bg-dark border-t border-card-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Text */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Silence the <span className="text-[#fca5a5]">Market Noise.</span>
            </h2>
            <p className="text-text-muted mb-10 leading-relaxed">
              Emotional investing is the #1 reason for retail underperformance. InvestSense AI acts as your analytical buffer, providing objective risk rationale when the market enters a frenzy.
            </p>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="mt-1">
                  <div className="w-6 h-6 rounded-full bg-danger/20 flex items-center justify-center">
                    <ShieldAlert className="w-3.5 h-3.5 text-danger" />
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Reduce Impulse</h4>
                  <p className="text-sm text-text-muted">Recognize high-risk situations before hitting buy on pure momentum.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="mt-1">
                  <div className="w-6 h-6 rounded-full bg-brand-blue/20 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-blue" />
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Data-Backed Logic</h4>
                  <p className="text-sm text-text-muted">Receive a neutral, unbiased analysis report before any major market movement.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card Mockup */}
          <div className="relative mt-12 lg:mt-0">
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-danger/5 via-transparent to-transparent pointer-events-none"></div>
             {/* The Card */}
             <div className="relative bg-card-dark border border-card-border rounded-lg p-4 sm:p-6 shadow-2xl group transition-all duration-500 hover:border-brand-blue/30">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent rounded-lg pointer-events-none"></div>
                
                <h3 className="text-sm font-bold text-brand-blue mb-6 relative z-10">Risk Analysis</h3>

                <div className="space-y-4 mb-8 relative z-10">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-muted">Current Risk Level</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold text-danger bg-danger/10 border border-danger/20 rounded tracking-wider">
                      EXTREME
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-muted">Volatility</span>
                    <span className="text-sm font-semibold text-white">High</span>
                  </div>
                </div>

                <div className="bg-[#0f1115] border-l-2 border-danger rounded-r-lg p-4 relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <TriangleAlert className="w-4 h-4 text-danger" />
                    <h4 className="text-[10px] font-bold text-danger uppercase tracking-wider">
                      Anti-Fomo Reminder
                    </h4>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Market sentiment is currently detached from fundamentals. <strong className="text-white">Wait for price correction</strong> before establishing new positions.
                  </p>
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AntiFomoSection;
