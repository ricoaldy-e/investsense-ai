import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  
  // Jika tidak ada token (belum login), tendang ke halaman login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Jika aman, render child routes (misal: Dashboard)
  return <Outlet />;
};

export default ProtectedRoute;
