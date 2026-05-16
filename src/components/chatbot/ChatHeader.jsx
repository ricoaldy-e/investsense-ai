import { Menu, Wifi } from 'lucide-react';

const ChatHeader = ({ onMenuClick }) => {
  return (
    <header className="h-[56px] border-b border-hairline flex items-center justify-between px-5 flex-shrink-0">
      <div className="flex items-center gap-4">
        {/* Mobile menu */}
        <button
          onClick={onMenuClick}
          className="lg:hidden text-text-muted hover:text-text-main transition-colors"
        >
          <Menu className="w-4.5 h-4.5" />
        </button>

        {/* Title */}
        <div>
          <h1 className="font-display text-[15px] font-medium text-text-main tracking-[1px] uppercase">
            AI Investment Assistant
          </h1>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2">
        <Wifi className="w-3 h-3 text-success" />
        <span className="font-mono text-[9px] tracking-[1.5px] uppercase text-success">
          ONLINE
        </span>
        <span className="font-mono text-[9px] text-text-muted ml-1">
          12ms
        </span>
      </div>
    </header>
  );
};

export default ChatHeader;
