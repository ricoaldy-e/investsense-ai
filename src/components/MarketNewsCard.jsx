const MarketNewsCard = () => {
  const newsItems = [
    {
      id: 1,
      sentiment: 'BULLISH',
      time: '2h ago',
      title: 'Apple Announces New AI Integration for Upcoming iPhone Models',
      sentimentStyle: 'text-accent',
    },
    {
      id: 2,
      sentiment: 'BEARISH',
      time: '5h ago',
      title: 'Global Supply Chain Slowdown Could Impact Q4 Tech Earnings',
      sentimentStyle: 'text-danger',
    },
    {
      id: 3,
      sentiment: 'NEUTRAL',
      time: '8h ago',
      title: 'Federal Reserve Maintains Current Interest Rates Amid Inflation Data',
      sentimentStyle: 'text-text-muted',
    },
  ];

  return (
    <div className="bg-card-dark border border-card-border p-4 sm:p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h3 className="font-mono text-[11px] tracking-[2px] uppercase text-accent">Market News</h3>
        <button className="font-mono text-[10px] tracking-[1.5px] uppercase text-text-muted hover:text-text-main transition-colors">
          See All
        </button>
      </div>

      <div className="flex-1 space-y-0 divide-y divide-hairline">
        {newsItems.map((item) => (
          <div key={item.id} className="group cursor-pointer py-4 first:pt-0 last:pb-0">
            <div className="flex justify-between items-center mb-2">
              <span className={`font-mono text-[10px] tracking-[2px] uppercase ${item.sentimentStyle}`}>
                {item.sentiment}
              </span>
              <span className="font-mono text-[10px] tracking-[1px] text-text-muted">{item.time}</span>
            </div>
            <h4 className="font-body text-[14px] text-text-secondary leading-snug group-hover:text-text-main transition-colors">
              {item.title}
            </h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketNewsCard;
