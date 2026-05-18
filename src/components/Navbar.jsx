import { Search, User, Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const MOCK_SEARCH_RESULTS = [
  { ticker: 'AAPL', name: 'Apple Inc.', type: 'Stock' },
  { ticker: 'TSLA', name: 'Tesla Inc.', type: 'Stock' },
  { ticker: 'MSFT', name: 'Microsoft Corp.', type: 'Stock' },
  { ticker: 'BBCA.JK', name: 'Bank Central Asia Tbk', type: 'Stock' },
  { ticker: 'GOTO.JK', name: 'GoTo Gojek Tokopedia', type: 'Stock' }
];

const Navbar = ({ onMenuClick, userMode, onModeChange }) => {
  const [username, setUsername] = useState('Guest');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDashboardEmpty, setIsDashboardEmpty] = useState(true);
  
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);

  useEffect(() => {
    // Parse user
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        if (userObj.username) setUsername(userObj.username);
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }

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
    };
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setIsDropdownOpen(true);
  };

  const handleSelectStock = (ticker) => {
    setSearchQuery('');
    setIsDropdownOpen(false);
    navigate(`/dashboard?stock=${ticker}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      e.preventDefault();
      
      // Poka-Yoke: Cegah search asal-asalan. Hanya pilih jika ada di dropdown list
      const exactMatch = MOCK_SEARCH_RESULTS.find(s => s.ticker.toLowerCase() === searchQuery.trim().toLowerCase());
      if (exactMatch) {
        handleSelectStock(exactMatch.ticker);
      } else {
        const filtered = MOCK_SEARCH_RESULTS.filter(s => 
          s.ticker.toLowerCase().includes(searchQuery.toLowerCase()) || 
          s.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (filtered.length > 0) {
          handleSelectStock(filtered[0].ticker);
        }
        // Jika tidak ada di filter, Enter tidak akan melakukan apa-apa (mencegah layar error)
      }
    }
  };

  const filteredStocks = MOCK_SEARCH_RESULTS.filter(s => 
    s.ticker.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="h-16 flex-shrink-0 bg-bg-dark border-b border-card-border flex items-center justify-between px-4 md:px-6 lg:px-8 gap-4 z-50">
      {/* Mobile Menu Button */}
      <button onClick={onMenuClick} className="md:hidden p-2 -ml-2 text-text-muted hover:text-text-main transition-colors">
        <Menu className="w-5 h-5" />
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
          />
          
          {/* Autocomplete Dropdown */}
          {isDropdownOpen && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-card-border shadow-2xl py-2 max-h-64 overflow-y-auto z-50">
              <p className="px-4 py-1.5 font-mono text-[9px] tracking-[2px] text-text-muted uppercase mb-1">
                Search Results
              </p>
              {filteredStocks.length > 0 ? (
                filteredStocks.map((stock) => (
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
                    <span className="font-mono text-[9px] tracking-[1px] uppercase text-text-muted bg-bg-dark px-2 py-1 rounded">
                      {stock.type}
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
              onClick={() => window.dispatchEvent(new CustomEvent('clearDashboardCommand'))}
              className="font-mono text-[10px] tracking-[1px] uppercase text-text-muted hover:text-danger transition-colors flex items-center gap-1.5"
              title="Clear Analysis"
            >
              <X className="w-3.5 h-3.5" /> Clear
            </button>
            <div className="flex items-center gap-1 border border-card-border p-1">
              <button 
                onClick={() => onModeChange('beginner')}
                className={`px-4 py-1.5 font-mono text-[11px] tracking-[1px] uppercase transition-colors ${
                  userMode === 'beginner' ? 'bg-accent text-bg-dark' : 'text-text-muted hover:text-text-main'
                }`}
              >
                Beginner
              </button>
              <button 
                onClick={() => onModeChange('pro')}
                className={`px-4 py-1.5 font-mono text-[11px] tracking-[1px] uppercase transition-colors ${
                  userMode === 'pro' ? 'bg-accent text-bg-dark' : 'text-text-muted hover:text-text-main'
                }`}
              >
                Pro
              </button>
            </div>
          </div>
        )}

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 md:pl-6 border-l border-card-border">
          <div className="w-8 h-8 rounded-full border border-card-border flex items-center justify-center text-text-muted">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="font-mono text-[12px] tracking-[0.5px] text-text-main hidden sm:block">
            {username}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
