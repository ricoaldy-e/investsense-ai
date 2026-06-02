import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Search, BarChart2, Star, Bot, Shield, TrendingUp, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] },
});

const sections = [
  {
    icon: BookOpen,
    title: 'Getting Started',
    steps: [
      { label: 'Create an Account', desc: 'Register using your email address and a strong password (min. 8 characters, including uppercase, number, and symbol). Your data is encrypted and never shared.' },
      { label: 'Log In', desc: 'Use your registered email and password to log in. Enabling "Remember Me" keeps your session active for up to 7 days so you do not need to sign in each visit.' },
      { label: 'Choose Your Mode', desc: 'Select Beginner Mode for simplified explanations or Pro Mode for full technical detail. You can switch modes anytime from the sidebar or top navigation bar.' },
    ],
  },
  {
    icon: LayoutGrid,
    title: 'Stock Catalog',
    steps: [
      { label: 'Browse Stocks', desc: 'The Stock Catalog lists all available IDX (Indonesia Stock Exchange) tickers. Use the search bar to filter by code or company name in real time.' },
      { label: 'View Stock Detail', desc: 'Click on any stock card to open a detailed view containing price history, RSI indicators, sentiment analysis, and an AI-generated investment insight.' },
    ],
  },
  {
    icon: Star,
    title: 'Watchlist',
    steps: [
      { label: 'Add to Watchlist', desc: 'From any stock detail page, click the star icon to add the stock to your personal Watchlist for quick future reference.' },
      { label: 'Manage Your Watchlist', desc: 'Open the Watchlist page from the sidebar. You can remove stocks, sort by performance, or click any entry to re-open its detail panel.' },
    ],
  },
  {
    icon: TrendingUp,
    title: 'Market Insight',
    steps: [
      { label: 'Read Market News', desc: 'The Market Insight page aggregates curated news articles from verified Indonesian financial media sources, updated periodically by our data pipeline.' },
      { label: 'Sentiment Score', desc: 'Each article is tagged with an AI-computed sentiment label (Positive, Neutral, or Negative) so you can gauge overall market mood at a glance.' },
    ],
  },
  {
    icon: Bot,
    title: 'AI Assistant',
    steps: [
      { label: 'Open the AI Panel', desc: 'Click the robot icon in the top-right area of your dashboard or tap the AI icon on mobile to open the conversational assistant panel.' },
      { label: 'Ask Questions', desc: 'Type any stock-related question, such as "Is BBCA a good investment right now?" The AI will respond based on available market data, sentiment, and risk signals — not personal financial advice.' },
      { label: 'Supported Tickers', desc: 'The AI assistant only responds to valid IDX tickers. If you ask about an unlisted code, it will notify you that the ticker is not in our database.' },
    ],
  },
  {
    icon: Shield,
    title: 'Account & Security',
    steps: [
      { label: 'Session Management', desc: 'Your login session is protected by short-lived Access Tokens and long-lived Refresh Tokens stored in HTTP-Only cookies. This industry-standard architecture protects you against XSS attacks.' },
      { label: 'Automatic Logout', desc: 'If your session expires, the platform will redirect you to the login page and display a clear notification explaining the reason. This is a security feature, not an error.' },
      { label: 'Manual Logout', desc: 'Always log out manually (via the sidebar logout button) when using a shared or public device to ensure your account cannot be accessed by others.' },
    ],
  },
];

const UserGuide = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen bg-bg-dark text-text-main">
      <div className="fixed top-0 left-0 right-0 h-[1px] bg-card-border z-10" />

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16 pt-20">
        <motion.div {...fadeUp(0)} className="mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[2px] uppercase text-text-muted hover:text-accent transition-colors duration-300"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Home
          </Link>
        </motion.div>

        <motion.div {...fadeUp(0.1)} className="mb-12 pt-4">
          <p className="font-mono text-[10px] tracking-[3px] uppercase text-accent mb-4">Documentation</p>
          <h1 className="font-display text-[32px] md:text-[44px] font-light text-text-main leading-tight tracking-[1px] mb-5">
            User Guide
          </h1>
          <div className="w-12 h-[1px] bg-accent mb-6" />
          <p className="font-body text-[15px] text-text-secondary leading-relaxed max-w-2xl">
            Everything you need to navigate InvestSense AI confidently — from setting up your account to interpreting AI-generated market intelligence.
          </p>
        </motion.div>

        <div className="space-y-12">
          {sections.map((section, sIdx) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + sIdx * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
                className="border border-card-border bg-surface/30 p-6 md:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 border border-accent/30 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-accent" />
                  </div>
                  <h2 className="font-mono text-[13px] tracking-[2px] uppercase text-text-main">
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-6">
                  {section.steps.map((step, stepIdx) => (
                    <div key={step.label} className="flex gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-5 h-5 border border-card-border flex items-center justify-center">
                          <span className="font-mono text-[9px] text-text-muted">{stepIdx + 1}</span>
                        </div>
                      </div>
                      <div>
                        <p className="font-mono text-[11px] tracking-[1.5px] uppercase text-text-main mb-1.5">
                          {step.label}
                        </p>
                        <p className="font-body text-[14px] text-text-secondary leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div {...fadeUp(0.5)} className="mt-16 pt-8 border-t border-card-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="font-mono text-[10px] tracking-[1.5px] text-text-muted uppercase">
            © {new Date().getFullYear()} InvestSense AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="font-mono text-[10px] tracking-[1.5px] uppercase text-text-muted hover:text-accent transition-colors duration-300">Terms</Link>
            <span className="text-card-border">·</span>
            <Link to="/privacy" className="font-mono text-[10px] tracking-[1.5px] uppercase text-text-muted hover:text-accent transition-colors duration-300">Privacy</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserGuide;
