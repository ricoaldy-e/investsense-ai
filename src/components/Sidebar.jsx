import { useState } from 'react';
import { LayoutDashboard as LayoutDashboardIcon, TrendingUp as TrendingUpIcon, Star as StarIcon, LogOut as LogOutIcon, Info } from 'lucide-react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import ConfirmModal from './ui/ConfirmModal';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose, userMode, onModeChange }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  /**
   * Delegates entirely to AuthContext.logout(), which:
   *  1. Calls authService.logout() → asks the server to invalidate the
   *     refreshToken in the DB and clear the httpOnly cookie.
   *  2. In the finally block, removes 'accessToken' and 'username' from
   *     localStorage regardless of whether the server call succeeded.
   *  3. Dispatches LOGOUT to the reducer, setting isAuthenticated → false.
   * After that we navigate to /login.
   */
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      // logout() itself is already try/catch/finally guarded inside AuthContext.
      // This outer catch is a last-resort safety net for unexpected throws.
      console.error('[Sidebar] Unexpected error during logout:', error);
    } finally {
      navigate('/login');
    }
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center px-6 py-3 border-l-2 transition-colors duration-200 ${isActive
      ? 'border-accent text-text-main bg-accent-soft'
      : 'border-transparent text-text-secondary hover:text-text-main hover:bg-surface'
    }`;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed top-16 inset-x-0 bottom-0 bg-black/60 z-30 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside className={`fixed md:static top-16 md:top-0 bottom-0 left-0 z-40 md:z-50 w-64 bg-bg-dark border-r border-card-border flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        {/* Brand Logo - hidden on mobile, shown on desktop */}
        <div className="h-16 hidden md:flex flex-shrink-0 items-center justify-between px-6 border-b border-card-border">
          <Link
            to="/"
            className="font-mono text-[13px] text-text-main tracking-[3px] uppercase hover:text-accent transition-colors duration-300"
          >
            INVESTSENSE AI
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-between py-6 overflow-y-auto">
          <div>
            {/* Section Title */}
            <div className="px-6 mb-5">
              <p className="font-mono text-[10px] text-accent tracking-[2px] uppercase">
                Intelligence
              </p>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1" aria-label="Main navigation">
              <NavLink to="/dashboard" className={navLinkClass}>
                <LayoutDashboardIcon className="w-4 h-4 mr-3" />
                <span className="font-mono text-[12px] tracking-[1px] uppercase">Dashboard</span>
              </NavLink>

              <NavLink to="/market-insight" className={navLinkClass}>
                <TrendingUpIcon className="w-4 h-4 mr-3" />
                <span className="font-mono text-[12px] tracking-[1px] uppercase">Market Insight</span>
              </NavLink>

              <NavLink to="/watchlist" className={navLinkClass}>
                <StarIcon className="w-4 h-4 mr-3" />
                <span className="font-mono text-[12px] tracking-[1px] uppercase">Watchlist</span>
              </NavLink>
            </nav>
          </div>

          {/* Bottom Section */}
          <div className="px-4 space-y-4">
            {/* Mobile Mode Toggle (only visible on mobile/tablet) */}
            <div className="sm:hidden">
              <div className="flex items-center gap-1 border border-card-border p-1 bg-surface" role="group" aria-label="Analysis mode">
                <button 
                  onClick={() => onModeChange?.('beginner')}
                  className={`flex-1 py-1.5 font-mono text-[10px] tracking-[1.5px] uppercase transition-colors text-center ${
                    userMode === 'beginner' ? 'bg-accent text-bg-dark' : 'text-text-muted hover:text-text-main'
                  }`}
                >
                  Beginner
                </button>
                <button 
                  onClick={() => onModeChange?.('pro')}
                  className={`flex-1 py-1.5 font-mono text-[10px] tracking-[1.5px] uppercase transition-colors text-center ${
                    userMode === 'pro' ? 'bg-accent text-bg-dark' : 'text-text-muted hover:text-text-main'
                  }`}
                >
                  Pro
                </button>
              </div>
            </div>

            {/* Mode Info Card */}
            <div className="bg-surface border border-card-border p-4 flex gap-3 mb-4">
              <Info className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
              <p className="font-body text-[13px] text-text-secondary leading-relaxed">
                {userMode === 'beginner' 
                  ? <><span className="text-accent">Beginner Mode</span> is active. Technical terms are simplified to help you learn safely.</>
                  : <><span className="text-accent">Pro Mode</span> is active. Displaying raw data and advanced technical indicators.</>}
              </p>
            </div>
          </div>
        </div>

        {/* Logout — Fixed at the absolute bottom, outside scroll area, no top border */}
        <div className="mt-auto pb-4">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center px-6 py-3 border-l-2 border-transparent text-text-secondary hover:text-text-main hover:bg-surface transition-colors duration-200"
          >
            <LogOutIcon className="w-4 h-4 mr-3" />
            <span className="font-mono text-[12px] tracking-[1px] uppercase">Logout</span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="End Session"
        description="You are about to terminate your current session. Any unsaved analysis context will be cleared."
        confirmLabel="LOG OUT"
        variant="danger"
      />
    </>
  );
};

export default Sidebar;
