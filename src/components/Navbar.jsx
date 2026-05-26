import { Search, User, Menu, X, BotMessageSquare } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from './ui/ConfirmModal';
import { stockService } from '../services/stockService';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDashboardEmpty, setIsDashboardEmpty] = useState(true);
  const [showClearModal, setShowClearModal] = useState(false);
  
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    // Listen for Zero State from Dashboard
    const handleDashboardState = (e) => setIsDashboardEmpty(e.detail.isEmpty);
    window.addEventListener('dashboardState', handleDashboardState);

    // Close dropdown on outside click
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('dashboardState', handleDashboardState);
      document.removeEventListener('mousedown', handleClickOutside);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsDropdownOpen(true);

    // Debounce search calls (300ms)
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim()) {
      debounceRef.current = setTimeout(async () => {
        try {
          const results = await stockService.searchStocks(query.trim());
          setSearchResults(results);
        } catch {
          setSearchResults([]);
        }
      }, 300);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectStock = (ticker) => {
    setSearchQuery('');
    setSearchResults([]);
    setIsDropdownOpen(false);
    navigate(`/dashboard?stock=${ticker}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      e.preventDefault();
      
      // Poka-Yoke: Cegah search asal-asalan. Hanya pilih jika ada di search results
      const exactMatch = searchResults.find(s => s.ticker.toLowerCase() === searchQuery.trim().toLowerCase());
      if (exactMatch) {
        handleSelectStock(exactMatch.ticker);
      } else if (searchResults.length > 0) {
        handleSelectStock(searchResults[0].ticker);
      }
      // Jika tidak ada di results, Enter tidak akan melakukan apa-apa (mencegah layar error)
    }
  };

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

      {/* Search Bar with Autocomplete */}
      <div className="flex-1 max-w-lg" ref={searchContainerRef}>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-text-muted group-focus-within:text-accent transition-colors" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setIsDropdownOpen(true)}
            onKeyDown={handleKeyDown}
            className="block w-full pl-7 pr-3 py-2 bg-transparent border-b border-card-border font-mono text-[13px] text-text-main placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
            placeholder="Search stocks (e.g., AAPL, TSLA)..."
            aria-label="Search stocks"
            role="combobox"
            aria-expanded={isDropdownOpen && searchQuery.trim().length > 0}
            aria-autocomplete="list"
          />
          
          {/* Autocomplete Dropdown */}
          {isDropdownOpen && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-card-border py-2 max-h-64 overflow-y-auto z-50">
              <p className="px-4 py-1.5 font-mono text-[9px] tracking-[2px] text-text-muted uppercase mb-1">
                Search Results
              </p>
              {searchResults.length > 0 ? (
                searchResults.map((stock) => (
                  <button
                    key={stock.ticker}
                    onClick={() => handleSelectStock(stock.ticker)}
                    className="w-full text-left px-4 py-2 hover:bg-card-dark flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <p className="font-mono text-[13px] text-text-main group-hover:text-accent transition-colors">
                        {stock.ticker}
                      </p>
                      <p className="font-body text-[12px] text-text-secondary">
                        {stock.name}
                      </p>
                    </div>
                    <span className="font-mono text-[9px] tracking-[1px] uppercase text-text-muted bg-bg-dark px-2 py-1">
                      Stock
                    </span>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-center">
                  <p className="font-mono text-[11px] text-text-muted tracking-[1px]">No results found</p>
                </div>
              )}
            </div>
          )}
        </div>
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
