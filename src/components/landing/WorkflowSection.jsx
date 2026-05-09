const WorkflowSection = () => {
  const steps = [
    { num: "01", title: "Search Stock", desc: "Input any publicly listed ticker for deep analysis." },
    { num: "02", title: "Analyze Sentiment", desc: "AI scans news, data, and official filings." },
    { num: "03", title: "Receive Insights", desc: "Get distilled explanations of stock health." },
    { num: "04", title: "Rational Action", desc: "Make a calculated, non-emotional decision." }
  ];

  return (
    <section id="workflow" className="py-24 bg-bg-dark border-t border-card-border/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">The Rational Workflow</h2>
          <p className="text-text-muted">Your step-by-step to noise-free investing.</p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-card-border to-transparent -translate-y-1/2"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-card-dark border-2 border-brand-blue flex items-center justify-center text-brand-blue font-bold text-sm mb-6 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                  {step.num}
                </div>
                <h3 className="text-white font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-text-muted max-w-[200px]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;
