import { Link } from 'react-router-dom';

const FinalCTASection = () => {
  return (
    <section className="py-24 bg-bg-dark border-t border-card-border/50 relative overflow-hidden">
      {/* Subtle Background Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-brand-blue/5 via-transparent to-transparent pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="bg-card-dark border border-card-border rounded-lg p-10 md:p-16 shadow-2xl">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Master your investment psychology.
          </h2>
          <p className="text-text-muted mb-10 max-w-2xl mx-auto">
            Join 25,000+ rational investors using InvestSense AI to protect their capital from impulsive decisions.
          </p>
          <Link 
            to="/login"
            className="inline-block px-8 py-3.5 text-base font-medium bg-brand-blue text-white rounded-md hover:bg-cyan-700 transition-colors shadow-sm border border-transparent hover:border-brand-blue/30"
          >
            Start Analyzing Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
