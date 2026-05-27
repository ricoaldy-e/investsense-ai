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

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // While the AuthProvider is performing the silent refresh on app load,
  // don't redirect yet — the user may still be authenticated.
  if (isLoading) return <HydrationLoader />;

  // Session is confirmed invalid → send to login
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Session is valid → render the protected child route
  return <Outlet />;
};

export default ProtectedRoute;

