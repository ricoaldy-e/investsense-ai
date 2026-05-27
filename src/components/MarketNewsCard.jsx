import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const NEWS_PREVIEW_BEGINNER = 2;
const NEWS_PREVIEW_PRO = 4;

const NewsItem = ({ item }) => {
  const { t } = useTranslation();
  const sentimentLabel = item.sentiment === 'positive' ? 'BULLISH' : item.sentiment === 'negative' ? 'BEARISH' : 'NEUTRAL';
  const sentimentStyle = item.sentiment === 'positive' ? 'text-success' : item.sentiment === 'negative' ? 'text-danger' : 'text-text-muted';

  return (
    <div className="group py-4 first:pt-0">
      <div className="flex justify-between items-center mb-2">
        <span className={`font-mono text-[10px] tracking-[2px] uppercase ${sentimentStyle}`}>
          {sentimentLabel}
        </span>
        <span className="font-mono text-[10px] tracking-[1px] text-text-muted">{item.time}</span>
      </div>
      {item.url ? (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-body text-[14px] text-text-secondary leading-snug group-hover:text-accent transition-colors block"
          aria-label={`${t('news_card.read_full')}: ${item.title}`}
        >
          {item.title}
        </a>
      ) : (
        <h4 className="font-body text-[14px] text-text-secondary leading-snug group-hover:text-text-main transition-colors">
          {item.title}
        </h4>
      )}
      {item.source && (
        <p className="font-mono text-[10px] text-text-muted mt-1.5 tracking-[1px]">{item.source}</p>
      )}
    </div>
  );
};

const MarketNewsCard = ({ data, mode }) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeRef = useRef(null);
  const isPro = mode === 'pro';

  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  if (!data) return null;

  const allNews = data.news || [];
  const previewCount = isPro ? NEWS_PREVIEW_PRO : NEWS_PREVIEW_BEGINNER;
  const previewNews = allNews.slice(0, previewCount);
  const hasMore = allNews.length > previewCount;

  return (
    <>
      {/* Card — Preview */}
      <div className="bg-card-dark border border-card-border p-4 sm:p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="font-mono text-[11px] tracking-[2px] uppercase text-accent">
            {isPro ? t('news_card.title_pro') : t('news_card.title_beginner')}
          </h3>
          {hasMore && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="font-mono text-[10px] tracking-[1.5px] uppercase text-text-muted hover:text-accent transition-colors"
            >
              See All ({allNews.length})
            </button>
          )}
        </div>

        <div className="flex-1 space-y-0 divide-y divide-hairline">
          {previewNews.length === 0 ? (
            <p className="font-body text-[14px] text-text-muted py-4">{t('news_card.no_news')}</p>
          ) : (
            previewNews.map((item) => (
              <NewsItem key={item.id} item={item} />
            ))
          )}
        </div>
      </div>

      {/* Modal — Full News List */}
      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-[100] transition-opacity"
            onClick={() => setIsModalOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-6">
            <div
              className="w-full max-w-[560px] max-h-[80vh] bg-surface border border-card-border flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-labelledby="news-modal-title"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-card-border flex-shrink-0">
                <div>
                  <h2
                    id="news-modal-title"
                    className="font-mono text-[11px] tracking-[2px] uppercase text-accent mb-1"
                  >
                    {isPro ? t('news_card.title_pro') : t('news_card.title_beginner')}
                  </h2>
                  <p className="font-mono text-[10px] tracking-[1px] text-text-muted uppercase">
                    {data.ticker} | {allNews.length} articles
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

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto px-6 py-2">
                <div className="divide-y divide-hairline">
                  {allNews.map((item) => (
                    <NewsItem key={item.id} item={item} />
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
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
