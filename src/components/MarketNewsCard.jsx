const MarketNewsCard = () => {
  const newsItems = [
    {
      id: 1,
      sentiment: 'BULLISH',
      time: '2h ago',
      title: 'Apple Announces New AI Integration for Upcoming iPhone Models',
      sentimentColor: 'bg-[#1e3a8a]/50 text-[#60a5fa] border-[#1e3a8a]',
    },
    {
      id: 2,
      sentiment: 'BEARISH',
      time: '5h ago',
      title: 'Global Supply Chain Slowdown Could Impact Q4 Tech Earnings',
      sentimentColor: 'bg-[#7f1d1d]/40 text-[#fca5a5] border-[#7f1d1d]',
    },
    {
      id: 3,
      sentiment: 'NEUTRAL',
      time: '8h ago',
      title: 'Federal Reserve Maintains Current Interest Rates Amid Inflation Data',
      sentimentColor: 'bg-[#374151]/50 text-[#9ca3af] border-[#374151]',
    },
  ];

  return (
    <div className="bg-card-dark border border-card-border rounded-xl sm:rounded-2xl p-4 sm:p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h3 className="text-lg font-bold text-white">Market News</h3>
        <button className="text-xs font-semibold text-brand-blue hover:text-blue-400 transition-colors">
          See All
        </button>
      </div>

      <div className="flex-1 space-y-6">
        {newsItems.map((item) => (
          <div key={item.id} className="group cursor-pointer">
            <div className="flex justify-between items-center mb-2">
              <span className={`px-2 py-0.5 text-[10px] font-bold tracking-wider rounded border ${item.sentimentColor}`}>
                {item.sentiment}
              </span>
              <span className="text-xs text-text-muted">{item.time}</span>
            </div>
            <h4 className="text-sm font-semibold text-gray-200 leading-snug group-hover:text-brand-blue transition-colors">
              {item.title}
            </h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketNewsCard;
