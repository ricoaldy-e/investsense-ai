import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AppLoader } from '../ui/LoadingSpinner';

const GuestRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <AppLoader />;

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
};

export default GuestRoute;

