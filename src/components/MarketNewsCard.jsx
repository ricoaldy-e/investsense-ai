import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const NEWS_PREVIEW_COUNT = 2;

/**
 * Single news item row — reused in card and modal.
 */
const NewsItem = ({ item, isLast }) => {
  const sentimentLabel = item.sentiment === 'positive' ? 'BULLISH' : item.sentiment === 'negative' ? 'BEARISH' : 'NEUTRAL';
  const sentimentStyle = item.sentiment === 'positive' ? 'text-accent' : item.sentiment === 'negative' ? 'text-danger' : 'text-text-muted';

  return (
    <div className={`group py-4 first:pt-0 ${isLast ? 'pb-0' : ''}`}>
      <div className="flex justify-between items-center mb-2">
        <span className={`font-mono text-[10px] tracking-[2px] uppercase ${sentimentStyle}`}>
          {sentimentLabel}
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
  );
};

/**
 * MarketNewsCard — Shows preview of market news with expand-to-modal.
 * 
 * Card shows first 2 items. "See All" opens a Cold Surgical modal
 * overlay showing all news with full context.
 */
const MarketNewsCard = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeRef = useRef(null);

  // ESC key + focus trap for modal
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  if (!data) return null;

  const allNews = data.news || [];
  const previewNews = allNews.slice(0, NEWS_PREVIEW_COUNT);
  const hasMore = allNews.length > NEWS_PREVIEW_COUNT;

  return (
    <>
      {/* Card — Preview */}
      <div className="bg-card-dark border border-card-border p-4 sm:p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="font-mono text-[11px] tracking-[2px] uppercase text-accent">Market News</h3>
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
            <p className="font-body text-[14px] text-text-muted py-4">No news available for this stock.</p>
          ) : (
            previewNews.map((item, i) => (
              <NewsItem key={item.id} item={item} isLast={i === previewNews.length - 1} />
            ))
          )}
        </div>
      </div>

      {/* Modal — Full News List */}
      {isModalOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 z-[100] transition-opacity"
            onClick={() => setIsModalOpen(false)}
            aria-hidden="true"
          />

          {/* Modal panel */}
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
                    Market News
                  </h2>
                  <p className="font-mono text-[10px] tracking-[1px] text-text-muted uppercase">
                    {data.ticker} — {allNews.length} articles
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

              {/* Modal Content — Scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-2">
                <div className="divide-y divide-hairline">
                  {allNews.map((item, i) => (
                    <NewsItem key={item.id} item={item} isLast={i === allNews.length - 1} />
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-card-border flex-shrink-0">
                <p className="font-body text-[11px] text-text-muted italic text-center">
                  News data is AI-curated for analytical context only. Verify with primary sources.
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
