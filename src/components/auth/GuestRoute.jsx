import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// ─── Minimal spinner shown during app-load hydration ──────────────────────
const HydrationLoader = () => (
  <div className="min-h-screen bg-bg-dark flex items-center justify-center">
    <div className="text-center">
      <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse mx-auto mb-4" />
      <p className="font-mono text-[10px] tracking-[3px] uppercase text-text-muted">
        Loading
      </p>
    </div>
  </div>
);

const GuestRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // While the AuthProvider is performing the silent refresh on app load,
  // don't redirect yet — we don't know the auth state yet.
  if (isLoading) return <HydrationLoader />;

  // Already authenticated → send away from auth pages to dashboard
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  // Not authenticated → allow access to login / register pages
  return <Outlet />;
};

export default GuestRoute;

