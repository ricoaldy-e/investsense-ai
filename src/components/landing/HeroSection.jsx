import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
      {/* Subtle Grid / Noise Background could go here, replacing the heavy blur orb */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-blue/5 via-bg-dark to-bg-dark pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 tracking-normal">
              Invest smarter,<br />
              stop the <span className="text-brand-blue">FOMO.</span>
            </h1>
            <p className="text-base md:text-lg text-text-muted mb-8 max-w-xl leading-relaxed">
              A simple AI-powered stock analysis platform built to help you navigate market noise and avoid emotional investment mistakes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-start">
              <Link 
                to="/login"
                className="px-8 py-3.5 text-sm md:text-base font-medium bg-brand-blue text-white rounded-md hover:bg-cyan-700 transition-colors shadow-sm text-center border border-transparent hover:border-brand-blue/30"
              >
                Start Analyzing
              </Link>
            </div>
          </div>

          {/* Right Mockup */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none mt-12 lg:mt-0">
            <div className="relative rounded-lg bg-card-dark border border-card-border p-2 shadow-2xl transition-all duration-500 hover:border-card-border/80">
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent rounded-lg pointer-events-none"></div>
              {/* Dashboard Placeholder Image */}
              <div className="bg-[#0f1115] rounded-md aspect-[4/3] border border-card-border flex items-center justify-center overflow-hidden relative">
                 <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMGg0MHY0MEgwem0yMCAyMGgyMHYyMEgyMHoiIGZpbGw9IiMxYTFkMjQiIGZpbGwtb3BhY2l0eT0iMC40Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+')] opacity-20"></div>
                 {/* Fake dashboard skeleton */}
                 <div className="absolute inset-4 flex flex-col gap-4">
                    <div className="h-8 bg-gray-800/50 rounded w-1/3"></div>
                    <div className="flex-1 flex gap-4">
                      <div className="flex-1 bg-gray-800/50 rounded flex flex-col justify-end p-4">
                        <div className="w-full h-1/2 border-t border-brand-blue bg-gradient-to-t from-brand-blue/10 to-transparent"></div>
                      </div>
                      <div className="w-1/3 flex flex-col gap-4">
                        <div className="flex-1 bg-gray-800/50 rounded"></div>
                        <div className="flex-1 bg-gray-800/50 rounded"></div>
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

export default HeroSection;
