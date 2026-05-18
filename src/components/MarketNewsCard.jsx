const MarketNewsCard = ({ data }) => {
  if (!data) return null;

  const newsItems = (data.news || []).map(item => ({
    ...item,
    sentimentLabel: item.sentiment === 'positive' ? 'BULLISH' : item.sentiment === 'negative' ? 'BEARISH' : 'NEUTRAL',
    sentimentStyle: item.sentiment === 'positive' ? 'text-accent' : item.sentiment === 'negative' ? 'text-danger' : 'text-text-muted',
  }));

  return (
    <div className="bg-card-dark border border-card-border p-4 sm:p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h3 className="font-mono text-[11px] tracking-[2px] uppercase text-accent">Market News</h3>
        <button className="font-mono text-[10px] tracking-[1.5px] uppercase text-text-muted hover:text-text-main transition-colors">
          See All
        </button>
      </div>

      <div className="flex-1 space-y-0 divide-y divide-hairline">
        {newsItems.length === 0 ? (
          <p className="font-body text-[14px] text-text-muted py-4">No news available for this stock.</p>
        ) : (
          newsItems.map((item) => (
            <div key={item.id} className="group cursor-pointer py-4 first:pt-0 last:pb-0">
              <div className="flex justify-between items-center mb-2">
                <span className={`font-mono text-[10px] tracking-[2px] uppercase ${item.sentimentStyle}`}>
                  {item.sentimentLabel}
                </span>
                <span className="font-mono text-[10px] tracking-[1px] text-text-muted">{item.time}</span>
              </div>
              <h4 className="font-body text-[14px] text-text-secondary leading-snug group-hover:text-text-main transition-colors">
                {item.title}
              </h4>
              {item.source && (
                <p className="font-mono text-[10px] text-text-muted mt-1.5 tracking-[1px]">{item.source}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MarketNewsCard;
