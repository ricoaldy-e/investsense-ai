import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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

  if (isLoading) return <HydrationLoader />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;

