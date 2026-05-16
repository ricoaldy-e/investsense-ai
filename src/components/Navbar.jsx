import { Search, User, Menu } from 'lucide-react';

const Navbar = ({ onMenuClick }) => {
  return (
    <header className="h-16 flex-shrink-0 bg-bg-dark border-b border-card-border flex items-center justify-between px-4 md:px-6 lg:px-8 gap-4">
      {/* Mobile Menu Button */}
      <button onClick={onMenuClick} className="md:hidden p-2 -ml-2 text-text-muted hover:text-text-main transition-colors">
        <Menu className="w-5 h-5" />
      </button>

      {/* Search Bar — bottom-border style */}
      <div className="flex-1 max-w-lg">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-text-muted group-focus-within:text-accent transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-7 pr-3 py-2 bg-transparent border-b border-card-border font-mono text-[13px] text-text-main placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
            placeholder="Search markets (e.g., Apple, Bitcoin)..."
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-4 md:space-x-6">
        {/* Mode Toggle — outlined pills */}
        <div className="hidden sm:flex items-center gap-1 border border-card-border p-1">
          <button className="px-4 py-1.5 font-mono text-[11px] tracking-[1px] uppercase text-bg-dark bg-accent transition-colors">
            Beginner
          </button>
          <button className="px-4 py-1.5 font-mono text-[11px] tracking-[1px] uppercase text-text-muted hover:text-text-main transition-colors">
            Pro
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 md:pl-6 border-l border-card-border">
          <div className="w-8 h-8 rounded-full border border-card-border flex items-center justify-center text-text-muted">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="font-mono text-[12px] tracking-[0.5px] text-text-main hidden sm:block">
            Alex J.
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
