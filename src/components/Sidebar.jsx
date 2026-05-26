import { useState } from 'react';
import { LayoutDashboard as LayoutDashboardIcon, MessageSquare as MessageSquareIcon, LogOut as LogOutIcon, Info, User } from 'lucide-react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import ConfirmModal from './ui/ConfirmModal';

const Sidebar = ({ isOpen, onClose, userMode, onModeChange }) => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [username] = useState(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        return userObj.username || 'Guest';
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }
    return 'Guest';
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

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
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center px-6 py-3 border-l-2 transition-colors duration-200 ${isActive
                    ? 'border-accent text-text-main bg-accent-soft'
                    : 'border-transparent text-text-secondary hover:text-text-main hover:bg-surface'
                  }`
                }
              >
                <LayoutDashboardIcon className="w-4 h-4 mr-3" />
                <span className="font-mono text-[12px] tracking-[1px] uppercase">Dashboard</span>
              </NavLink>

              <NavLink
                to="/chatbot"
                state={{ useStockContext: false }}
                className={({ isActive }) =>
                  `flex items-center px-6 py-3 border-l-2 transition-colors duration-200 ${isActive
                    ? 'border-accent text-text-main bg-accent-soft'
                    : 'border-transparent text-text-secondary hover:text-text-main hover:bg-surface'
                  }`
                }
              >
                <MessageSquareIcon className="w-4 h-4 mr-3" />
                <span className="font-mono text-[12px] tracking-[1px] uppercase">Chatbot</span>
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
            <div className="bg-surface border border-card-border p-4 flex gap-3">
              <Info className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
              <p className="font-body text-[13px] text-text-secondary leading-relaxed">
                {userMode === 'beginner' 
                  ? <><span className="text-accent">Beginner Mode</span> is active. Technical terms are simplified to help you learn safely.</>
                  : <><span className="text-accent">Pro Mode</span> is active. Displaying raw data and advanced technical indicators.</>}
              </p>
            </div>

            {/* User Profile Info & Logout */}
            <div className="border-t border-card-border pt-3 space-y-1">
              <div className="w-full flex items-center gap-3 px-3 py-2 text-text-main transition-colors">
                <User className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
                <span className="font-mono text-[10px] tracking-[1.5px] uppercase truncate">{username}</span>
              </div>

              <button 
                onClick={() => setShowLogoutModal(true)}
                className="w-full flex items-center gap-3 px-3 py-2 text-text-muted hover:text-text-secondary transition-colors"
              >
                <LogOutIcon className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="font-mono text-[10px] tracking-[1.5px] uppercase">Logout</span>
              </button>
            </div>
          </div>
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
