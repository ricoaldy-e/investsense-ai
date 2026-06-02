import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import GuestRoute from './components/auth/GuestRoute';
import NavigationProgress from './components/NavigationProgress';
import Landing from './pages/Landing';
const Auth = lazy(() => import('./pages/Auth'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MarketInsight = lazy(() => import('./pages/MarketInsight'));
const Watchlist = lazy(() => import('./pages/Watchlist'));
const StockCatalog = lazy(() => import('./pages/StockCatalog'));
const NotFound = lazy(() => import('./pages/NotFound'));
const UserGuide = lazy(() => import('./pages/UserGuide'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
import { AppLoader } from './components/ui/LoadingSpinner';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <NavigationProgress />
          <Suspense fallback={<AppLoader />}>
            <Routes>
              <Route path="/" element={<Landing />} />

              
              <Route element={<GuestRoute />}>
                <Route path="/login" element={<Auth />} />
                <Route path="/register" element={<Auth />} />
              </Route>

              
              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/market-insight" element={<MarketInsight />} />
                  <Route path="/watchlist" element={<Watchlist />} />
                  <Route path="/stocks" element={<StockCatalog />} />
                </Route>
              </Route>

              <Route path="/guide" element={<UserGuide />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />

              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
