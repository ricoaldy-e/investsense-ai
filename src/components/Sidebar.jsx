import { LayoutDashboard as LayoutDashboardIcon, MessageSquare as MessageSquareIcon, LogOut as LogOutIcon, Info, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity" 
          onClick={onClose}
        />
      )}

      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-bg-dark border-r border-card-border flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        {/* Brand Logo */}
        <div className="h-16 flex flex-shrink-0 items-center justify-between px-6 border-b border-card-border">
          <span className="font-mono text-[12px] text-text-main tracking-[3px] uppercase">
            INVESTSENSE AI
          </span>
          <button onClick={onClose} className="md:hidden text-text-muted hover:text-text-secondary p-1 transition-colors">
            <X className="w-5 h-5" />
          </button>
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
          <nav className="space-y-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center px-6 py-3 border-l-2 transition-colors duration-200 ${
                  isActive
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
              className={({ isActive }) =>
                `flex items-center px-6 py-3 border-l-2 transition-colors duration-200 ${
                  isActive
                    ? 'border-accent text-text-main bg-accent-soft'
                    : 'border-transparent text-text-secondary hover:text-text-main hover:bg-surface'
                }`
              }
            >
              <MessageSquareIcon className="w-4 h-4 mr-3" />
              <span className="font-mono text-[12px] tracking-[1px] uppercase">Chatbot</span>
            </NavLink>

            {/* Divider */}
            <div className="mx-6 my-4 border-b border-card-border"></div>

            {/* Logout Menu */}
            <button className="w-full flex items-center px-6 py-3 border-l-2 border-transparent text-text-muted hover:text-text-secondary hover:bg-surface transition-colors duration-200">
              <LogOutIcon className="w-4 h-4 mr-3" />
              <span className="font-mono text-[12px] tracking-[1px] uppercase">Logout</span>
            </button>
          </nav>
        </div>

        <div>
          {/* Beginner Mode info card */}
          <div className="px-4">
            <div className="bg-surface border border-card-border p-4 flex gap-3">
              <Info className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
              <p className="font-body text-[13px] text-text-secondary leading-relaxed">
                You are currently in <span className="text-accent">Beginner Mode</span>. 
                High-risk trading actions are hidden to help you learn.
              </p>
            </div>
          </div>
        </div>
      </div>
      </aside>
    </>
  );
};

export default Sidebar;
