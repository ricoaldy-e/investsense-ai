import { Sparkles, BarChart3, TriangleAlert, BotMessageSquare } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const FeaturesSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const features = [
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "Contextual AI Synthesis",
      description: "Translates complex fundamental metrics and quantitative indicators into clear, actionable intelligence.",
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: "Multi-Source Sentiment Telemetry",
      description: "Aggregates global news flow and social sentiment into classified directional signals (Bullish, Neutral, Bearish).",
    },
    {
      icon: <TriangleAlert className="w-5 h-5" />,
      title: "Behavioral Risk Profiling",
      description: "Evaluates market conditions for speculative anomalies and irrational exuberance to protect capital from retail impulses.",
    },
    {
      icon: <BotMessageSquare className="w-5 h-5" />,
      title: "Conversational Financial Intelligence",
      description: "Interactive, context-aware AI engine providing real-time technical clarifications and personalized analysis support.",
    }
  ];

  return (
    <section id="features" className="py-32 lg:py-40" ref={sectionRef}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-20"
        >
          <p className="font-mono text-[11px] tracking-[3px] uppercase text-text-muted mb-4">
            CORE CAPABILITIES
          </p>
          <h2 className="font-display text-[32px] md:text-[40px] font-light text-text-main tracking-[1.5px] uppercase leading-tight">
            Analysis Engine
          </h2>
        </motion.div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-card-border">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.15 + index * 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="bg-bg-dark p-8 md:p-10 lg:p-12 group"
            >
              
              <div className="text-accent mb-6">
                {feature.icon}
              </div>

              
              <h3 className="font-display text-[20px] font-medium text-text-main tracking-[0.5px] mb-4">
                {feature.title}
              </h3>

              
              <p className="font-body text-[15px] text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
