import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Chatbot from './pages/Chatbot';
import ProtectedRoute from './components/auth/ProtectedRoute';
import GuestRoute from './components/auth/GuestRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        
        {/* Guest Routes: Only accessible if NOT logged in */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
        </Route>

        {/* Protected Routes: Only accessible if logged in */}
        <Route element={<ProtectedRoute />}>
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            {/* Other dashboard routes can be added here later */}
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;