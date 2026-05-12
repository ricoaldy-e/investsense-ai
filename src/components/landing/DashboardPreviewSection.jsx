const DashboardPreviewSection = () => {
  return (
    <section className="py-24 bg-bg-dark border-t border-card-border/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Precision Analysis Dashboard</h2>
          <p className="text-text-muted md:text-lg max-w-2xl mx-auto">Optimized for rapid clinical analysis without distraction. Built on a foundation of clarity and speed.</p>
        </div>

        <div className="relative mx-auto max-w-6xl perspective-1000">
          {/* Subtle Accent Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-blue/5 via-transparent to-transparent pointer-events-none"></div>

          {/* Outer Glass Frame */}
          <div className="relative rounded-lg bg-gradient-to-b from-[#2a303c] to-[#12141a] p-[1px] shadow-2xl border border-card-border/50 transform transition-transform duration-700 hover:scale-[1.02]">
            <div className="rounded-[7px] bg-card-dark p-2 sm:p-4 overflow-hidden">
              <div className="bg-[#0f1115] rounded-xl aspect-[16/9] md:aspect-[21/9] border border-gray-800 flex items-center justify-center overflow-hidden relative shadow-inner">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMGg0MHY0MEgwem0yMCAyMGgyMHYyMEgyMHoiIGZpbGw9IiMxYTFkMjQiIGZpbGwtb3BhY2l0eT0iMC40Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+')] opacity-10"></div>
                {/* UI Mockup Details */}
                <div className="absolute inset-4 sm:inset-6 flex gap-4 sm:gap-6">
                  {/* Sidebar Mock */}
                  <div className="hidden sm:block w-48 bg-gray-800/30 rounded-lg"></div>
                  {/* Main Content Mock */}
                  <div className="flex-1 flex flex-col gap-4 sm:gap-6">
                    {/* Header Mock */}
                    <div className="h-12 bg-gray-800/30 rounded-lg"></div>
                    <div className="flex-1 flex flex-col md:flex-row gap-4 sm:gap-6">
                      {/* Chart Mock */}
                      <div className="flex-[2] bg-gray-800/30 rounded-lg relative overflow-hidden">
                        <div className="absolute bottom-0 w-full h-1/2 border-t border-brand-blue/50 bg-gradient-to-t from-brand-blue/20 to-transparent"></div>
                      </div>
                      {/* Side Cards Mock */}
                      <div className="flex-1 flex flex-col gap-4 sm:gap-6">
                        <div className="flex-1 bg-gray-800/30 rounded-lg flex items-center justify-center">
                          {/* Circular mock */}
                          <div className="w-16 h-16 rounded-full border-4 border-gray-700 border-t-brand-blue border-r-brand-blue"></div>
                        </div>
                        <div className="flex-1 bg-gray-800/30 rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreviewSection;
