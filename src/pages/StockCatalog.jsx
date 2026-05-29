import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, Minus, Plus, Loader2, Search, X,
  ChevronLeft, ChevronRight, Star, StarOff, AlertCircle,
  BarChart2, RefreshCw,
} from 'lucide-react';
import { watchlistService } from '../services/watchlistService';
import api from '../services/api';
import { PageLoader, ActionToast } from '../components/ui/LoadingSpinner';
const formatPrice = (value, currency) => {
  if (value == null) return null;
  if (currency === 'IDR') return `Rp${Number(value).toLocaleString('id-ID')}`;
  return `$${Number(value).toFixed(2)}`;
};

const ChangeIndicator = ({ value }) => {
  if (value == null) return <span className="font-mono text-[12px] text-text-muted">—</span>;
  const isPositive = value > 0;
  const isNeutral = value === 0;
  const colorClass = isPositive ? 'text-success' : isNeutral ? 'text-text-muted' : 'text-danger';
  return (
    <span className={`font-mono text-[12px] ${colorClass} flex items-center gap-1`}>
      {isPositive ? <TrendingUp className="w-3 h-3" /> : isNeutral ? <Minus className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {isPositive ? '+' : ''}{Number(value).toFixed(2)}%
    </span>
  );
};
const SearchBar = ({ value, onChange, onClear, isSearching }) => (
  <div className="relative group flex-1 max-w-md">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      {isSearching
        ? <Loader2 className="w-3.5 h-3.5 text-accent animate-spin" />
        : <Search className="w-3.5 h-3.5 text-text-muted group-focus-within:text-accent transition-colors duration-200" />
      }
    </div>
    <input
      id="stock-search"
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Cari ticker atau nama perusahaan…"
      className="w-full pl-9 pr-8 py-2 bg-surface border border-card-border font-mono text-[12px] text-text-main placeholder-text-muted focus:outline-none focus:border-accent/60 transition-colors duration-200"
      autoComplete="off"
      spellCheck="false"
    />
    {value && (
      <button
        onClick={onClear}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted hover:text-text-main transition-colors"
        aria-label="Clear search"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    )}
  </div>
);
const SkeletonRow = ({ index }) => (
  <div
    className="grid grid-cols-[1.8fr_1fr_1fr_1.2fr] gap-4 px-5 py-4 border-b border-hairline"
    style={{ animationDelay: `${index * 50}ms` }}
  >
    {[55, 70, 45, 80].map((w, i) => (
      <div key={i} className="flex items-center">
        <div className="shimmer-bar h-3 rounded" style={{ width: `${w}%` }} />
      </div>
    ))}
  </div>
);
const WatchlistButton = ({ ticker, isWatched, isLoading, onAdd, onRemove }) => {
  if (isLoading) {
    return (
      <button
        disabled
        className="flex items-center gap-1.5 font-mono text-[10px] tracking-[1px] uppercase px-3 py-1.5 border border-card-border text-text-muted cursor-not-allowed"
      >
        <Loader2 className="w-3 h-3 animate-spin" />
        <span>…</span>
      </button>
    );
  }

  if (isWatched) {
    return (
      <button
        onClick={e => { e.stopPropagation(); onRemove(ticker); }}
        className="flex items-center gap-1.5 font-mono text-[10px] tracking-[1px] uppercase px-3 py-1.5 border border-danger/40 text-danger hover:bg-danger/10 transition-all duration-200"
        title="Hapus dari Watchlist"
      >
        <StarOff className="w-3 h-3" />
        <span className="hidden sm:inline">Hapus</span>
      </button>
    );
  }

  return (
    <button
      onClick={e => { e.stopPropagation(); onAdd(ticker); }}
      className="flex items-center gap-1.5 font-mono text-[10px] tracking-[1px] uppercase px-3 py-1.5 border border-accent/40 text-accent hover:bg-accent hover:text-bg-dark transition-all duration-200"
      title="Tambah ke Watchlist"
    >
      <Plus className="w-3 h-3" />
      <span className="hidden sm:inline">Watchlist</span>
    </button>
  );
};
const Pagination = ({ currentPage, totalPages, onPageChange, isLoading }) => {
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  const btnBase = 'flex items-center justify-center w-8 h-8 font-mono text-[11px] border transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed';

  return (
    <div className="flex items-center justify-center gap-1.5 py-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className={`${btnBase} border-card-border text-text-muted hover:border-accent/50 hover:text-accent`}
        aria-label="Halaman sebelumnya"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {start > 1 && (
        <>
          <button onClick={() => onPageChange(1)} disabled={isLoading} className={`${btnBase} border-card-border text-text-muted hover:border-accent/50 hover:text-accent`}>1</button>
          {start > 2 && <span className="font-mono text-[12px] text-text-muted px-1">…</span>}
        </>
      )}

      {pages.map(p => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          disabled={isLoading}
          className={`${btnBase} ${p === currentPage
            ? 'border-accent bg-accent text-bg-dark'
            : 'border-card-border text-text-muted hover:border-accent/50 hover:text-accent'
          }`}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="font-mono text-[12px] text-text-muted px-1">…</span>}
          <button onClick={() => onPageChange(totalPages)} disabled={isLoading} className={`${btnBase} border-card-border text-text-muted hover:border-accent/50 hover:text-accent`}>{totalPages}</button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className={`${btnBase} border-card-border text-text-muted hover:border-accent/50 hover:text-accent`}
        aria-label="Halaman berikutnya"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
const DEBOUNCE_MS = 500;

const StockCatalog = () => {
  const navigate = useNavigate();
  const tableTopRef = useRef(null);
  const debounceTimer = useRef(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [stocks, setStocks] = useState([]);
  const [pagination, setPagination] = useState({ totalItems: 0, totalPages: 1, currentPage: 1, limit: 10 });
  const [currentPage, setCurrentPage] = useState(1);
  const [watchedTickers, setWatchedTickers] = useState(new Set());
  const [isLoadingStocks, setIsLoadingStocks] = useState(true);
  const [isLoadingWatchlist, setIsLoadingWatchlist] = useState(true);
  const [stocksError, setStocksError] = useState('');
  const [buttonLoading, setButtonLoading] = useState({});
  const [toastVisible, setToastVisible] = useState(false);
  const [toastLabel, setToastLabel] = useState('');
  const handleSearchChange = (value) => {
    setSearchInput(value);
    setIsDebouncing(true);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setSearchQuery(value.trim());
      setCurrentPage(1);
      setIsDebouncing(false);
    }, DEBOUNCE_MS);
  };

  const handleSearchClear = () => {
    clearTimeout(debounceTimer.current);
    setSearchInput('');
    setSearchQuery('');
    setCurrentPage(1);
    setIsDebouncing(false);
  };

  useEffect(() => () => clearTimeout(debounceTimer.current), []);
  const fetchWatchlist = useCallback(async () => {
    try {
      const items = await watchlistService.getWatchlist();
      setWatchedTickers(new Set(items.map(i => i.ticker.toUpperCase())));
    } catch {
    } finally {
      setIsLoadingWatchlist(false);
    }
  }, []);
  const fetchStocks = useCallback(async (page, search) => {
    setIsLoadingStocks(true);
    setStocksError('');
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      const res = await api.get('/stocks', { params });
      const { data, pagination: pag } = res.data;
      setStocks(data || []);
      setPagination(pag || { totalItems: 0, totalPages: 1, currentPage: page, limit: 10 });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Gagal memuat daftar saham.';
      setStocksError(msg);
      setStocks([]);
    } finally {
      setIsLoadingStocks(false);
    }
  }, []);
  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);
  useEffect(() => {
    fetchStocks(currentPage, searchQuery);
  }, [currentPage, searchQuery, fetchStocks]);
  const handlePageChange = (page) => {
    if (page === currentPage) return;
    setCurrentPage(page);
    setTimeout(() => {
      tableTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };
  const showToast = (label) => { setToastLabel(label); setToastVisible(true); };
  const hideToast = () => setToastVisible(false);
  const handleAddToWatchlist = async (ticker) => {
    setButtonLoading(prev => ({ ...prev, [ticker]: true }));
    showToast(`Menambahkan ${ticker}…`);
    try {
      await watchlistService.addToWatchlist(ticker);
      setWatchedTickers(prev => new Set([...prev, ticker.toUpperCase()]));
    } catch (err) {
      console.error(`[StockCatalog] Failed to add ${ticker}:`, err.message);
    } finally {
      setButtonLoading(prev => ({ ...prev, [ticker]: false }));
      hideToast();
    }
  };

  const handleRemoveFromWatchlist = async (ticker) => {
    setButtonLoading(prev => ({ ...prev, [ticker]: true }));
    showToast(`Menghapus ${ticker}…`);
    try {
      await watchlistService.removeFromWatchlist(ticker);
      setWatchedTickers(prev => {
        const next = new Set(prev);
        next.delete(ticker.toUpperCase());
        return next;
      });
    } catch (err) {
      console.error(`[StockCatalog] Failed to remove ${ticker}:`, err.message);
    } finally {
      setButtonLoading(prev => ({ ...prev, [ticker]: false }));
      hideToast();
    }
  };
  const handleRowClick = (ticker) => {
    if (!watchedTickers.has(ticker.toUpperCase())) return;
    navigate(`/dashboard?stock=${ticker}`);
  };
  if (isLoadingStocks && isLoadingWatchlist && stocks.length === 0 && !searchQuery) {
    return <PageLoader label="Memuat Katalog Saham…" />;
  }
  const isSearchActive = searchQuery.length > 0;
  const noResultsFound = !isLoadingStocks && !stocksError && stocks.length === 0;

  return (
    <div className="pb-24 md:pb-0">
      <div ref={tableTopRef} className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
          <div>
            <h1 className="font-display text-[20px] md:text-[24px] font-light text-text-main tracking-[3px] uppercase mb-1">
              Katalog Saham
            </h1>
            <p className="font-mono text-[10px] tracking-[2px] uppercase text-text-muted">
              {isSearchActive && !isLoadingStocks
                ? `${pagination.totalItems} hasil untuk "${searchQuery}"`
                : pagination.totalItems > 0
                  ? `${pagination.totalItems.toLocaleString('id-ID')} saham IDX tersedia`
                  : isLoadingStocks ? 'Memuat…' : '—'
              }
            </p>
          </div>

          
          <div className="flex items-center gap-2 bg-accent-soft border border-accent/20 px-4 py-2.5 max-w-sm flex-shrink-0">
            <Star className="w-3.5 h-3.5 text-accent flex-shrink-0" />
            <p className="font-mono text-[10px] tracking-[0.5px] text-accent/80 leading-relaxed">
              Tambahkan ke watchlist untuk membuka Analitik Dashboard.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <SearchBar
            value={searchInput}
            onChange={handleSearchChange}
            onClear={handleSearchClear}
            isSearching={isDebouncing || (isLoadingStocks && isSearchActive)}
          />
          {isSearchActive && !isLoadingStocks && (
            <button
              onClick={handleSearchClear}
              className="font-mono text-[10px] tracking-[1.5px] uppercase text-text-muted hover:text-text-main transition-colors whitespace-nowrap"
            >
              Reset
            </button>
          )}
        </div>
      </div>
      {stocksError && (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <AlertCircle className="w-8 h-8 text-danger" />
          <p className="font-mono text-[11px] tracking-[1px] uppercase text-danger text-center max-w-md">{stocksError}</p>
          <button
            onClick={() => fetchStocks(currentPage, searchQuery)}
            className="flex items-center gap-2 font-mono text-[10px] tracking-[2px] uppercase text-accent border border-accent/40 px-5 py-2 hover:bg-accent hover:text-bg-dark transition-all duration-200"
          >
            <RefreshCw className="w-3 h-3" />
            Coba Lagi
          </button>
        </div>
      )}
      {noResultsFound && !stocksError && (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <Search className="w-8 h-8 text-text-muted" />
          <p className="font-mono text-[11px] tracking-[1px] uppercase text-text-muted">
            {isSearchActive ? `Tidak ada saham untuk "${searchQuery}"` : 'Tidak ada data saham.'}
          </p>
          {isSearchActive && (
            <button
              onClick={handleSearchClear}
              className="font-mono text-[10px] tracking-[2px] uppercase text-accent border border-accent/40 px-5 py-2 hover:bg-accent hover:text-bg-dark transition-all duration-200"
            >
              Reset Pencarian
            </button>
          )}
        </div>
      )}
      {!stocksError && (stocks.length > 0 || isLoadingStocks) && (
        <>
          <div className="hidden md:block bg-card-dark border border-card-border">
            
            <div className="grid grid-cols-[1.8fr_1fr_1fr_1.2fr] gap-4 px-5 py-3.5 border-b border-card-border">
              <span className="font-mono text-[9px] tracking-[1.5px] uppercase text-text-muted">Saham</span>
              <span className="font-mono text-[9px] tracking-[1.5px] uppercase text-text-muted text-right">Harga</span>
              <span className="font-mono text-[9px] tracking-[1.5px] uppercase text-text-muted text-right">Perubahan</span>
              <span className="font-mono text-[9px] tracking-[1.5px] uppercase text-text-muted text-right">Aksi</span>
            </div>

            
            <div className="divide-y divide-hairline">
              {isLoadingStocks
                ? Array.from({ length: 10 }, (_, i) => <SkeletonRow key={i} index={i} />)
                : stocks.map((stock) => {
                    const ticker = stock.ticker?.toUpperCase() || '';
                    const isWatched = watchedTickers.has(ticker);
                    const isLoadingBtn = !!buttonLoading[ticker];
                    const canClick = isWatched;

                    return (
                      <div
                        key={ticker}
                        role={canClick ? 'button' : undefined}
                        tabIndex={canClick ? 0 : undefined}
                        onClick={() => handleRowClick(ticker)}
                        onKeyDown={e => e.key === 'Enter' && handleRowClick(ticker)}
                        className={`grid grid-cols-[1.8fr_1fr_1fr_1.2fr] gap-4 px-5 py-4 transition-colors duration-150 group ${
                          canClick ? 'cursor-pointer hover:bg-surface/40' : 'cursor-default'
                        }`}
                      >
                        
                        <div className="min-w-0 flex items-center gap-3">
                          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-300 ${
                            isWatched ? 'bg-accent' : 'bg-transparent border border-card-border'
                          }`} />
                          <div className="min-w-0">
                            <p className={`font-mono text-[13px] tracking-[0.5px] transition-colors ${
                              canClick ? 'text-text-main group-hover:text-accent' : 'text-text-main'
                            }`}>
                              {ticker}
                            </p>
                            {stock.company_name && (
                              <p className="font-body text-[11px] text-text-muted truncate mt-0.5">
                                {stock.company_name}
                              </p>
                            )}
                          </div>
                        </div>

                        
                        <div className="flex items-center justify-end">
                          {stock.current_price != null ? (
                            <span className="font-mono text-[13px] text-text-main">
                              {formatPrice(stock.current_price, stock.currency || 'IDR')}
                            </span>
                          ) : (
                            <span className="font-mono text-[11px] text-text-muted">—</span>
                          )}
                        </div>

                        
                        <div className="flex items-center justify-end">
                          <ChangeIndicator value={stock.change_percent} />
                        </div>

                        
                        <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                          {isWatched && (
                            <button
                              onClick={() => navigate(`/dashboard?stock=${ticker}`)}
                              className="flex items-center gap-1.5 font-mono text-[10px] tracking-[1px] uppercase px-3 py-1.5 border border-card-border text-text-muted hover:border-accent/40 hover:text-accent transition-all duration-200"
                              title="Buka Dashboard Analitik"
                            >
                              <BarChart2 className="w-3 h-3" />
                              <span className="hidden lg:inline">Analisa</span>
                            </button>
                          )}
                          <WatchlistButton
                            ticker={ticker}
                            isWatched={isWatched}
                            isLoading={isLoadingBtn}
                            onAdd={handleAddToWatchlist}
                            onRemove={handleRemoveFromWatchlist}
                          />
                        </div>
                      </div>
                    );
                  })
              }
            </div>
          </div>
          <div className="md:hidden space-y-3">
            {isLoadingStocks
              ? Array.from({ length: 8 }, (_, i) => (
                  <div key={i} className="bg-card-dark border border-card-border p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="shimmer-bar h-4 w-24 rounded" />
                      <div className="shimmer-bar h-7 w-20 rounded" />
                    </div>
                    <div className="shimmer-bar h-3 w-40 rounded mt-1" />
                    <div className="flex justify-between mt-4 pt-3 border-t border-hairline">
                      <div className="shimmer-bar h-4 w-20 rounded" />
                      <div className="shimmer-bar h-4 w-16 rounded" />
                    </div>
                  </div>
                ))
              : stocks.map((stock) => {
                  const ticker = stock.ticker?.toUpperCase() || '';
                  const isWatched = watchedTickers.has(ticker);
                  const isLoadingBtn = !!buttonLoading[ticker];

                  return (
                    <div key={ticker} className="bg-card-dark border border-card-border p-4">
                      
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <button
                          onClick={() => handleRowClick(ticker)}
                          disabled={!isWatched}
                          className={`flex items-center gap-2.5 text-left flex-1 min-w-0 ${isWatched ? 'cursor-pointer' : 'cursor-default'}`}
                        >
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isWatched ? 'bg-accent' : 'bg-card-border'}`} />
                          <div className="min-w-0">
                            <p className={`font-mono text-[13px] tracking-[0.5px] ${isWatched ? 'text-accent' : 'text-text-main'}`}>
                              {ticker}
                            </p>
                            {stock.company_name && (
                              <p className="font-body text-[11px] text-text-muted truncate">{stock.company_name}</p>
                            )}
                          </div>
                        </button>
                        <WatchlistButton
                          ticker={ticker}
                          isWatched={isWatched}
                          isLoading={isLoadingBtn}
                          onAdd={handleAddToWatchlist}
                          onRemove={handleRemoveFromWatchlist}
                        />
                      </div>

                      
                      <div className="flex items-center justify-between pt-3 border-t border-hairline">
                        <div>
                          <p className="font-mono text-[9px] tracking-[1.5px] uppercase text-text-muted mb-1">Harga</p>
                          {stock.current_price != null ? (
                            <p className="font-mono text-[13px] text-text-main">
                              {formatPrice(stock.current_price, stock.currency || 'IDR')}
                            </p>
                          ) : (
                            <p className="font-mono text-[11px] text-text-muted">—</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-[9px] tracking-[1.5px] uppercase text-text-muted mb-1">Perubahan</p>
                          <ChangeIndicator value={stock.change_percent} />
                        </div>
                        {isWatched && (
                          <button
                            onClick={() => navigate(`/dashboard?stock=${ticker}`)}
                            className="flex items-center gap-1 font-mono text-[10px] tracking-[1px] uppercase px-2.5 py-1.5 border border-card-border text-text-muted hover:border-accent/40 hover:text-accent transition-all duration-200"
                          >
                            <BarChart2 className="w-3 h-3" />
                            Analisa
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
            }
          </div>
          {!isLoadingStocks && pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              isLoading={isLoadingStocks}
            />
          )}

          
          {!isLoadingStocks && stocks.length > 0 && (
            <p className="text-center font-mono text-[10px] tracking-[1px] uppercase text-text-muted pb-4">
              Halaman {pagination.currentPage} dari {pagination.totalPages}
              {' · '}{pagination.totalItems.toLocaleString('id-ID')} total saham
            </p>
          )}
        </>
      )}
      <ActionToast visible={toastVisible} label={toastLabel} />
    </div>
  );
};

export default StockCatalog;
