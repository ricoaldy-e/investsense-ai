import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, MessageSquare, User, X, Search, LogOut } from 'lucide-react';
import ConfirmModal from '../ui/ConfirmModal';

const ChatSidebar = ({ isOpen, onClose, onNewAnalysis, activeChatId, onSelectChat, conversations }) => {
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
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed lg:relative z-50 lg:z-auto
        w-[260px] h-full bg-surface border-r border-card-border
        flex flex-col
        transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="h-16 flex flex-shrink-0 items-center justify-between px-6 border-b border-card-border">
          <Link
            to="/"
            className="font-mono text-[13px] text-text-main tracking-[3px] uppercase hover:text-accent transition-colors duration-300"
          >
            INVESTSENSE AI
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-text-muted hover:text-text-secondary p-1 transition-colors"
            aria-label="Close chat sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto py-3">
          <div className="px-5 mb-5 mt-2 space-y-3">
            <Link 
              to="/dashboard"
              className="w-full flex items-center justify-center gap-2 font-mono text-[11px] tracking-[2px] uppercase text-accent border border-accent/40 rounded-full py-2.5 hover:bg-accent hover:text-bg-dark transition-all duration-300"
            >
              <Search className="w-3.5 h-3.5" />
              SEARCH STOCK
            </Link>
            
            <button 
              onClick={onNewAnalysis}
              className="w-full flex items-center justify-center gap-2 font-mono text-[11px] tracking-[2px] uppercase text-accent border border-accent/40 rounded-full py-2.5 hover:bg-accent hover:text-bg-dark transition-all duration-300"
            >
              <Plus className="w-3.5 h-3.5" />
              NEW ANALYSIS
            </button>
          </div>

          <p className="px-5 mb-3 font-mono text-[9px] tracking-[2px] uppercase text-text-muted">
            RECENT
          </p>
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelectChat(conv.id)}
              className={`
                w-full text-left px-5 py-3 flex items-start gap-3
                transition-colors duration-200
                ${activeChatId === conv.id
                  ? 'bg-card-dark border-l-2 border-accent text-text-main'
                  : 'border-l-2 border-transparent text-text-secondary hover:text-text-main hover:bg-card-dark/50'
                }
              `}
            >
              <MessageSquare className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-text-muted" />
              <div className="min-w-0">
                <p className="font-mono text-[11px] tracking-[0.5px] truncate">
                  {conv.title}
                </p>
                <p className="font-mono text-[9px] text-text-muted mt-1">
                  {conv.time}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-card-border p-4 space-y-1">
          <div className="space-y-1">

            <div className="w-full flex items-center gap-3 px-3 py-2.5 text-text-main transition-colors">
              <User className="w-3.5 h-3.5 text-text-muted" />
              <span className="font-mono text-[10px] tracking-[1.5px] uppercase truncate">{username}</span>
            </div>

            <button 
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-text-muted hover:text-text-secondary transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="font-mono text-[10px] tracking-[1.5px] uppercase">Logout</span>
            </button>
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

export default ChatSidebar;
