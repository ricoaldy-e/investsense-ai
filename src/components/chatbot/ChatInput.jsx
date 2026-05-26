import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';

const ChatInput = ({ onSend }) => {
  const [message, setMessage] = useState('');
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <div className="border-t border-hairline flex-shrink-0">
      <div className="max-w-3xl mx-auto px-5 py-5">
        {/* Input row */}
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder={isMobile ? "Ask AI..." : "Ask about stock analysis, market sentiment, risk assessment..."}
              aria-label="Type your investment question"
              rows={1}
              className="w-full bg-card-dark border border-card-border text-text-main font-body text-[14px] leading-relaxed px-4 py-3.5 resize-none placeholder:text-text-muted/60 focus:outline-none focus:border-accent/50 transition-colors duration-200"
            />
          </div>
          <button
            type="submit"
            disabled={!message.trim()}
            aria-label="Send message"
            className="flex-shrink-0 w-[48px] h-[48px] flex items-center justify-center border border-accent/40 text-accent hover:bg-accent hover:text-bg-dark disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-accent transition-all duration-200 rounded-full"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Disclaimer */}
        <p className="mt-3 font-body text-[10px] text-text-muted italic text-center">
          AI-generated analysis for educational purposes only. Not financial advice.
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
