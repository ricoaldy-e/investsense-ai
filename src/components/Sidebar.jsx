import { LayoutDashboard as LayoutDashboardIcon, MessageSquare as MessageSquareIcon, LogOut as LogOutIcon, Info, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity" 
          onClick={onClose}
        />
      )}

      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-bg-dark border-r border-card-border flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        {/* Brand Logo */}
        <div className="h-16 flex flex-shrink-0 items-center justify-between px-6 border-b border-card-border">
          <h1 className="text-xl font-bold text-white tracking-wide">
            InvestSense <span className="text-brand-blue">AI</span>
          </h1>
          <button onClick={onClose} className="md:hidden text-text-muted hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

      <div className="flex-1 flex flex-col justify-between py-6 overflow-y-auto">
        <div>
          {/* Section Title */}
          <div className="px-6 mb-4">
            <h2 className="text-xs font-bold text-brand-blue uppercase tracking-wider">
              Investsense Intelligence
            </h2>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center px-6 py-3 border-r-4 transition-colors ${
                  isActive
                    ? 'border-brand-blue bg-brand-blue/10 text-brand-blue'
                    : 'border-transparent text-text-muted hover:bg-card-dark hover:text-white'
                }`
              }
            >
              <LayoutDashboardIcon className="w-5 h-5 mr-3" />
              <span className="font-medium">Dashboard</span>
            </NavLink>

            <NavLink
              to="/chatbot"
              className={({ isActive }) =>
                `flex items-center px-6 py-3 border-r-4 transition-colors ${
                  isActive
                    ? 'border-brand-blue bg-brand-blue/10 text-brand-blue'
                    : 'border-transparent text-text-muted hover:bg-card-dark hover:text-white'
                }`
              }
            >
              <MessageSquareIcon className="w-5 h-5 mr-3" />
              <span className="font-medium">Chatbot</span>
            </NavLink>

            {/* Divider */}
            <div className="mx-6 my-4 border-b border-card-border"></div>

            {/* Logout Menu */}
            <button className="w-full flex items-center px-6 py-3 border-l-4 border-transparent text-text-muted hover:bg-card-dark hover:text-white transition-colors">
              <LogOutIcon className="w-5 h-5 mr-3" />
              <span className="font-medium">Logout</span>
            </button>
          </nav>
        </div>

        <div>
          {/* Beginner Mode info card */}
          <div className="px-4">
            <div className="bg-card-dark border border-card-border rounded-xl p-4 flex gap-3 text-sm">
              <Info className="w-5 h-5 text-brand-blue flex-shrink-0 mt-0.5" />
              <p className="text-text-muted leading-relaxed">
                You are currently in <span className="text-brand-blue font-semibold">Beginner Mode</span>. 
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
