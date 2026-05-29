import { useState, useEffect, useRef } from 'react';
import { Newspaper, ExternalLink, Loader2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { getNewsKeyword, formatRelativeTime } from '../services/utils';
import useDashboardStore from '../store/useDashboardStore';

const MarketNewsCard = ({ mode }) => {
  const { t } = useTranslation();
  const activeTicker = useDashboardStore((s) => s.activeTicker);

  const [articles, setArticles]     = useState([]);
  const [isLoading, setIsLoading]   = useState(false);
  const [error, setError]           = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeRef = useRef(null);

  const isPro = mode === 'pro';
  useEffect(() => {
    if (!activeTicker) {
      setArticles([]);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);
    setArticles([]);
    setIsModalOpen(false);

    const keyword = getNewsKeyword(activeTicker);

    const fetchNews = async () => {
      try {
        const response = await api.get(`/news/search?keyword=${encodeURIComponent(keyword)}`);
        if (cancelled) return;

        const raw = response.data?.data ?? [];
        const mapped = raw.map((item, idx) => ({
          id:          idx,
          title:       item.title       ?? 'Untitled',
          description: item.description ?? '',
          url:         item.url         ?? '#',
          image:       item.image       ?? null,
          publishedAt: item.publishedAt ?? null,
          sourceName:  item.source?.name ?? 'Unknown',
        }));

        setArticles(mapped);
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || 'Failed to load news.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchNews();
    return () => { cancelled = true; };
  }, [activeTicker]);
  useEffect(() => {
    if (!isModalOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') setIsModalOpen(false); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const previewCount = isPro ? 4 : 3;
  const previewArticles = articles.slice(0, previewCount);
  const hasMore = articles.length > previewCount;
  const SkeletonRow = () => (
    <div className="py-4 border-b border-hairline last:border-0 animate-pulse">
      <div className="flex justify-between items-center mb-2">
        <div className="h-2.5 bg-surface rounded w-16" />
        <div className="h-2 bg-surface rounded w-12" />
      </div>
      <div className="h-3.5 bg-surface rounded w-full mb-1.5" />
      <div className="h-3.5 bg-surface rounded w-4/5 mb-2" />
      {isPro && <div className="h-2.5 bg-surface rounded w-3/5" />}
    </div>
  );
  const ArticleRow = ({ item, isLast }) => (
    <div className={`group py-4 ${isLast ? '' : 'border-b border-hairline'}`}>
      
      <div className="flex items-center justify-between mb-1.5 gap-2">
        <span className="font-mono text-[9px] tracking-[1.5px] uppercase text-accent truncate">
          {item.sourceName}
        </span>
        <span className="font-mono text-[9px] tracking-[1px] text-text-muted flex-shrink-0">
          {item.publishedAt ? formatRelativeTime(item.publishedAt) : '—'}
        </span>
      </div>

      
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-start gap-1.5 group/link"
        aria-label={`Read: ${item.title}`}
      >
        <span className="font-body text-[13px] text-text-secondary leading-snug group-hover/link:text-accent transition-colors duration-150 flex-1">
          {item.title}
        </span>
        <ExternalLink className="w-3 h-3 text-text-muted group-hover/link:text-accent transition-colors flex-shrink-0 mt-0.5" />
      </a>

      
      {isPro && item.description && (
        <p className="font-body text-[11px] text-text-muted mt-1.5 leading-relaxed line-clamp-2">
          {item.description}
        </p>
      )}
    </div>
  );
  return (
    <>
      <div className="bg-card-dark border border-card-border p-4 sm:p-6 h-full flex flex-col">

        
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div className="flex items-center gap-2">
            <Newspaper className="w-3.5 h-3.5 text-accent" />
              {isPro ? t('news_card.title_pro') : t('news_card.title_beginner')}
          </div>

          <div className="flex items-center gap-3">
            
            {activeTicker && !isLoading && (
              <span className="font-mono text-[9px] tracking-[1px] text-text-muted uppercase hidden sm:block border border-card-border px-2 py-1">
                {getNewsKeyword(activeTicker).split(' OR ')[0]}
              </span>
            )}
            
            {hasMore && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="font-mono text-[10px] tracking-[1.5px] uppercase text-text-muted hover:text-accent transition-colors"
              >
                See All ({articles.length})
              </button>
            )}
          </div>
        </div>

        
        <div className="flex-1">

          
          {isLoading && (
            <div>
              {[0, 1, 2].map((i) => <SkeletonRow key={i} />)}
            </div>
          )}

          
          {!isLoading && error && (
            <div className="flex flex-col items-center justify-center h-32 gap-2">
              <p className="font-mono text-[10px] tracking-[1px] uppercase text-danger">{error}</p>
              <p className="font-body text-[12px] text-text-muted">News is temporarily unavailable.</p>
            </div>
          )}

          
          {!isLoading && !error && articles.length === 0 && (
            <p className="font-body text-[14px] text-text-muted py-4">
              {activeTicker ? t('news_card.no_news_found', { ticker: activeTicker }) : t('news_card.select_stock_news')}
            </p>
          )}

          
          {!isLoading && !error && previewArticles.length > 0 && (
            <div>
              {previewArticles.map((item, i) => (
                <ArticleRow key={item.id} item={item} isLast={i === previewArticles.length - 1} />
              ))}
            </div>
          )}
        </div>

        
        {!isLoading && articles.length > 0 && (
          <p className="font-body text-[10px] text-text-muted italic mt-4 pt-4 border-t border-hairline">
            {t('news_card.ai_disclaimer')}
          </p>
        )}
      </div>
      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-[100]"
            onClick={() => setIsModalOpen(false)}
            aria-hidden="true"
          />
          
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-6">
            <div
              className="w-full max-w-[580px] max-h-[82vh] bg-surface border border-card-border flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-labelledby="news-modal-title"
              onClick={(e) => e.stopPropagation()}
            >
              
              <div className="flex items-center justify-between px-6 py-5 border-b border-card-border flex-shrink-0">
                <div>
                  <h2
                    id="news-modal-title"
                    className="font-mono text-[11px] tracking-[2px] uppercase text-accent mb-1"
                  >
                    {isPro ? t('news_card.title_pro') : t('news_card.title_beginner')}
                  </h2>
                  <p className="font-mono text-[9px] tracking-[1px] text-text-muted uppercase">
                    {activeTicker} · {articles.length} articles · {getNewsKeyword(activeTicker).split(' OR ')[0]}
                  </p>
                </div>
                <button
                  ref={closeRef}
                  onClick={() => setIsModalOpen(false)}
                  className="text-text-muted hover:text-text-main transition-colors p-1 focus:outline-none focus:text-accent"
                  aria-label="Close news panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              
              <div className="flex-1 overflow-y-auto px-6 py-2">
                {articles.map((item, i) => (
                  <ArticleRow key={item.id} item={item} isLast={i === articles.length - 1} />
                ))}
              </div>

              
              <div className="px-6 py-4 border-t border-card-border flex-shrink-0">
                <p className="font-body text-[11px] text-text-muted italic text-center">
                  {t('ai_insight_card.disclaimer')}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MarketNewsCard;
