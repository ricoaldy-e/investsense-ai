import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, Minus, Clock, ExternalLink, Loader2 } from 'lucide-react';
import { InlineLoader, PageLoader } from '../components/ui/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { formatRelativeTime, mapSentimentLabel } from '../services/utils';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

// ─── Mock Data (Anti-FOMO Market Radar) ───

const mockOverbought = [
  { ticker: 'BREN.JK', name: 'Barito Renewables Energy Tbk.', rsi_14: 84.5, price: 10200, change: +15.2 },
  { ticker: 'CUAN.JK', name: 'Petrindo Semesta Kreasi Tbk.', rsi_14: 79.2, price: 7850, change: +8.4 },
  { ticker: 'AMMN.JK', name: 'Amman Mineral Internasional Tbk.', rsi_14: 76.8, price: 9200, change: +5.1 },
  { ticker: 'GOTO.JK', name: 'GoTo Gojek Tokopedia Tbk.', rsi_14: 72.1, price: 72, change: +4.3 },
];

const mockOversold = [
  { ticker: 'UNVR.JK', name: 'Unilever Indonesia Tbk.', rsi_14: 22.4, price: 2600, change: -2.5 },
  { ticker: 'KLBF.JK', name: 'Kalbe Farma Tbk.', rsi_14: 25.1, price: 1450, change: -1.2 },
  { ticker: 'PGAS.JK', name: 'Perusahaan Gas Negara Tbk.', rsi_14: 28.5, price: 1100, change: -0.8 },
  { ticker: 'MDKA.JK', name: 'Merdeka Copper Gold Tbk.', rsi_14: 29.2, price: 2350, change: -1.5 },
];

// Fallback mock headlines (used when BE is unavailable or in mock mode)
const mockHeadlines = [
  {
    id: 1,
    title: 'Bank Indonesia Holds Key Rate Steady at 5.75% Amid Global Uncertainty',
    source: 'Bloomberg',
    time: '35 min ago',
    sentiment: 'Neutral',
  },
  {
    id: 2,
    title: 'S&P 500 Dips as Fed Signals Prolonged Higher Rates Through 2026',
    source: 'Reuters',
    time: '1h ago',
    sentiment: 'Bearish',
  },
  {
    id: 3,
    title: 'Indonesian Banking Sector Posts Record Quarterly Profits, Led by BBCA',
    source: 'CNBC Indonesia',
    time: '2h ago',
    sentiment: 'Bullish',
  },
  {
    id: 4,
    title: 'Nikkei 225 Surges Past 39,000 on Weak Yen and Export Optimism',
    source: 'Nikkei Asia',
    time: '3h ago',
    sentiment: 'Bullish',
  },
  {
    id: 5,
    title: 'Global Tech Stocks Face Pressure from Rising Bond Yields',
    source: 'Financial Times',
    time: '4h ago',
    sentiment: 'Bearish',
  },
  {
    id: 6,
    title: 'Indonesia Consumer Confidence Index Remains Stable at 124.3',
    source: 'Kompas',
    time: '5h ago',
    sentiment: 'Neutral',
  },
];

// ─── Helper Components ───

const ChangeIndicator = ({ value, size = 'default' }) => {
  const isPositive = value > 0;
  const isNeutral = value === 0;
  const colorClass = isPositive ? 'text-success' : isNeutral ? 'text-text-muted' : 'text-danger';
  const textSize = size === 'sm' ? 'text-[11px]' : 'text-[13px]';

  return (
    <span className={`font-mono ${textSize} ${colorClass} flex items-center gap-1`}>
      {isPositive ? <TrendingUp className="w-3 h-3" /> : isNeutral ? <Minus className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {isPositive ? '+' : ''}{value.toFixed(1)}%
    </span>
  );
};

/**
 * SentimentTag — Maps sentiment labels to UI tags.
 * Handles both mock format ("Bullish"/"Bearish"/"Neutral") and
 * BE-derived format ("positive"/"negative"/"neutral").
 */
const SentimentTag = ({ sentiment }) => {
  const { t } = useTranslation();

  const displayLabel =
    sentiment === 'Bullish' || sentiment === 'positive' ? t('market.bullish') :
    sentiment === 'Bearish' || sentiment === 'negative' ? t('market.bearish') :
    t('market.neutral');

  const colors = {
    [t('market.bullish')]: 'text-success border-success/30 bg-success-soft',
    [t('market.bearish')]: 'text-danger border-danger/30 bg-danger-soft',
    [t('market.neutral')]: 'text-text-muted border-card-border bg-surface',
  };

  return (
    <span className={`font-mono text-[9px] tracking-[1.5px] uppercase px-2.5 py-1 border rounded-full ${colors[displayLabel] ?? 'text-text-muted border-card-border bg-surface'}`}>
      {displayLabel}
    </span>
  );

};

// ─── Main Page ───

const MarketInsight = () => {
  const { t, i18n } = useTranslation();
  const [lastUpdated] = useState(new Date());
  const [marketHeadlines, setMarketHeadlines] = useState(USE_MOCK ? mockHeadlines : []);
  const [isLoadingNews, setIsLoadingNews] = useState(!USE_MOCK);
  const [isPageLoading, setIsPageLoading] = useState(true);

  /**
   * Fetch market headlines from BE news search endpoint.
   * Uses keyword "saham indonesia" to get general market news.
   * Falls back to mock data if the request fails.
   */
  const fetchMarketNews = useCallback(async () => {
    if (USE_MOCK) return;

    setIsLoadingNews(true);
    try {
      const response = await api.get('/news/search', { params: { keyword: 'saham indonesia' } });
      const articles = response.data?.data || [];

      if (articles.length > 0) {
        const mapped = articles.slice(0, 8).map((article, idx) => ({
          id: article.id || idx,
          title: article.title,
          source: article.source?.name || article.source_name || 'Unknown',
          time: formatRelativeTime(article.publishedAt || article.published_at),
          sentiment: mapSentimentLabel(article.sentiment_label),
          url: article.url,
          description: article.description,
        }));
        setMarketHeadlines(mapped);
      } else {
        // No results — keep mock data as fallback
        setMarketHeadlines(mockHeadlines);
      }
    } catch (err) {
      console.warn(`[InvestSense MarketInsight] Degradation: Failed to fetch live market news. Falling back to cached data. Details: ${err.message}`);
      setMarketHeadlines(mockHeadlines);
    } finally {
      setIsLoadingNews(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchMarketNews().finally(() => {
      setTimeout(() => setIsPageLoading(false), 400); // Small delay for smoother UX
    });
  }, [fetchMarketNews]);

  // Format number with locale
  const formatNumber = (num) => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Count sentiments for summary
  const bullishCount = marketHeadlines.filter(n => n.sentiment === 'Bullish' || n.sentiment === 'positive').length;
  const bearishCount = marketHeadlines.filter(n => n.sentiment === 'Bearish' || n.sentiment === 'negative').length;
  const neutralCount = marketHeadlines.filter(n => n.sentiment === 'Neutral' || n.sentiment === 'neutral').length;

  if (isPageLoading) {
    return <PageLoader label={t('market.loading')} />;
  }

  return (
    <div className="pb-24 md:pb-0">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 md:mb-8">
        <div>
          <h1 className="font-display text-[20px] md:text-[24px] font-light text-text-main tracking-[3px] uppercase mb-1">
            {t('market.title')}
          </h1>
          <p className="font-mono text-[10px] tracking-[2px] uppercase text-text-muted">
            {t('market.data_as_of')} {lastUpdated.toLocaleTimeString(i18n.language === 'id' ? 'id-ID' : 'en-US', { hour: '2-digit', minute: '2-digit' })} |{' '}
            {lastUpdated.toLocaleDateString(i18n.language === 'id' ? 'id-ID' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Market Sentiment Heat */}
      <div className="bg-card-dark border border-card-border p-5 mb-4 md:mb-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-[11px] tracking-[2px] uppercase text-text-muted">
            {t('market.market_mood')}
          </h2>
          <span className="font-mono text-[9px] tracking-[1px] text-text-muted uppercase">
            {bullishCount + bearishCount + neutralCount} {t('market.articles')}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-2 flex rounded-none overflow-hidden">
          {bullishCount + bearishCount + neutralCount > 0 ? (
            <>
              <div style={{ width: `${(bullishCount / (bullishCount + bearishCount + neutralCount)) * 100}%` }} className="bg-success transition-all duration-500" />
              <div style={{ width: `${(neutralCount / (bullishCount + bearishCount + neutralCount)) * 100}%` }} className="bg-text-muted transition-all duration-500" />
              <div style={{ width: `${(bearishCount / (bullishCount + bearishCount + neutralCount)) * 100}%` }} className="bg-danger transition-all duration-500" />
            </>
          ) : (
            <div className="w-full h-full bg-surface" />
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[12px] text-success">{bullishCount}</span>
            <span className="font-mono text-[9px] tracking-[1px] uppercase text-text-muted">{t('market.bullish')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[12px] text-text-muted">{neutralCount}</span>
            <span className="font-mono text-[9px] tracking-[1px] uppercase text-text-muted">{t('market.neutral')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[12px] text-danger">{bearishCount}</span>
            <span className="font-mono text-[9px] tracking-[1px] uppercase text-text-muted">{t('market.bearish')}</span>
          </div>
        </div>
      </div>

      {/* Main Grid — fluid auto-fit to work with AI panel resize */}
      <div className="grid gap-4 md:gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(380px, 100%), 1fr))' }}>
        {/* Left Column — Anti-FOMO Radars stacked */}
        <div className="flex flex-col gap-4 md:gap-6">
          {/* Overbought Radar */}
          <div className="bg-card-dark border border-card-border">
            <div className="px-5 py-4 border-b border-card-border flex items-center justify-between bg-danger-soft/20">
              <h2 className="font-display text-[11px] tracking-[2px] uppercase text-danger">
                {t('market.overbought_risk')}
              </h2>
              <span className="font-mono text-[9px] tracking-[1px] text-text-muted uppercase">
                {mockOverbought.length} {t('watchlist.ticker')}
              </span>
            </div>
            <div className="divide-y divide-hairline">
              {mockOverbought.map((stock) => (
                <div key={stock.ticker} className="px-5 py-3.5 flex items-center justify-between hover:bg-surface/30 transition-colors duration-150">
                  <div className="min-w-0 pr-4">
                    <p className="font-mono text-[12px] text-text-main tracking-[0.5px]">
                      {stock.ticker}
                    </p>
                    <p className="font-body text-[11px] text-text-muted mt-0.5 truncate max-w-[120px] sm:max-w-[180px]">
                      {stock.name}
                    </p>
                  </div>
                  <div className="text-right flex items-center gap-4 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="font-mono text-[13px] text-text-main">
                        {formatNumber(stock.price)}
                      </p>
                      <div className="flex items-center justify-end gap-2 mt-0.5">
                        <ChangeIndicator value={stock.change} size="sm" />
                      </div>
                    </div>
                    <div className="text-right border-l border-card-border pl-4">
                      <p className="font-mono text-[14px] text-danger">
                        {stock.rsi_14.toFixed(1)}
                      </p>
                      <p className="font-mono text-[9px] tracking-[1px] text-text-muted uppercase mt-0.5">
                        {t('market.rsi_level')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Oversold Radar */}
          <div className="bg-card-dark border border-card-border">
            <div className="px-5 py-4 border-b border-card-border flex items-center justify-between bg-success-soft/20">
              <h2 className="font-display text-[11px] tracking-[2px] uppercase text-success">
                {t('market.oversold_opportunity')}
              </h2>
              <span className="font-mono text-[9px] tracking-[1px] text-text-muted uppercase">
                {mockOversold.length} {t('watchlist.ticker')}
              </span>
            </div>
            <div className="divide-y divide-hairline">
              {mockOversold.map((stock) => (
                <div key={stock.ticker} className="px-5 py-3.5 flex items-center justify-between hover:bg-surface/30 transition-colors duration-150">
                  <div className="min-w-0 pr-4">
                    <p className="font-mono text-[12px] text-text-main tracking-[0.5px]">
                      {stock.ticker}
                    </p>
                    <p className="font-body text-[11px] text-text-muted mt-0.5 truncate max-w-[120px] sm:max-w-[180px]">
                      {stock.name}
                    </p>
                  </div>
                  <div className="text-right flex items-center gap-4 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="font-mono text-[13px] text-text-main">
                        {formatNumber(stock.price)}
                      </p>
                      <div className="flex items-center justify-end gap-2 mt-0.5">
                        <ChangeIndicator value={stock.change} size="sm" />
                      </div>
                    </div>
                    <div className="text-right border-l border-card-border pl-4">
                      <p className="font-mono text-[14px] text-success">
                        {stock.rsi_14.toFixed(1)}
                      </p>
                      <p className="font-mono text-[9px] tracking-[1px] text-text-muted uppercase mt-0.5">
                        {t('market.rsi_level')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column — Market Headlines (integrated with BE news search) */}
        <div>
          <div className="bg-card-dark border border-card-border h-full flex flex-col">
            <div className="px-5 py-4 border-b border-card-border flex items-center justify-between">
              <h2 className="font-display text-[11px] tracking-[2px] uppercase text-text-muted">
                {t('market.market_headlines')}
              </h2>
              <span className="font-mono text-[9px] tracking-[1px] text-text-muted uppercase">
                {isLoadingNews ? '...' : `${marketHeadlines.length} ${t('market.articles')}`}
              </span>
            </div>

            {isLoadingNews ? (
              <div className="flex-1 flex items-center justify-center py-6">
                <InlineLoader label={t('market.fetching_headlines')} />
              </div>
            ) : (
              <div className="divide-y divide-hairline flex-1">
                {marketHeadlines.map((news) => (
                  <div key={news.id} className="px-5 py-4 hover:bg-surface/30 transition-colors duration-150 group cursor-pointer">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        {news.url ? (
                          <a
                            href={news.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-body text-[14px] text-text-main leading-relaxed group-hover:text-accent transition-colors duration-200 block"
                          >
                            {news.title}
                          </a>
                        ) : (
                          <p className="font-body text-[14px] text-text-main leading-relaxed group-hover:text-accent transition-colors duration-200">
                            {news.title}
                          </p>
                        )}
                        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-2.5">
                          <span className="font-mono text-[10px] tracking-[1px] text-text-muted flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {news.time}
                          </span>
                          <span className="font-mono text-[10px] tracking-[1px] text-text-muted flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" />
                            {news.source}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 mt-0.5">
                        <SentimentTag sentiment={news.sentiment} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketInsight;
