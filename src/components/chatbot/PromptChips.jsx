/**
 * PromptChips — Dynamic suggested prompts for the chatbot.
 * 
 * If user has a stock context (from Dashboard via localStorage),
 * prompts are personalized with that ticker.
 * Otherwise, universal analytical prompts are shown (matching SRS §3.4).
 */
const PromptChips = ({ onSelect, useStockContext }) => {
  const stockContext = useStockContext ? (localStorage.getItem('lastViewedStock') || null) : null;

  // Dynamic prompts based on context
  const prompts = stockContext
    ? [
        `Analyze ${stockContext} sentiment`,
        `Explain ${stockContext} risk level`,
        `${stockContext} technical indicators`,
        'Explain RSI indicator',
        'Explain market volatility',
      ]
    : [
        'Analyze market trends',
        'Explain RSI indicator',
        'Summarize market sentiment',
        'Explain market volatility',
        'Analyze stock risk',
      ];

  return (
    <div className="flex flex-wrap gap-2">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          onClick={() => onSelect(prompt)}
          className="font-mono text-[10px] tracking-[1px] text-text-muted border border-card-border px-3 py-1.5 hover:text-accent hover:border-accent/40 transition-all duration-200"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
};

export default PromptChips;
