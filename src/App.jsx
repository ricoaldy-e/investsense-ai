import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import GuestRoute from './components/auth/GuestRoute';
import NavigationProgress from './components/NavigationProgress';

// Lazy-loaded pages — each becomes its own chunk at build time
const Landing = lazy(() => import('./pages/Landing'));
const Auth = lazy(() => import('./pages/Auth'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MarketInsight = lazy(() => import('./pages/MarketInsight'));
const Watchlist = lazy(() => import('./pages/Watchlist'));
const StockCatalog = lazy(() => import('./pages/StockCatalog'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Full-screen app loader — shown on first load / lazy chunk fetch
const AppLoader = () => (
  <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center gap-6">
    {/* Top progress bar */}
    <div className="fixed top-0 left-0 right-0 h-[2px] overflow-hidden">
      <div
        className="h-full bg-accent"
        style={{
          width: '40%',
          animation: 'appbar 1.8s ease-in-out infinite alternate',
        }}
      />
    </div>

    {/* Brand mark */}
    <p className="font-mono text-[11px] tracking-[4px] uppercase text-text-main">
      INVESTSENSE AI
    </p>

    {/* Shimmer bars */}
    <div className="flex flex-col gap-2 w-36">
      <div className="h-[1px] shimmer-bar" />
      <div className="h-[1px] shimmer-bar w-3/4" />
      <div className="h-[1px] shimmer-bar w-1/2" />
    </div>

    <p className="font-mono text-[9px] tracking-[3px] uppercase text-text-muted animate-pulse">
      Loading
    </p>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          {/* NProgress top-bar — active on every route change */}
          <NavigationProgress />
          <Suspense fallback={<AppLoader />}>
            <Routes>
              <Route path="/" element={<Landing />} />

              {/* Guest Routes: Only accessible if NOT logged in */}
              <Route element={<GuestRoute />}>
                <Route path="/login" element={<Auth />} />
                <Route path="/register" element={<Auth />} />
              </Route>

              {/* Protected Routes: Only accessible if logged in */}
              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/market-insight" element={<MarketInsight />} />
                  <Route path="/watchlist" element={<Watchlist />} />
                  <Route path="/stocks" element={<StockCatalog />} />
                </Route>
              </Route>

              {/* Catch-all: 404 Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
