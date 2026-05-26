import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate, useOutletContext } from 'react-router-dom';
import { Loader2, Search, ArrowLeft, RefreshCw } from 'lucide-react';
import { stockService } from '../services/stockService';
import WarningBanner from '../components/WarningBanner';
import StockChartCard from '../components/StockChartCard';
import MarketNewsCard from '../components/MarketNewsCard';
import SentimentAnalysisCard from '../components/SentimentAnalysisCard';
import AIInsightCard from '../components/AIInsightCard';
import RiskAnalysisCard from '../components/RiskAnalysisCard';

const Dashboard = () => {
  const { userMode } = useOutletContext();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const stockFromUrl = searchParams.get('stock');
  const lastViewed = localStorage.getItem('lastViewedStock');
  const hasStock = !!(stockFromUrl || lastViewed);

  const [stockData, setStockData] = useState(null);
  const [isLoading, setIsLoading] = useState(hasStock);
  const [error, setError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Berkomunikasi dengan Navbar.jsx via CustomEvent
  const notifyNavbar = useCallback((isEmpty) => {
    window.dispatchEvent(new CustomEvent('dashboardState', { detail: { isEmpty } }));
  }, []);

  const loadStock = useCallback(async (ticker) => {
    setIsLoading(true);
    setError('');
    notifyNavbar(false); // Data sedang dimuat, layar tidak kosong

    try {
      const data = await stockService.getStockDetail(ticker);
      setStockData(data);
      localStorage.setItem('lastViewedStock', ticker.toUpperCase());
    } catch (err) {
      setError(err.message || 'Failed to load stock data.');
      setStockData(null);
      notifyNavbar(true); // Terjadi error, layar secara teknis kosong
    } finally {
      setIsLoading(false);
    }
  }, [notifyNavbar]);

  const handleClearDashboard = useCallback(() => {
    localStorage.removeItem('lastViewedStock');
    navigate('/dashboard'); // Menghapus ?stock= dari URL
    setStockData(null);
    setError(''); // Membersihkan error agar kembali ke Zero State
    notifyNavbar(true);
    setIsLoading(false);
  }, [navigate, notifyNavbar]);

  const handleRefresh = useCallback(() => {
    const activeTicker = searchParams.get('stock') || localStorage.getItem('lastViewedStock');
    if (activeTicker && !isRefreshing) {
      setIsRefreshing(true);
      loadStock(activeTicker).finally(() => setIsRefreshing(false));
    }
  }, [searchParams, isRefreshing, loadStock]);

  useEffect(() => {
    // Mendengarkan perintah Clear dari Navbar
    const handleClearCmd = () => handleClearDashboard();
    window.addEventListener('clearDashboardCommand', handleClearCmd);

    const activeStock = searchParams.get('stock') || localStorage.getItem('lastViewedStock');

    const timer = setTimeout(() => {
      if (activeStock) {
        loadStock(activeStock);
      } else {
        setStockData(null);
        notifyNavbar(true); // Layar kosong, sembunyikan toggle Beginner/Pro
      }
    }, 0);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('clearDashboardCommand', handleClearCmd);
    };
  }, [searchParams, loadStock, handleClearDashboard, notifyNavbar]);

  if (isLoading) {
    return (
      <div className="pb-24 md:pb-0 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 text-accent animate-spin mb-4" />
        <p className="font-mono text-[11px] tracking-[2px] uppercase text-text-muted">
          Loading market data...
        </p>
      </div>
    );
  }

  // Error State: Memberikan opsi cerdas untuk kembali atau mereset
  if (error) {
    const lastViewed = localStorage.getItem('lastViewedStock');
    const hasValidHistory = lastViewed && lastViewed !== searchParams.get('stock');

    return (
      <div className="pb-24 md:pb-0 flex flex-col items-center justify-center min-h-[60vh]">
        <p className="font-mono text-[12px] tracking-[1px] uppercase text-danger mb-2">
          Data Unavailable
        </p>
        <p className="font-body text-[14px] text-text-secondary mb-8">{error}</p>

        <div className="flex flex-col sm:flex-row gap-4">
          {hasValidHistory && (
            <button
              onClick={() => navigate(`/dashboard?stock=${lastViewed}`)}
              className="flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase text-bg-dark bg-text-main rounded-full px-6 py-2.5 hover:bg-text-secondary transition-all duration-300"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to {lastViewed}
            </button>
          )}
          <button
            onClick={handleClearDashboard}
            className="flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase text-accent border border-accent/40 rounded-full px-6 py-2.5 hover:bg-accent hover:text-bg-dark transition-all duration-300"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Clear Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Zero State: Tampilan elegan untuk pengguna yang benar-benar baru
  if (!stockData && !isLoading && !error) {
    return (
      <div className="pb-24 md:pb-0 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-16 h-16 border border-card-border flex items-center justify-center mb-6">
          <Search className="w-6 h-6 text-text-muted" />
        </div>
        <h2 className="font-display text-[18px] font-medium text-text-main tracking-[2px] uppercase mb-2">
          Initialize Analysis
        </h2>
        <p className="font-body text-[14px] text-text-secondary text-center max-w-md leading-relaxed mb-8">
          Awaiting input. Please enter a stock ticker (e.g., AAPL, TSLA) in the search bar above to generate a clinical-grade market analysis.
        </p>
      </div>
    );
  }

  return (
    <div className="pb-24 md:pb-0 relative">
      <WarningBanner key={stockData?.ticker || 'empty'} data={stockData} mode={userMode} />

      <div className="flex items-center justify-between mb-4">
        <h1 className="font-display text-[18px] md:text-[22px] font-light text-text-main tracking-[3px] uppercase">
          {stockData?.ticker || 'Dashboard'}
        </h1>
        <div className="flex items-center gap-4">
          <p className="font-mono text-[10px] text-text-muted tracking-[1px] uppercase hidden sm:block">
            Data as of: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </p>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 font-mono text-[10px] tracking-[2px] uppercase text-accent border border-accent/40 rounded-full px-4 py-2 hover:bg-accent hover:text-bg-dark disabled:opacity-50 transition-all duration-200"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Fluid grid — adapts dynamically to container width (AI panel resize) */}
      <div className="grid gap-4 md:gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))' }}>
        {/* Stock Chart — always full width */}
        <div style={{ gridColumn: '1 / -1' }}>
          <StockChartCard data={stockData} mode={userMode} />
        </div>

        {/* Analysis cards — fluid fill */}
        <SentimentAnalysisCard data={stockData} mode={userMode} />
        <AIInsightCard data={stockData} mode={userMode} />
        <MarketNewsCard data={stockData} mode={userMode} />
        <RiskAnalysisCard data={stockData} mode={userMode} />
      </div>
    </div>
  );
};

export default Dashboard;
