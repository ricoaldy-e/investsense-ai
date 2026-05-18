import { Navigate, Outlet } from 'react-router-dom';

const GuestRoute = () => {
  const token = localStorage.getItem('token');
  
  // Jika sudah ada token (sudah login), tendang ke dashboard agar tidak masuk ke login page lagi
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  // Jika belum login, izinkan akses (misal: halaman Login / Register)
  return <Outlet />;
};

export default GuestRoute;
