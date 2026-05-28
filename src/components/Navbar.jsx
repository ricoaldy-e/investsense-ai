import { User, Menu, X, BotMessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from './ui/ConfirmModal';
import LanguageToggle from './ui/LanguageToggle';
import StockSearch from './StockSearch';

const Navbar = ({ onMenuClick, isSidebarOpen, onCloseSidebar, userMode, onModeChange, onToggleAIPanel, isPanelOpen, isMobile }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const username = user?.username || 'Trader';
  const [isDashboardEmpty, setIsDashboardEmpty] = useState(true);
  const [showClearModal, setShowClearModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
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
      <div className="flex items-center space-x-3 md:space-x-4">
        {/* Tools & Mode Toggle — Hidden in Zero State */}
        {!isDashboardEmpty && (
          <div className="hidden sm:flex items-center gap-3 transition-opacity duration-500">
            <button 
              onClick={() => setShowClearModal(true)}
              className="font-mono text-[10px] tracking-[1px] uppercase text-text-muted hover:text-danger transition-colors flex items-center gap-1.5"
              title={t('navbar.clear_title')}
            >
              <X className="w-3.5 h-3.5" /> {t('navbar.clear')}
            </button>
            <div className="flex items-center gap-1 border border-card-border p-1" role="group" aria-label={t('navbar.analysis_mode')}>
              <button 
                onClick={() => onModeChange('beginner')}
                aria-pressed={userMode === 'beginner'}
                className={`px-4 py-1.5 font-mono text-[11px] tracking-[1px] uppercase transition-colors ${
                  userMode === 'beginner' ? 'bg-accent text-bg-dark' : 'text-text-muted hover:text-text-main'
                }`}
              >
                {t('sidebar.mode_beginner')}
              </button>
              <button 
                onClick={() => onModeChange('pro')}
                aria-pressed={userMode === 'pro'}
                className={`px-4 py-1.5 font-mono text-[11px] tracking-[1px] uppercase transition-colors ${
                  userMode === 'pro' ? 'bg-accent text-bg-dark' : 'text-text-muted hover:text-text-main'
                }`}
              >
                {t('sidebar.mode_pro')}
              </button>
            </div>
          </div>
        )}

        {/* ─── Language Toggle — always visible in header on sm+ ─── */}
        <div className="hidden sm:block">
          <LanguageToggle variant="inline" />
        </div>

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

        {/* User Profile — Hidden on mobile */}
        <div className="hidden sm:flex items-center gap-3 pl-3 md:pl-4 border-l border-card-border">
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
      title={t('navbar.clear_title')}
      description={t('navbar.clear_desc')}
      confirmLabel={t('navbar.clear_confirm')}
      variant="neutral"
    />
    </>
  );
};

export default Navbar;
