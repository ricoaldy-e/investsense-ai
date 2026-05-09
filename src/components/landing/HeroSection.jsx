import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-brand-blue/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 text-xs font-bold text-brand-blue bg-brand-blue/10 border border-brand-blue/20 rounded-full tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse"></span>
              AI-Powered Decision Support
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 tracking-normal">
              Invest smarter,<br />
              stop the <span className="text-brand-blue">FOMO.</span>
            </h1>
            <p className="text-base md:text-lg text-text-muted mb-8 max-w-xl leading-relaxed">
              A simple AI-powered stock analysis platform built to help you navigate market noise and avoid emotional investment mistakes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-start">
              <Link 
                to="/dashboard"
                className="px-8 py-4 text-sm md:text-base font-bold bg-brand-blue text-white rounded-xl hover:bg-blue-600 hover:-translate-y-0.5 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] text-center ring-1 ring-brand-blue/50"
              >
                Start Analyzing
              </Link>
            </div>
          </div>

          {/* Right Mockup */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none mt-12 lg:mt-0 perspective-1000">
            <div className="relative rounded-2xl bg-card-dark border border-card-border p-2 shadow-2xl transform rotate-y-[-10deg] rotate-x-[5deg] transition-transform duration-700 hover:rotate-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/10 to-transparent rounded-2xl pointer-events-none"></div>
              {/* Dashboard Placeholder Image */}
              <div className="bg-[#0f1115] rounded-xl aspect-[4/3] border border-gray-800 flex items-center justify-center overflow-hidden relative">
                 <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMGg0MHY0MEgwem0yMCAyMGgyMHYyMEgyMHoiIGZpbGw9IiMxYTFkMjQiIGZpbGwtb3BhY2l0eT0iMC40Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+')] opacity-20"></div>
                 {/* Fake dashboard skeleton */}
                 <div className="absolute inset-4 flex flex-col gap-4">
                    <div className="h-8 bg-gray-800/50 rounded w-1/3"></div>
                    <div className="flex-1 flex gap-4">
                      <div className="flex-1 bg-gray-800/50 rounded flex flex-col justify-end p-4">
                        <div className="w-full h-1/2 border-b-2 border-brand-blue shadow-[0_-10px_20px_rgba(59,130,246,0.2)]"></div>
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
