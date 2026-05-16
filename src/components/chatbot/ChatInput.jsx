import { useState } from 'react';
import { Send } from 'lucide-react';
import PromptChips from './PromptChips';

const ChatInput = ({ onSend }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleChipSelect = (prompt) => {
    setMessage(prompt);
  };

  return (
    <div className="border-t border-hairline p-4 flex-shrink-0">
      {/* Quick prompts */}
      <div className="mb-3">
        <PromptChips onSelect={handleChipSelect} />
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Ask about stock analysis, market sentiment, risk assessment..."
            rows={1}
            className="w-full bg-card-dark border border-card-border text-text-main font-body text-[14px] leading-relaxed px-4 py-3.5 resize-none placeholder:text-text-muted/60 focus:outline-none focus:border-accent/50 transition-colors duration-200"
          />
        </div>
        <button
          type="submit"
          disabled={!message.trim()}
          className="flex-shrink-0 w-11 h-11 flex items-center justify-center border border-accent/40 text-accent hover:bg-accent hover:text-bg-dark disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-accent transition-all duration-200 rounded-full"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Disclaimer */}
      <p className="mt-2.5 font-body text-[10px] text-text-muted italic text-center">
        AI-generated analysis for educational purposes only. Not financial advice.
      </p>
    </div>
  );
};

export default ChatInput;
