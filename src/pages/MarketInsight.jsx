import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, Minus, Clock, ExternalLink } from 'lucide-react';
import { InlineLoader, PageLoader } from '../components/ui/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { formatRelativeTime, mapSentimentLabel } from '../services/utils';

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

const MarketInsight = () => {
  const { t, i18n } = useTranslation();
  const [lastUpdated] = useState(new Date());
  const [marketHeadlines, setMarketHeadlines] = useState([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const [newsError, setNewsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [overbought, setOverbought] = useState([]);
  const [oversold, setOversold] = useState([]);
  const [radarLastUpdated, setRadarLastUpdated] = useState(null);
  const [isLoadingRadar, setIsLoadingRadar] = useState(true);
  const [radarError, setRadarError] = useState(false);

  
  const fetchRadar = useCallback(async () => {
    setIsLoadingRadar(true);
    setRadarError(false);
    try {
      const response = await api.get('/market-insight/radar');
      const { overbought: ob, oversold: os } = response.data?.data ?? {};
      setOverbought(Array.isArray(ob) ? ob : []);
      setOversold(Array.isArray(os) ? os : []);
      if (response.data?.lastUpdated) {
        setRadarLastUpdated(new Date(response.data.lastUpdated));
      }
    } catch (err) {
      console.warn(`[MarketInsight] Failed to fetch radar data. Details: ${err.message}`);
      setRadarError(true);
    } finally {
      setIsLoadingRadar(false);
    }
  }, []);

  
  const fetchMarketNews = useCallback(async () => {
    setIsLoadingNews(true);
    setNewsError(false);
    try {
      const response = await api.get('/news/market');
      const articles = response.data?.data || [];

      if (articles.length > 0) {
        const mapped = articles.map((article, idx) => ({
          id: idx,
          title: article.title,
          description: article.description,
          url: article.url,
          source: article.source_name || 'Unknown',
          time: formatRelativeTime(article.published_at),
          sentiment: mapSentimentLabel(article.sentiment_label),
        }));
        setMarketHeadlines(mapped);
      } else {
        setMarketHeadlines([]);
      }
    } catch (err) {
      console.warn(`[MarketInsight] Failed to fetch market headlines. Details: ${err.message}`);
      setNewsError(true);
      setMarketHeadlines([]);
    } finally {
      setIsLoadingNews(false);
    }
  }, []);

  useEffect(() => {
    Promise.all([fetchRadar(), fetchMarketNews()]).finally(() => {
      setTimeout(() => setIsPageLoading(false), 400); 
    });
  }, [fetchRadar, fetchMarketNews]);

  const bullishCount = marketHeadlines.filter(n => n.sentiment === 'Bullish' || n.sentiment === 'positive').length;
  const bearishCount = marketHeadlines.filter(n => n.sentiment === 'Bearish' || n.sentiment === 'negative').length;
  const neutralCount = marketHeadlines.filter(n => n.sentiment === 'Neutral' || n.sentiment === 'neutral').length;

  if (isPageLoading) {
    return <PageLoader label={t('market.loading')} />;
  }

  return (
    <div className="pb-24 md:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 md:mb-8">
        <div>
          <h1 className="font-display text-[20px] md:text-[24px] font-light text-text-main tracking-[3px] uppercase mb-1">
            {t('market.title')}
          </h1>
          <p className="font-mono text-[10px] tracking-[2px] uppercase text-text-muted">
            {t('market.data_as_of')}{' '}
            {(radarLastUpdated ?? lastUpdated).toLocaleTimeString(i18n.language === 'id' ? 'id-ID' : 'en-US', { hour: '2-digit', minute: '2-digit' })} |{' '}
            {(radarLastUpdated ?? lastUpdated).toLocaleDateString(i18n.language === 'id' ? 'id-ID' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
      <div className="bg-card-dark border border-card-border p-5 mb-4 md:mb-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-[11px] tracking-[2px] uppercase text-text-muted">
            {t('market.market_mood')}
          </h2>
          <span className="font-mono text-[9px] tracking-[1px] text-text-muted uppercase">
            {bullishCount + bearishCount + neutralCount} {t('market.articles')}
          </span>
        </div>
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

      <div className="grid gap-4 md:gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(380px, 100%), 1fr))' }}>
        <div className="flex flex-col gap-4 md:gap-6">
          <div className="bg-card-dark border border-card-border">
            <div className="px-5 py-4 border-b border-card-border flex items-center justify-between bg-danger-soft/20">
              <h2 className="font-display text-[11px] tracking-[2px] uppercase text-danger">
                {t('market.overbought_risk')}
              </h2>
              <span className="font-mono text-[9px] tracking-[1px] text-text-muted uppercase">
                {isLoadingRadar ? '—' : `${overbought.length} ${t('watchlist.ticker')}`}
              </span>
            </div>

            {isLoadingRadar && (
              <div className="flex items-center justify-center py-8">
                <InlineLoader label={t('market.loading')} />
              </div>
            )}

            {!isLoadingRadar && radarError && (
              <div className="px-5 py-6 text-center">
                <p className="font-mono text-[10px] tracking-[1px] uppercase text-danger mb-1">{t('dashboard.error_title')}</p>
                <p className="font-body text-[12px] text-text-muted">Gagal memuat data radar. Coba refresh halaman.</p>
              </div>
            )}

            {!isLoadingRadar && !radarError && overbought.length === 0 && (
              <div className="px-5 py-6 text-center">
                <p className="font-mono text-[10px] tracking-[1px] uppercase text-text-muted">Tidak ada saham overbought saat ini</p>
              </div>
            )}

            {!isLoadingRadar && !radarError && overbought.length > 0 && (
              <div className="divide-y divide-hairline">
                {overbought.map((stock) => (
                  <div key={stock.ticker} className="px-5 py-3.5 flex items-center justify-between hover:bg-surface/30 transition-colors duration-150">
                    <div className="min-w-0 pr-4">
                      <p className="font-mono text-[12px] text-text-main tracking-[0.5px]">
                        {stock.ticker}
                      </p>
                      <p className="font-body text-[11px] text-text-muted mt-0.5 truncate max-w-[160px] sm:max-w-[220px]">
                        {stock.company_name}
                      </p>
                    </div>
                    <div className="text-right border-l border-card-border pl-4 flex-shrink-0">
                      <p className="font-mono text-[14px] text-danger">
                        {Number(stock.rsi).toFixed(1)}
                      </p>
                      <p className="font-mono text-[9px] tracking-[1px] text-text-muted uppercase mt-0.5">
                        {t('market.rsi_level')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="bg-card-dark border border-card-border">
            <div className="px-5 py-4 border-b border-card-border flex items-center justify-between bg-success-soft/20">
              <h2 className="font-display text-[11px] tracking-[2px] uppercase text-success">
                {t('market.oversold_opportunity')}
              </h2>
              <span className="font-mono text-[9px] tracking-[1px] text-text-muted uppercase">
                {isLoadingRadar ? '—' : `${oversold.length} ${t('watchlist.ticker')}`}
              </span>
            </div>

            {isLoadingRadar && (
              <div className="flex items-center justify-center py-8">
                <InlineLoader label={t('market.loading')} />
              </div>
            )}

            {!isLoadingRadar && radarError && (
              <div className="px-5 py-6 text-center">
                <p className="font-mono text-[10px] tracking-[1px] uppercase text-danger mb-1">{t('dashboard.error_title')}</p>
                <p className="font-body text-[12px] text-text-muted">Gagal memuat data radar. Coba refresh halaman.</p>
              </div>
            )}

            {!isLoadingRadar && !radarError && oversold.length === 0 && (
              <div className="px-5 py-6 text-center">
                <p className="font-mono text-[10px] tracking-[1px] uppercase text-text-muted">Tidak ada saham oversold saat ini</p>
              </div>
            )}

            {!isLoadingRadar && !radarError && oversold.length > 0 && (
              <div className="divide-y divide-hairline">
                {oversold.map((stock) => (
                  <div key={stock.ticker} className="px-5 py-3.5 flex items-center justify-between hover:bg-surface/30 transition-colors duration-150">
                    <div className="min-w-0 pr-4">
                      <p className="font-mono text-[12px] text-text-main tracking-[0.5px]">
                        {stock.ticker}
                      </p>
                      <p className="font-body text-[11px] text-text-muted mt-0.5 truncate max-w-[160px] sm:max-w-[220px]">
                        {stock.company_name}
                      </p>
                    </div>
                    <div className="text-right border-l border-card-border pl-4 flex-shrink-0">
                      <p className="font-mono text-[14px] text-success">
                        {Number(stock.rsi).toFixed(1)}
                      </p>
                      <p className="font-mono text-[9px] tracking-[1px] text-text-muted uppercase mt-0.5">
                        {t('market.rsi_level')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

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
            ) : newsError ? (
              <div className="flex-1 flex flex-col items-center justify-center py-10 px-5 text-center">
                <p className="font-mono text-[10px] tracking-[1px] uppercase text-danger mb-1">{t('dashboard.error_title')}</p>
                <p className="font-body text-[12px] text-text-muted">Gagal memuat berita pasar. Data tidak dapat ditampilkan.</p>
              </div>
            ) : marketHeadlines.length === 0 ? (
               <div className="flex-1 flex flex-col items-center justify-center py-10 px-5 text-center">
                <p className="font-body text-[12px] text-text-muted">Belum ada berita pasar saat ini.</p>
              </div>
            ) : (
              <div className="divide-y divide-hairline flex-1">
                {marketHeadlines.map((news, idx) => (
                  <div key={news.id ?? idx} className="px-5 py-4 hover:bg-surface/30 transition-colors duration-150 group cursor-pointer">
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
