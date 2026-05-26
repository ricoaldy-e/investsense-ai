import { Menu } from 'lucide-react';

const ChatHeader = ({ onMenuClick, title }) => {
  return (
    <header className="h-16 border-b border-card-border flex items-center justify-between px-5 flex-shrink-0">
      <div className="flex items-center gap-4">
        {/* Mobile menu */}
        <button
          onClick={onMenuClick}
          className="lg:hidden text-text-muted hover:text-text-main transition-colors"
          aria-label="Open chat sidebar"
        >
          <Menu className="w-4.5 h-4.5" />
        </button>

        {/* Title */}
        <div>
          <h1 className="font-display text-[15px] font-medium text-text-main tracking-[1px] uppercase">
            {title}
          </h1>
        </div>
      </div>


    </header>
  );
};

export default ChatHeader;
