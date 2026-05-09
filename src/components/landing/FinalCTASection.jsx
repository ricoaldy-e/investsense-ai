import { Link } from 'react-router-dom';

const FinalCTASection = () => {
  return (
    <section className="py-24 bg-bg-dark border-t border-card-border/50 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-blue/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="bg-card-dark border border-card-border rounded-3xl p-10 md:p-16 shadow-2xl">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Master your investment psychology.
          </h2>
          <p className="text-text-muted mb-10 max-w-2xl mx-auto">
            Join 25,000+ rational investors using InvestSense AI to protect their capital from impulsive decisions.
          </p>
          <Link 
            to="/dashboard"
            className="inline-block px-8 py-4 text-base font-bold bg-brand-blue text-white rounded-lg hover:bg-blue-600 hover:scale-105 transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)]"
          >
            Start Analyzing Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
