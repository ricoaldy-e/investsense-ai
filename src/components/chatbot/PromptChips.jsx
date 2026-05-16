const PromptChips = ({ onSelect }) => {
  const prompts = [
    'Analyze BBCA Sentiment',
    'List Macro Risks',
    'Indicator Insights',
    'Market News Summary',
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          onClick={() => onSelect(prompt)}
          className="font-mono text-[10px] tracking-[1px] text-text-muted border border-card-border px-3.5 py-1.5 hover:text-accent hover:border-accent/40 transition-all duration-200"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
};

export default PromptChips;
