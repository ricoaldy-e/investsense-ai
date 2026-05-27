import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate, useOutletContext } from 'react-router-dom';
import { Loader2, Search, ArrowLeft, RefreshCw, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { stockService } from '../services/stockService';
import { watchlistService } from '../services/watchlistService';
import WarningBanner from '../components/WarningBanner';
import StockChartCard from '../components/StockChartCard';
import MarketNewsCard from '../components/MarketNewsCard';
import SentimentAnalysisCard from '../components/SentimentAnalysisCard';
import AIInsightCard from '../components/AIInsightCard';
import RiskAnalysisCard from '../components/RiskAnalysisCard';
import useDashboardStore from '../store/useDashboardStore';

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const { userMode } = useOutletContext();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // ─── Zustand global state ─────────────────────────────────────────────────
  const activeTicker    = useDashboardStore((s) => s.activeTicker);
  const setActiveTicker = useDashboardStore((s) => s.setActiveTicker);

  const stockFromUrl = searchParams.get('stock');
  const lastViewed   = localStorage.getItem('lastViewedStock');
  const hasStock     = !!(stockFromUrl || lastViewed);

  // ─── Local State ──────────────────────────────────────────────────────────
  const [stockData, setStockData]           = useState(null);
  const [isLoading, setIsLoading]           = useState(hasStock);
  const [error, setError]                   = useState('');
  const [isRefreshing, setIsRefreshing]     = useState(false);
  const [isInWatchlist, setIsInWatchlist]   = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  // ─── Ref to skip the Zustand effect on the very first render ─────────────
  // The URL-param effect already handles the initial load from ?stock= or localStorage.
  // We only want the Zustand effect to fire on SUBSEQUENT activeTicker changes
  // (i.e., when the user searches from the Navbar after the page has mounted).
  const isFirstRender = useRef(true);

  // ─── Navbar communication via CustomEvent ─────────────────────────────────
  const notifyNavbar = useCallback((isEmpty) => {
    window.dispatchEvent(new CustomEvent('dashboardState', { detail: { isEmpty } }));
  }, []);

  // ─── Core data loader ─────────────────────────────────────────────────────
  const loadStock = useCallback(async (ticker) => {
    setIsLoading(true);
    setError('');
    notifyNavbar(false);

    try {
      const data = await stockService.getStockDetail(ticker);
      setStockData(data);
      localStorage.setItem('lastViewedStock', ticker.toUpperCase());
      // Keep Zustand store in sync when loading via URL param / localStorage
      setActiveTicker(ticker.toUpperCase());
      checkWatchlistStatus(ticker.toUpperCase());
    } catch (err) {
      setError(err.message || 'Failed to load stock data.');
      setStockData(null);
      notifyNavbar(true);
    } finally {
      setIsLoading(false);
    }
  }, [notifyNavbar, setActiveTicker]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Clear dashboard ──────────────────────────────────────────────────────
  const handleClearDashboard = useCallback(() => {
    localStorage.removeItem('lastViewedStock');
    navigate('/dashboard');
    setStockData(null);
    setError('');
    setActiveTicker(null);
    notifyNavbar(true);
    setIsLoading(false);
  }, [navigate, notifyNavbar, setActiveTicker]);

  // ─── Refresh ──────────────────────────────────────────────────────────────
  const handleRefresh = useCallback(() => {
    const refreshTicker = activeTicker || searchParams.get('stock') || localStorage.getItem('lastViewedStock');
    if (refreshTicker && !isRefreshing) {
      setIsRefreshing(true);
      loadStock(refreshTicker).finally(() => setIsRefreshing(false));
    }
  }, [activeTicker, searchParams, isRefreshing, loadStock]);

  // ─── Watchlist helpers ────────────────────────────────────────────────────
  const checkWatchlistStatus = useCallback(async (ticker) => {
    try {
      const items = await watchlistService.getWatchlist();
      const found = items.some((item) => item.ticker.toUpperCase() === ticker.toUpperCase());
      setIsInWatchlist(found);
    } catch {
      setIsInWatchlist(false);
    }
  }, []);

  const handleToggleWatchlist = useCallback(async () => {
    if (!stockData?.ticker || watchlistLoading) return;
    setWatchlistLoading(true);
    try {
      if (isInWatchlist) {
        await watchlistService.removeFromWatchlist(stockData.ticker);
        setIsInWatchlist(false);
      } else {
        await watchlistService.addToWatchlist(stockData.ticker);
        setIsInWatchlist(true);
      }
    } catch (err) {
      // 409 means already added — just update UI state
      if (err.response?.status === 409) {
        setIsInWatchlist(true);
      }
      console.warn(`[InvestSense Dashboard] Action failed: Unable to toggle watchlist status for ${stockData?.ticker || 'unknown'}.`, err.message);
    } finally {
      setWatchlistLoading(false);
    }
  }, [stockData?.ticker, isInWatchlist, watchlistLoading]);

  // ─── Effect 1: URL param / localStorage initial load ─────────────────────
  useEffect(() => {
    const handleClearCmd = () => handleClearDashboard();
    window.addEventListener('clearDashboardCommand', handleClearCmd);

    const activeStock = searchParams.get('stock') || localStorage.getItem('lastViewedStock');

    const timer = setTimeout(() => {
      if (activeStock) {
        loadStock(activeStock);
      } else {
        setStockData(null);
        notifyNavbar(true);
      }
    }, 0);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('clearDashboardCommand', handleClearCmd);
    };
  }, [searchParams, loadStock, handleClearDashboard, notifyNavbar]);

  // ─── Effect 2: Zustand activeTicker → load data (skips first render) ──────
  // Fires when the user selects a stock from the Navbar's StockSearch.
  // The first render is skipped to avoid double-loading with Effect 1.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!activeTicker) return;
    loadStock(activeTicker);
  }, [activeTicker]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Render: Loading ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="pb-24 md:pb-0 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 text-accent animate-spin mb-4" />
        <p className="font-mono text-[11px] tracking-[2px] uppercase text-text-muted">
          {t('dashboard.loading')}
        </p>
      </div>
    );
  }

  // ─── Render: Error ────────────────────────────────────────────────────────
  if (error) {
    const cachedLastViewed = localStorage.getItem('lastViewedStock');
    const hasValidHistory  = cachedLastViewed && cachedLastViewed !== searchParams.get('stock');

    return (
      <div className="pb-24 md:pb-0 flex flex-col items-center justify-center min-h-[60vh]">
        <p className="font-mono text-[12px] tracking-[1px] uppercase text-danger mb-2">
          {t('dashboard.error_title')}
        </p>
        <p className="font-body text-[14px] text-text-secondary mb-8">{error}</p>
        <div className="flex flex-col sm:flex-row gap-4">
          {hasValidHistory && (
            <button
              onClick={() => navigate(`/dashboard?stock=${cachedLastViewed}`)}
              className="flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase text-bg-dark bg-text-main rounded-full px-6 py-2.5 hover:bg-text-secondary transition-all duration-300"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {t('dashboard.return_to', { stock: cachedLastViewed })}
            </button>
          )}
          <button
            onClick={handleClearDashboard}
            className="flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase text-accent border border-accent/40 rounded-full px-6 py-2.5 hover:bg-accent hover:text-bg-dark transition-all duration-300"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {t('navbar.clear')}
          </button>
        </div>
      </div>
    );
  }

  // ─── Render: Zero State ───────────────────────────────────────────────────
  // Show only when no ticker is active anywhere (Zustand, URL param, localStorage)
  if (!activeTicker && !stockFromUrl && !lastViewed) {
    return (
      <div className="pb-24 md:pb-0 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-16 h-16 border border-card-border flex items-center justify-center mb-6">
          <Search className="w-6 h-6 text-text-muted" />
        </div>
        <h2 className="font-display text-[18px] font-medium text-text-main tracking-[2px] uppercase mb-2">
          {t('dashboard.zero_title')}
        </h2>
        <p className="font-body text-[14px] text-text-secondary text-center max-w-md leading-relaxed mb-8">
          {t('dashboard.zero_desc')}
        </p>
        <p className="font-mono text-[10px] tracking-[2px] uppercase text-text-muted">
          {t('dashboard.search_examples')}
        </p>
      </div>
    );
  }

  // ─── Render: Data ─────────────────────────────────────────────────────────
  return (
    <div className="pb-24 md:pb-0 relative">
      <WarningBanner key={stockData?.ticker || 'empty'} data={stockData} mode={userMode} />

      <div className="flex items-center justify-between mb-4">
        <h1 className="font-display text-[18px] md:text-[22px] font-light text-text-main tracking-[3px] uppercase">
          {stockData?.ticker || activeTicker || 'Dashboard'}
        </h1>
        <div className="flex items-center gap-3">
          <p className="font-mono text-[10px] text-text-muted tracking-[1px] uppercase hidden sm:block">
            {t('dashboard.data_as_of')} {new Date().toLocaleTimeString(i18n.language === 'id' ? 'id-ID' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
          </p>
          <button
            onClick={handleToggleWatchlist}
            disabled={watchlistLoading || !stockData?.ticker}
            className={`flex items-center gap-1.5 font-mono text-[10px] tracking-[1.5px] uppercase rounded-full px-3 py-2 transition-all duration-200 ${
              isInWatchlist
                ? 'text-accent bg-accent/10 border border-accent/30'
                : 'text-text-muted border border-card-border hover:text-accent hover:border-accent/40'
            } disabled:opacity-50`}
            title={isInWatchlist ? t('watchlist.remove_title') : t('watchlist.add_stock')}
          >
            <Star className={`w-3 h-3 ${isInWatchlist ? 'fill-accent' : ''}`} />
            <span className="hidden sm:inline">{isInWatchlist ? t('dashboard.saved') : t('dashboard.watch')}</span>
          </button>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 font-mono text-[10px] tracking-[2px] uppercase text-accent border border-accent/40 rounded-full px-4 py-2 hover:bg-accent hover:text-bg-dark disabled:opacity-50 transition-all duration-200"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            {t('dashboard.refresh')}
          </button>
        </div>
      </div>

      {/* Fluid grid — adapts dynamically to container width (AI panel resize) */}
      <div className="grid gap-4 md:gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))' }}>
        {/* Chart — always full width, self-fetches history from Zustand activeTicker */}
        <div style={{ gridColumn: '1 / -1' }}>
          <StockChartCard data={stockData} mode={userMode} />
        </div>

        {/* News — self-fetching, renders skeleton while stockData loads */}
        <MarketNewsCard mode={userMode} />

        {/* Analysis cards — only render when full stock data is available */}
        {stockData && (
          <>
            <SentimentAnalysisCard data={stockData} mode={userMode} />
            <AIInsightCard data={stockData} mode={userMode} />
            <RiskAnalysisCard data={stockData} mode={userMode} />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
