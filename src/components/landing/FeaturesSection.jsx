import { Sparkles, BarChart3, TriangleAlert, BotMessageSquare } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <Sparkles className="w-6 h-6 text-brand-blue" />,
      title: "AI Insights",
      description: "AI-generated explanations that simplify stock analysis for beginner investors.",
      badge: "AI POWERED"
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-brand-blue" />,
      title: "Sentiment Analysis",
      description: "Analyze financial news sentiment and classify signals into positive, neutral, or negative sentiment."
    },
    {
      icon: <TriangleAlert className="w-6 h-6 text-danger" />,
      title: "Behavioral Risk Analysis",
      description: "Help users avoid emotional investing and recognize risky market conditions."
    },
    {
      icon: <BotMessageSquare className="w-6 h-6 text-brand-blue" />,
      title: "AI Chatbot",
      description: "Interactive AI assistant for stock-related explanations and analysis guidance."
    }
  ];

  return (
    <section id="features" className="py-20 bg-bg-dark border-t border-card-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">Advanced Analysis Core</h2>
          <p className="text-text-muted text-lg">Engineered for sophisticated data interpretation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="relative bg-card-dark border border-card-border rounded-xl sm:rounded-2xl p-4 sm:p-6 group transition-all duration-300 hover:border-brand-blue/30 hover:bg-[#12141a] overflow-hidden"
            >
              {/* Subtle hover gradient inside the card */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              
              <div className="relative z-10 flex justify-between items-start mb-8">
                <div className="w-14 h-14 rounded-2xl bg-bg-dark border border-gray-800 flex items-center justify-center group-hover:scale-110 group-hover:border-brand-blue/30 transition-all duration-300 shadow-lg">
                  {feature.icon}
                </div>
                {feature.badge && (
                  <span className="px-3 py-1.5 text-[10px] font-bold text-brand-blue bg-brand-blue/10 border border-brand-blue/20 rounded-md uppercase tracking-widest shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                    {feature.badge}
                  </span>
                )}
              </div>
              <h3 className="relative z-10 text-xl font-bold text-white mb-3 tracking-tight">{feature.title}</h3>
              <p className="relative z-10 text-text-muted leading-relaxed text-sm md:text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
