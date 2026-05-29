import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, X, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import useDebounce from '../hooks/useDebounce';
import useOnClickOutside from '../hooks/useOnClickOutside';

const StockSearch = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [fetchError, setFetchError] = useState(false);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const debouncedQuery = useDebounce(query, 500);
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setActiveIndex(-1);
  }, []);

  useOnClickOutside(wrapperRef, handleClose);
  useEffect(() => {
    const trimmed = debouncedQuery.trim();

    if (trimmed.length < 1) {
      setResults([]);
      setIsOpen(false);
      setFetchError(false);
      return;
    }

    let cancelled = false;

    const fetchResults = async () => {
      setIsFetching(true);
      setFetchError(false);
      try {

        const idxQuery = trimmed.endsWith('.JK') ? trimmed : `${trimmed}.JK`;
        const response = await api.get(`/stocks/search?q=${encodeURIComponent(idxQuery)}`);
        if (!cancelled) {
          const raw = response.data?.data ?? [];

          const normalized = raw
            .filter((item) => {
              const sym = item.symbol ?? '';
              const exc = item.exchange ?? '';
              return exc === 'JKT' || sym.endsWith('.JK');
            })
            .map((item) => ({
              ticker: item.symbol ?? item.ticker ?? '',
              name: item.shortname || item.longname || item.name || item.symbol || 'Unknown',
              exchange: item.exchange ?? '',
            }));

          setResults(normalized);
          setIsOpen(normalized.length > 0);
          setActiveIndex(-1);
        }
      } catch (err) {
        if (!cancelled) {
          if (err.response?.status !== 404) {
            setFetchError(true);
          }
          setResults([]);
          setIsOpen(false);
        }
      } finally {
        if (!cancelled) setIsFetching(false);
      }
    };

    fetchResults();

    return () => { cancelled = true; };
  }, [debouncedQuery]);
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    const items = listRef.current.querySelectorAll('[data-result-item]');
    items[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);
  const handleSelect = useCallback((stock) => {

    const rawTicker = (stock.ticker ?? '').toUpperCase();
    const displayTicker = rawTicker.replace(/\.JK$/i, '');
    setQuery(displayTicker);
    setIsOpen(false);
    setActiveIndex(-1);
    setResults([]);
    inputRef.current?.blur();
    navigate(`/dashboard?stock=${rawTicker}`);
  }, [navigate]);
  const handleKeyDown = useCallback((e) => {
    if (!isOpen && e.key !== 'Escape') return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && results[activeIndex]) {
          handleSelect(results[activeIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        handleClose();
        inputRef.current?.blur();
        break;
      default:
        break;
    }
  }, [isOpen, results, activeIndex, handleSelect, handleClose]);
  const handleClear = useCallback(() => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setActiveIndex(-1);
    setFetchError(false);
    inputRef.current?.focus();
  }, []);
  return (
    <div ref={wrapperRef} className="relative w-full max-w-md" id="stock-search-wrapper">
      <div
        className={`
          flex items-center gap-2.5 px-3.5 py-2.5
          bg-surface border rounded-sm
          transition-all duration-200
          ${isOpen
            ? 'border-accent/60 shadow-[0_0_0_1px_rgba(168,181,200,0.15)]'
            : 'border-card-border hover:border-accent/30'
          }
        `}
      >
        
        <div className="flex-shrink-0 w-4 h-4">
          {isFetching ? (
            <Loader2 className="w-4 h-4 text-accent animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-text-muted" />
          )}
        </div>

        <input
          ref={inputRef}
          id="stock-search-input"
          type="text"
          autoComplete="off"
          spellCheck={false}
          value={query}
          placeholder="Cari saham yang tersedia di sistem..."
          aria-label="Search stock ticker"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls="stock-search-listbox"
          aria-activedescendant={activeIndex >= 0 ? `stock-result-${activeIndex}` : undefined}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          className="
            flex-1 bg-transparent outline-none border-none
            font-mono text-[12px] tracking-[1.5px] uppercase
            text-text-main placeholder:text-text-muted placeholder:normal-case
            placeholder:tracking-normal placeholder:font-body placeholder:text-[13px]
          "
        />

        
        {query.length > 0 && (
          <button
            onClick={handleClear}
            aria-label="Clear search"
            className="flex-shrink-0 p-0.5 rounded-sm text-text-muted hover:text-text-main transition-colors duration-150"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      {isOpen && (
        <div
          id="stock-search-listbox"
          role="listbox"
          aria-label="Search results"
          ref={listRef}
          className="
            absolute z-50 top-full left-0 right-0 mt-1
            bg-surface border border-card-border rounded-sm
            shadow-[0_8px_32px_rgba(0,0,0,0.6)]
            max-h-[260px] overflow-y-auto
            divide-y divide-hairline
          "
        >
          {results.map((stock, idx) => {
            const isActive = idx === activeIndex;
            return (
              <div
                key={stock.ticker}
                id={`stock-result-${idx}`}
                role="option"
                aria-selected={isActive}
                data-result-item
                onMouseDown={(e) => {

                  e.preventDefault();
                  handleSelect(stock);
                }}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`
                  flex items-center gap-3 px-4 py-3
                  cursor-pointer transition-all duration-100
                  ${isActive
                    ? 'bg-accent-soft border-l-2 border-l-accent'
                    : 'border-l-2 border-l-transparent hover:bg-accent-soft'
                  }
                `}
              >
                
                <div className={`flex-shrink-0 ${isActive ? 'text-accent' : 'text-text-muted'}`}>
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>

                
                <div className="flex-1 min-w-0">
                  <p className={`font-mono text-[11px] tracking-[2px] uppercase font-medium ${isActive ? 'text-accent' : 'text-text-main'}`}>
                    
                    {(stock.ticker || '').replace(/\.JK$/i, '') || '—'}
                  </p>
                  <p className="font-body text-[12px] text-text-muted truncate mt-0.5 leading-tight">
                    {stock.name || stock.ticker || 'Unknown'}
                  </p>
                </div>

                
                {isActive && (
                  <p className="flex-shrink-0 font-mono text-[9px] tracking-[1.5px] uppercase text-text-muted">
                    ↵ Select
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
      {fetchError && query.trim().length > 0 && !isFetching && (
        <p className="absolute top-full left-0 mt-1.5 font-mono text-[10px] tracking-[1px] uppercase text-danger">
          Search unavailable. Try again.
        </p>
      )}
    </div>
  );
};

export default StockSearch;
