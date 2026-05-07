import { Search, User, Menu } from 'lucide-react';

const Navbar = ({ onMenuClick }) => {
  return (
    <header className="h-16 flex-shrink-0 bg-bg-dark border-b border-card-border flex items-center justify-between px-4 md:px-6 lg:px-8 gap-4">
      {/* Mobile Menu Button */}
      <button onClick={onMenuClick} className="md:hidden p-2 -ml-2 text-text-muted hover:text-white transition-colors">
        <Menu className="w-6 h-6" />
      </button>

      {/* Search Bar */}
      <div className="flex-1 max-w-lg">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-text-muted group-focus-within:text-brand-blue transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 bg-card-dark border border-card-border rounded-lg text-sm text-text-main placeholder-text-muted focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
            placeholder="Search markets (e.g., Apple, Bitcoin)..."
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-4 md:space-x-6">
        {/* Mode Toggle */}
        <div className="hidden sm:flex items-center bg-card-dark p-1 rounded-lg border border-card-border">
          <button className="px-4 py-1.5 text-sm font-medium rounded-md bg-brand-blue text-white shadow-sm transition-colors">
            Beginner
          </button>
          <button className="px-4 py-1.5 text-sm font-medium rounded-md text-text-muted hover:text-white transition-colors">
            Pro Mode
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 md:pl-6 border-l border-card-border">
          <div className="w-8 h-8 rounded-full bg-brand-blue/20 text-brand-blue flex items-center justify-center border border-brand-blue/30">
            <User className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium text-white hidden sm:block">
            Alex J.
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
