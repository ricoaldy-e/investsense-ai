import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, Minus, Clock, ExternalLink, RefreshCw, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { formatRelativeTime, mapSentimentLabel } from '../services/utils';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

// ─── Mock Data (Global Indices & Sectors — no BE endpoint available) ───

const globalIndices = [
  { name: 'IDX Composite', ticker: 'IHSG', value: 7200.45, change: +0.4, points: '+28.80' },
  { name: 'S&P 500', ticker: 'SPX', value: 5100.32, change: -0.1, points: '-5.10' },
  { name: 'Nikkei 225', ticker: 'N225', value: 39012.50, change: +1.2, points: '+468.15' },
  { name: 'Hang Seng', ticker: 'HSI', value: 18430.20, change: -0.3, points: '-55.29' },
  { name: 'FTSE 100', ticker: 'FTSE', value: 8275.60, change: +0.6, points: '+49.65' },
];

const sectorData = [
  { name: 'Financials (Banking)', change: +1.5, status: 'Leading' },
  { name: 'Energy', change: +0.9, status: 'Leading' },
  { name: 'Consumer Goods', change: +0.2, status: 'Neutral' },
  { name: 'Healthcare', change: +0.1, status: 'Neutral' },
  { name: 'Technology', change: -0.8, status: 'Lagging' },
  { name: 'Real Estate', change: -1.2, status: 'Lagging' },
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
  // Normalize to display label
  const normalizedMap = {
    'Bullish': t('market.bullish'), 'positive': t('market.bullish'),
    'Bearish': t('market.bearish'), 'negative': t('market.bearish'),
    'Neutral': t('market.neutral'), 'neutral': t('market.neutral'),
  };
  const displayLabel = normalizedMap[sentiment] || t('market.neutral');

  const colors = {
    [t('market.bullish')]: 'text-success border-success/30 bg-success-soft',
    [t('market.bearish')]: 'text-danger border-danger/30 bg-danger-soft',
    [t('market.neutral')]: 'text-text-muted border-card-border bg-surface',
  };

  return (
    <span className={`font-mono text-[9px] tracking-[1.5px] uppercase px-2.5 py-1 border rounded-full ${colors[displayLabel]}`}>
      {displayLabel}
    </span>
  );
};

// ─── Main Page ───

const MarketInsight = () => {
  const { t, i18n } = useTranslation();
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [marketHeadlines, setMarketHeadlines] = useState(USE_MOCK ? mockHeadlines : []);
  const [isLoadingNews, setIsLoadingNews] = useState(!USE_MOCK);

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
    fetchMarketNews();
  }, [fetchMarketNews]);

  // Refresh handler
  const handleRefresh = () => {
    setIsRefreshing(true);
    setLastUpdated(new Date());

    if (!USE_MOCK) {
      fetchMarketNews().finally(() => setIsRefreshing(false));
    } else {
      setTimeout(() => setIsRefreshing(false), 800);
    }
  };

  // Auto-refresh timestamp every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Format number with locale
  const formatNumber = (num) => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Count sentiments for summary
  const bullishCount = marketHeadlines.filter(n => n.sentiment === 'Bullish' || n.sentiment === 'positive').length;
  const bearishCount = marketHeadlines.filter(n => n.sentiment === 'Bearish' || n.sentiment === 'negative').length;
  const neutralCount = marketHeadlines.filter(n => n.sentiment === 'Neutral' || n.sentiment === 'neutral').length;

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
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 font-mono text-[10px] tracking-[2px] uppercase text-accent border border-accent/40 rounded-full px-4 py-2 hover:bg-accent hover:text-bg-dark disabled:opacity-50 transition-all duration-200 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          {t('market.refresh')}
        </button>
      </div>

      <div className="bg-card-dark border border-card-border p-4 flex flex-wrap items-center gap-4 md:gap-8 mb-4 md:mb-6">
        <div className="font-mono text-[10px] tracking-[2px] uppercase text-text-muted">
          {t('market.sentiment_overview')}
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-success" />
            <span className="font-mono text-[11px] text-success">{bullishCount}</span>
            <span className="font-mono text-[9px] tracking-[1px] uppercase text-text-muted">{t('market.bullish')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-danger" />
            <span className="font-mono text-[11px] text-danger">{bearishCount}</span>
            <span className="font-mono text-[9px] tracking-[1px] uppercase text-text-muted">{t('market.bearish')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-text-muted" />
            <span className="font-mono text-[11px] text-text-muted">{neutralCount}</span>
            <span className="font-mono text-[9px] tracking-[1px] uppercase text-text-muted">{t('market.neutral')}</span>
          </div>
        </div>
      </div>

      {/* Main Grid — fluid auto-fit to work with AI panel resize */}
      <div className="grid gap-4 md:gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(380px, 100%), 1fr))' }}>
        {/* Left Column — Indices + Sectors stacked */}
        <div className="flex flex-col gap-4 md:gap-6">
          {/* Global Markets Card */}
          <div className="bg-card-dark border border-card-border">
            <div className="px-5 py-4 border-b border-card-border flex items-center justify-between">
              <h2 className="font-display text-[11px] tracking-[2px] uppercase text-text-muted">
                {t('market.global_markets')}
              </h2>
              <span className="font-mono text-[9px] tracking-[1px] text-text-muted uppercase">
                {globalIndices.length} {t('market.indices')}
              </span>
            </div>
            <div className="divide-y divide-hairline">
              {globalIndices.map((index) => (
                <div key={index.ticker} className="px-5 py-3.5 flex items-center justify-between hover:bg-surface/30 transition-colors duration-150">
                  <div>
                    <p className="font-mono text-[12px] text-text-main tracking-[0.5px]">
                      {index.ticker}
                    </p>
                    <p className="font-body text-[11px] text-text-muted mt-0.5">
                      {index.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[13px] text-text-main">
                      {formatNumber(index.value)}
                    </p>
                    <div className="flex items-center justify-end gap-2 mt-0.5">
                      <span className={`font-mono text-[10px] ${index.change >= 0 ? 'text-success' : 'text-danger'}`}>
                        {index.points}
                      </span>
                      <ChangeIndicator value={index.change} size="sm" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sector Movers Card */}
          <div className="bg-card-dark border border-card-border">
            <div className="px-5 py-4 border-b border-card-border flex items-center justify-between">
              <h2 className="font-display text-[11px] tracking-[2px] uppercase text-text-muted">
                {t('market.sector_movers')}
              </h2>
              <span className="font-mono text-[9px] tracking-[1px] text-text-muted uppercase">
                {t('market.today')}
              </span>
            </div>
            <div className="divide-y divide-hairline">
              {sectorData.map((sector) => (
                <div key={sector.name} className="px-5 py-3.5 hover:bg-surface/30 transition-colors duration-150">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-body text-[13px] text-text-main">
                      {sector.name}
                    </p>
                    <ChangeIndicator value={sector.change} />
                  </div>
                  {/* Progress bar visualization */}
                  <div className="w-full h-1 bg-surface overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${sector.change >= 0 ? 'bg-success/60' : 'bg-danger/60'}`}
                      style={{ width: `${Math.min(Math.abs(sector.change) * 30, 100)}%` }}
                    />
                  </div>
                  <p className="font-mono text-[9px] tracking-[1.5px] uppercase text-text-muted mt-1.5">
                    {sector.status}
                  </p>
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
              <div className="flex-1 flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="w-5 h-5 text-accent animate-spin mx-auto mb-3" />
                  <p className="font-mono text-[10px] tracking-[2px] uppercase text-text-muted">
                    {t('market.fetching_headlines')}
                  </p>
                </div>
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
