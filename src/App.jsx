import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import GuestRoute from './components/auth/GuestRoute';

// Lazy-loaded pages — each becomes its own chunk at build time
const Landing = lazy(() => import('./pages/Landing'));
const Auth = lazy(() => import('./pages/Auth'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MarketInsight = lazy(() => import('./pages/MarketInsight'));
const Watchlist = lazy(() => import('./pages/Watchlist'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Minimal Cold Surgical loading fallback
const PageLoader = () => (
  <div className="min-h-screen bg-bg-dark flex items-center justify-center">
    <div className="text-center">
      <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse mx-auto mb-4" />
      <p className="font-mono text-[10px] tracking-[3px] uppercase text-text-muted">
        Loading
      </p>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={<PageLoader />}>
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
              </Route>
            </Route>

            {/* Catch-all: 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;