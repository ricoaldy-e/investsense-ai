import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Plus, Trash2, RefreshCw, Loader2, TrendingUp, TrendingDown, Minus, Search, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { watchlistService } from '../services/watchlistService';
import { stockService } from '../services/stockService';
import api from '../services/api';
import ConfirmModal from '../components/ui/ConfirmModal';

// ─── Helper: format relative time for "added_at" ───
const formatAddedDate = (isoString) => {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// ─── Change Indicator ───
const ChangeIndicator = ({ value }) => {
  if (value == null) return <span className="font-mono text-[12px] text-text-muted">—</span>;
  const isPositive = value > 0;
  const isNeutral = value === 0;
  const colorClass = isPositive ? 'text-success' : isNeutral ? 'text-text-muted' : 'text-danger';

  return (
    <span className={`font-mono text-[12px] ${colorClass} flex items-center gap-1`}>
      {isPositive ? <TrendingUp className="w-3 h-3" /> : isNeutral ? <Minus className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {isPositive ? '+' : ''}{value.toFixed(2)}%
    </span>
  );
};

// ─── Price display helper ───
const formatPrice = (value, currency) => {
  if (value == null) return '—';
  if (currency === 'IDR') return `Rp${value.toLocaleString('id-ID')}`;
  return `$${value.toFixed(2)}`;
};

// ─── Main Page ───

const Watchlist = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // State
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [enrichedData, setEnrichedData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isEnriching, setIsEnriching] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Add ticker modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addQuery, setAddQuery] = useState('');
  const [addSearchResults, setAddSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [addError, setAddError] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Remove confirmation
  const [removeTarget, setRemoveTarget] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false);

  // ─── Fetch watchlist from BE ───
  const fetchWatchlist = useCallback(async () => {
    console.log("masuk sini")
    try {
      setError('');
      const items = await watchlistService.getWatchlist();
      setWatchlistItems(items);
      return items;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || t('watchlist.error_title');
      if (err.response?.status === 401) {
        setError(t('watchlist.login_required'));
      } else {
        setError(msg);
      }
      return [];
    }
  }, []);

  // ─── Enrich watchlist items with live quote data ───
  const enrichWithQuotes = useCallback(async (items) => {
    if (!items || items.length === 0) return;
    setIsEnriching(true);

    // Fetch quotes in parallel (max 10 concurrent)
    const quotePromises = items.map(async (item) => {
      try {
        const res = await api.get(`/stocks/quote/${item.ticker}`);
        return { ticker: item.ticker, data: res.data?.data, error: null };
      } catch {
        return { ticker: item.ticker, data: null, error: 'unavailable' };
      }
    });

    const results = await Promise.allSettled(quotePromises);
    const enriched = {};

    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        const { ticker, data } = result.value;
        enriched[ticker] = data;
      }
    });

    setEnrichedData(enriched);
    setIsEnriching(false);
  }, []);

  // ─── Initial load ───
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const items = await fetchWatchlist();
      await enrichWithQuotes(items);
      setIsLoading(false);
    };
    init();
  }, [fetchWatchlist, enrichWithQuotes]);

  // ─── Refresh handler ───
  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    const items = await fetchWatchlist();
    await enrichWithQuotes(items);
    setIsRefreshing(false);
  };

  // ─── Navigate to dashboard for a stock ───
  const handleViewStock = (ticker) => {
    navigate(`/dashboard?stock=${ticker}`);
  };

  // ─── Add to watchlist ───
  const handleAddSearch = async (query) => {
    setAddQuery(query);
    setAddError('');

    if (!query.trim()) {
      setAddSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await stockService.searchStocks(query.trim());
      setAddSearchResults(results.slice(0, 8));
    } catch {
      setAddSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddTicker = async (ticker) => {
    setIsAdding(true);
    setAddError('');
    try {
      await watchlistService.addToWatchlist(ticker);
      setShowAddModal(false);
      setAddQuery('');
      setAddSearchResults([]);
      // Refresh watchlist
      const items = await fetchWatchlist();
      await enrichWithQuotes(items);
    } catch (err) {
      if (err.response?.status === 409) {
        setAddError(`${ticker} is already in your watchlist.`);
      } else if (err.response?.status === 401) {
        setAddError('Please log in to add stocks to your watchlist.');
      } else {
        setAddError(err.response?.data?.message || 'Failed to add stock.');
      }
    } finally {
      setIsAdding(false);
    }
  };

  // ─── Remove from watchlist ───
  const handleRemoveTicker = async () => {
    if (!removeTarget) return;
    setIsRemoving(true);
    try {
      await watchlistService.removeFromWatchlist(removeTarget);
      setRemoveTarget(null);
      // Refresh watchlist
      const items = await fetchWatchlist();
      await enrichWithQuotes(items);
    } catch (err) {
      console.error(`[InvestSense Watchlist] Failed to remove stock ticker (${removeTarget}):`, err.message);
      setRemoveTarget(null);
    } finally {
      setIsRemoving(false);
    }
  };

  // ─── Loading State ───
  if (isLoading) {
    return (
      <div className="pb-24 md:pb-0 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 text-accent animate-spin mb-4" />
        <p className="font-mono text-[11px] tracking-[2px] uppercase text-text-muted">
          {t('watchlist.loading')}
        </p>
      </div>
    );
  }

  // ─── Error State ───
  if (error && watchlistItems.length === 0) {
    return (
      <div className="pb-24 md:pb-0 flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-8 h-8 text-danger mb-4" />
        <p className="font-mono text-[12px] tracking-[1px] uppercase text-danger mb-2">
          {t('watchlist.error_title')}
        </p>
        <p className="font-body text-[14px] text-text-secondary mb-8 text-center max-w-md">
          {error}
        </p>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 font-mono text-[10px] tracking-[2px] uppercase text-accent border border-accent/40 rounded-full px-6 py-2.5 hover:bg-accent hover:text-bg-dark transition-all duration-200"
        >
          <RefreshCw className="w-3 h-3" />
          {t('watchlist.retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24 md:pb-0">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 md:mb-8">
        <div>
          <h1 className="font-display text-[20px] md:text-[24px] font-light text-text-main tracking-[3px] uppercase mb-1">
            {t('watchlist.title')}
          </h1>
          <p className="font-mono text-[10px] tracking-[2px] uppercase text-text-muted">
            {watchlistItems.length} {watchlistItems.length === 1 ? t('watchlist.stock_monitored') : t('watchlist.stocks_monitored')}
            {isEnriching && ` • ${t('watchlist.updating_quotes')}`}
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => { setShowAddModal(true); setAddQuery(''); setAddSearchResults([]); setAddError(''); }}
            className="flex items-center gap-2 font-mono text-[10px] tracking-[2px] uppercase text-bg-dark bg-accent rounded-full px-4 py-2 hover:bg-accent/80 transition-all duration-200"
          >
            <Plus className="w-3 h-3" />
            {t('watchlist.add_stock')}
          </button>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 font-mono text-[10px] tracking-[2px] uppercase text-accent border border-accent/40 rounded-full px-4 py-2 hover:bg-accent hover:text-bg-dark disabled:opacity-50 transition-all duration-200"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            {t('watchlist.refresh')}
          </button>
        </div>
      </div>

      {/* Empty State */}
      {watchlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="w-16 h-16 border border-card-border flex items-center justify-center mb-6">
            <Star className="w-6 h-6 text-text-muted" />
          </div>
          <h2 className="font-display text-[18px] font-medium text-text-main tracking-[2px] uppercase mb-2">
            {t('watchlist.empty_title')}
          </h2>
          <p className="font-body text-[14px] text-text-secondary text-center max-w-md leading-relaxed mb-8">
            {t('watchlist.empty_desc')}
          </p>
          <button
            onClick={() => { setShowAddModal(true); setAddQuery(''); setAddSearchResults([]); setAddError(''); }}
            className="flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase text-accent border border-accent/40 rounded-full px-6 py-2.5 hover:bg-accent hover:text-bg-dark transition-all duration-300"
          >
            <Plus className="w-3.5 h-3.5" />
            {t('watchlist.add_first')}
          </button>
        </div>
      ) : (
        <>
          {/* ─── Watchlist Table — Desktop ─── */}
          <div className="hidden md:block bg-card-dark border border-card-border">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_120px_140px_100px_100px_48px] gap-4 px-6 py-3.5 border-b border-card-border">
              <span className="font-mono text-[9px] tracking-[2px] uppercase text-text-muted">{t('watchlist.ticker')}</span>
              <span className="font-mono text-[9px] tracking-[2px] uppercase text-text-muted text-right">{t('watchlist.price')}</span>
              <span className="font-mono text-[9px] tracking-[2px] uppercase text-text-muted text-right">{t('watchlist.change')}</span>
              <span className="font-mono text-[9px] tracking-[2px] uppercase text-text-muted text-right">{t('watchlist.market')}</span>
              <span className="font-mono text-[9px] tracking-[2px] uppercase text-text-muted text-right">{t('watchlist.added')}</span>
              <span className="sr-only">Actions</span>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-hairline">
              {watchlistItems.map((item) => {
                const quote = enrichedData[item.ticker];
                return (
                  <div
                    key={item.id || item.ticker}
                    className="grid grid-cols-[1fr_120px_140px_100px_100px_48px] gap-4 px-6 py-4 hover:bg-surface/30 transition-colors duration-150 group cursor-pointer"
                    onClick={() => handleViewStock(item.ticker)}
                  >
                    {/* Ticker & Company */}
                    <div className="min-w-0">
                      <p className="font-mono text-[13px] text-text-main tracking-[0.5px] group-hover:text-accent transition-colors">
                        {item.ticker}
                      </p>
                      {quote?.companyName && (
                        <p className="font-body text-[12px] text-text-muted truncate mt-0.5">
                          {quote.companyName}
                        </p>
                      )}
                    </div>

                    {/* Price */}
                    <div className="text-right flex items-center justify-end">
                      <span className="font-mono text-[13px] text-text-main">
                        {quote ? formatPrice(quote.currentPrice, quote.currency) : '—'}
                      </span>
                    </div>

                    {/* Change */}
                    <div className="text-right flex items-center justify-end">
                      <ChangeIndicator value={quote?.changePercent} />
                    </div>

                    {/* Market State */}
                    <div className="text-right flex items-center justify-end">
                      {quote?.marketState ? (
                        <span className={`font-mono text-[10px] tracking-[1px] uppercase ${
                          quote.marketState === 'REGULAR' ? 'text-success' : 'text-text-muted'
                        }`}>
                          {quote.marketState === 'REGULAR' ? t('watchlist.open') : quote.marketState === 'CLOSED' ? t('watchlist.closed') : quote.marketState}
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] text-text-muted">—</span>
                      )}
                    </div>

                    {/* Added Date */}
                    <div className="text-right flex items-center justify-end">
                      <span className="font-mono text-[10px] text-text-muted tracking-[0.5px]">
                        {formatAddedDate(item.added_at)}
                      </span>
                    </div>

                    {/* Remove Button */}
                    <div className="flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setRemoveTarget(item.ticker)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-text-muted hover:text-danger transition-all duration-150"
                        aria-label={`Remove ${item.ticker} from watchlist`}
                        title="Remove from watchlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── Watchlist Cards — Mobile ─── */}
          <div className="md:hidden space-y-3">
            {watchlistItems.map((item) => {
              const quote = enrichedData[item.ticker];
              return (
                <div
                  key={item.id || item.ticker}
                  className="bg-card-dark border border-card-border p-4 group"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <button
                      onClick={() => handleViewStock(item.ticker)}
                      className="flex-1 text-left min-w-0"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-surface border border-card-border flex items-center justify-center flex-shrink-0">
                          <span className="font-mono text-[10px] text-text-muted tracking-[1px]">
                            {item.ticker.slice(0, 2)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-mono text-[13px] text-text-main tracking-[0.5px]">{item.ticker}</p>
                          {quote?.companyName && (
                            <p className="font-body text-[11px] text-text-muted truncate">{quote.companyName}</p>
                          )}
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => setRemoveTarget(item.ticker)}
                      className="p-1.5 text-text-muted hover:text-danger transition-colors flex-shrink-0"
                      aria-label={`Remove ${item.ticker}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleViewStock(item.ticker)}
                    className="w-full text-left"
                  >
                    <div className="flex items-center justify-between pt-3 border-t border-hairline">
                      <div>
                        <p className="font-mono text-[9px] tracking-[1.5px] uppercase text-text-muted mb-1">{t('watchlist.price')}</p>
                        <p className="font-mono text-[14px] text-text-main">
                          {quote ? formatPrice(quote.currentPrice, quote.currency) : '—'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-[9px] tracking-[1.5px] uppercase text-text-muted mb-1">{t('watchlist.change')}</p>
                        <ChangeIndicator value={quote?.changePercent} />
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-[9px] tracking-[1.5px] uppercase text-text-muted mb-1">{t('watchlist.status')}</p>
                        {quote?.marketState ? (
                          <span className={`font-mono text-[11px] tracking-[0.5px] ${
                            quote.marketState === 'REGULAR' ? 'text-success' : 'text-text-muted'
                          }`}>
                            {quote.marketState === 'REGULAR' ? t('watchlist.open') : t('watchlist.closed')}
                          </span>
                        ) : (
                          <span className="font-mono text-[11px] text-text-muted">—</span>
                        )}
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Watchlist footer disclaimer */}
          <div className="mt-6 text-center">
            <p className="font-body text-[11px] text-text-muted italic">
              {t('watchlist.footer_disclaimer')}
            </p>
          </div>
        </>
      )}

      {/* ─── Add Stock Modal ─── */}
      {showAddModal && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-[100] transition-opacity"
            onClick={() => setShowAddModal(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-6">
            <div
              className="w-full max-w-[480px] max-h-[80vh] bg-surface border border-card-border flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-labelledby="add-stock-title"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-card-border flex-shrink-0">
                <h2 id="add-stock-title" className="font-mono text-[11px] tracking-[2px] uppercase text-accent mb-1">
                  {t('watchlist.modal_title')}
                </h2>
                <p className="font-body text-[12px] text-text-muted">
                  {t('watchlist.modal_desc')}
                </p>
              </div>

              {/* Search Input */}
              <div className="px-6 py-4 border-b border-card-border flex-shrink-0">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    {isSearching ? (
                      <Loader2 className="h-4 w-4 text-accent animate-spin" />
                    ) : (
                      <Search className="h-4 w-4 text-text-muted group-focus-within:text-accent transition-colors" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={addQuery}
                    onChange={(e) => handleAddSearch(e.target.value)}
                    className="block w-full pl-7 pr-3 py-2 bg-transparent border-b border-card-border font-mono text-[13px] text-text-main placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
                    placeholder={t('watchlist.search_placeholder')}
                    autoFocus
                  />
                </div>
                {addError && (
                  <p className="font-mono text-[11px] text-danger mt-2">{addError}</p>
                )}
              </div>

              {/* Search Results */}
              <div className="flex-1 overflow-y-auto">
                {addQuery.trim() && addSearchResults.length > 0 ? (
                  <div className="divide-y divide-hairline">
                    {addSearchResults.map((stock) => {
                      const alreadyAdded = watchlistItems.some(
                        (w) => w.ticker.toUpperCase() === stock.ticker.toUpperCase()
                      );
                      return (
                        <button
                          key={stock.ticker}
                          onClick={() => !alreadyAdded && handleAddTicker(stock.ticker)}
                          disabled={alreadyAdded || isAdding}
                          className={`w-full text-left px-6 py-3.5 flex items-center justify-between transition-colors ${
                            alreadyAdded
                              ? 'opacity-50 cursor-not-allowed'
                              : 'hover:bg-card-dark cursor-pointer'
                          }`}
                        >
                          <div className="min-w-0">
                            <p className="font-mono text-[13px] text-text-main tracking-[0.5px]">
                              {stock.ticker}
                            </p>
                            <p className="font-body text-[12px] text-text-secondary truncate">
                              {stock.name}
                            </p>
                          </div>
                          {alreadyAdded ? (
                            <span className="font-mono text-[9px] tracking-[1.5px] uppercase text-text-muted border border-card-border px-2 py-1 flex-shrink-0">
                              {t('watchlist.already_added')}
                            </span>
                          ) : (
                            <span className="font-mono text-[9px] tracking-[1.5px] uppercase text-accent flex-shrink-0">
                              {isAdding ? t('watchlist.adding') : t('watchlist.add_btn')}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : addQuery.trim() && !isSearching ? (
                  <div className="flex items-center justify-center py-12">
                    <p className="font-mono text-[11px] text-text-muted tracking-[1px]">{t('watchlist.no_results')}</p>
                  </div>
                ) : !addQuery.trim() ? (
                  <div className="flex items-center justify-center py-12">
                    <p className="font-body text-[13px] text-text-muted italic">{t('watchlist.type_to_search')}</p>
                  </div>
                ) : null}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-card-border flex justify-end flex-shrink-0">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="font-mono text-[10px] tracking-[2px] uppercase text-text-muted border border-card-border rounded-full px-5 py-2 hover:text-text-main hover:border-text-muted transition-colors"
                >
                  {t('watchlist.close')}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ─── Remove Confirmation Modal ─── */}
      <ConfirmModal
        isOpen={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={handleRemoveTicker}
        title={t('watchlist.remove_title')}
        description={t('watchlist.remove_desc', { ticker: removeTarget })}
        confirmLabel={isRemoving ? t('watchlist.removing') : t('watchlist.remove_confirm')}
        variant="danger"
      />
    </div>
  );
};

export default Watchlist;
