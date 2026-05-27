import { User, Menu, X, BotMessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from './ui/ConfirmModal';
import StockSearch from './StockSearch';

const Navbar = ({ onMenuClick, isSidebarOpen, onCloseSidebar, userMode, onModeChange, onToggleAIPanel, isPanelOpen, isMobile }) => {
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
  const [isDashboardEmpty, setIsDashboardEmpty] = useState(true);
  const [showClearModal, setShowClearModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Listen for Zero State from Dashboard
    const handleDashboardState = (e) => setIsDashboardEmpty(e.detail.isEmpty);
    window.addEventListener('dashboardState', handleDashboardState);
    return () => window.removeEventListener('dashboardState', handleDashboardState);
  }, []);


  return (
    <>
    <header className="h-16 flex-shrink-0 bg-bg-dark border-b border-card-border flex items-center justify-between px-4 md:px-6 lg:px-8 gap-4 z-50">
      {/* Mobile Menu Button */}
      <button 
        onClick={isSidebarOpen ? onCloseSidebar : onMenuClick} 
        className="md:hidden p-2 -ml-2 text-text-muted hover:text-text-main transition-colors z-50" 
        aria-label={isSidebarOpen ? "Close navigation menu" : "Open navigation menu"}
      >
        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Search Bar — StockSearch handles debounce, dropdown, and Zustand state */}
      <div className="flex-1 max-w-lg">
        <StockSearch />
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-4 md:space-x-6">
        {/* Tools & Mode Toggle — Hidden in Zero State */}
        {!isDashboardEmpty && (
          <div className="hidden sm:flex items-center gap-4 transition-opacity duration-500">
            <button 
              onClick={() => setShowClearModal(true)}
              className="font-mono text-[10px] tracking-[1px] uppercase text-text-muted hover:text-danger transition-colors flex items-center gap-1.5"
              title="Clear Analysis"
            >
              <X className="w-3.5 h-3.5" /> Clear
            </button>
            <div className="flex items-center gap-1 border border-card-border p-1" role="group" aria-label="Analysis mode">
              <button 
                onClick={() => onModeChange('beginner')}
                aria-pressed={userMode === 'beginner'}
                className={`px-4 py-1.5 font-mono text-[11px] tracking-[1px] uppercase transition-colors ${
                  userMode === 'beginner' ? 'bg-accent text-bg-dark' : 'text-text-muted hover:text-text-main'
                }`}
              >
                Beginner
              </button>
              <button 
                onClick={() => onModeChange('pro')}
                aria-pressed={userMode === 'pro'}
                className={`px-4 py-1.5 font-mono text-[11px] tracking-[1px] uppercase transition-colors ${
                  userMode === 'pro' ? 'bg-accent text-bg-dark' : 'text-text-muted hover:text-text-main'
                }`}
              >
                Pro
              </button>
            </div>
          </div>
        )}

        {/* Mobile AI Panel Toggle */}
        {isMobile && onToggleAIPanel && (
          <button
            onClick={onToggleAIPanel}
            className={`md:hidden p-2 transition-colors ${
              isPanelOpen ? 'text-accent' : 'text-text-muted hover:text-text-main'
            }`}
            aria-label={isPanelOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
          >
            <BotMessageSquare className="w-5 h-5" />
          </button>
        )}

        {/* User Profile — Hidden on mobile, shown on tablet/desktop */}
        <div className="hidden sm:flex items-center gap-3 pl-4 md:pl-6 border-l border-card-border">
          <div className="w-8 h-8 rounded-full border border-card-border flex items-center justify-center text-text-muted">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="font-mono text-[12px] tracking-[0.5px] text-text-main">
            {username}
          </span>
        </div>
      </div>
    </header>

    {/* Clear Dashboard Confirmation Modal */}
    <ConfirmModal
      isOpen={showClearModal}
      onClose={() => setShowClearModal(false)}
      onConfirm={() => window.dispatchEvent(new CustomEvent('clearDashboardCommand'))}
      title="Clear Analysis"
      description="This will reset the dashboard and remove the current stock analysis from view. You can search for a new stock at any time."
      confirmLabel="CLEAR"
      variant="neutral"
    />
    </>
  );
};

export default Navbar;
