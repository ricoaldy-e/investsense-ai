import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, ChevronLeft, ChevronRight, X, Plus, MessageSquare, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { chatService } from '../services/chatService';
import useDashboardStore from '../store/useDashboardStore';
const generateTitle = (messages) => {
  const firstUser = messages.find(m => m.role === 'user');
  if (!firstUser) return 'New Analysis';
  const text = firstUser.content;
  return text.length > 35 ? text.slice(0, 35) + '…' : text;
};

const EMPTY_MESSAGES = [];

const AIChatPanel = ({ isOpen, onToggle, panelWidth, onWidthChange, isMobile }) => {
  const { t } = useTranslation();
  const activeTicker = useDashboardStore(s => s.activeTicker);
  const [conversations, setConversations] = useState(() => {
    const initialTicker = useDashboardStore.getState().activeTicker;
    const initialMsgs = initialTicker
      ? [{ id: Date.now(), role: 'system', type: 'context', stock: initialTicker }]
      : [];
    return [{ id: Date.now(), isNew: true, messages: initialMsgs }];
  });
  const [activeConvId, setActiveConvId] = useState(() => conversations[0]?.id);
  const [showHistory, setShowHistory] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(0);

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];
  const messages = activeConv?.messages || EMPTY_MESSAGES;
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  }, [inputMessage]);
  useEffect(() => {
    const handleStockChange = () => {
      const lastStock = localStorage.getItem('lastViewedStock');
      if (lastStock && isOpen) {
        setConversations(prev => prev.map(c =>
          c.id === activeConvId
            ? { ...c, messages: [...c.messages, { id: Date.now(), role: 'system', type: 'updated', stock: lastStock }] }
            : c
        ));
      }
    };
    window.addEventListener('stockChanged', handleStockChange);
    return () => window.removeEventListener('stockChanged', handleStockChange);
  }, [isOpen, activeConvId, t]);
  const handleDragStart = useCallback((e) => {
    if (isMobile) return;
    e.preventDefault();
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartWidth.current = panelWidth;
  }, [isMobile, panelWidth]);

  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e) => {
      const delta = dragStartX.current - e.clientX;
      onWidthChange(Math.max(320, Math.min(700, dragStartWidth.current + delta)));
    };
    const handleMouseUp = () => setIsDragging(false);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging, onWidthChange]);
  const handleNewChat = useCallback(() => {
    const newId = Date.now();
    const initialMsgs = activeTicker
      ? [{ id: newId + 1, role: 'system', type: 'context', stock: activeTicker }]
      : [];
    setConversations(prev => [{ id: newId, isNew: true, messages: initialMsgs }, ...prev]);
    setActiveConvId(newId);
    setInputMessage('');
    setShowHistory(false);
  }, [activeTicker, t]);
  const handleDeleteConv = useCallback((convId) => {
    setConversations(prev => {
      const filtered = prev.filter(c => c.id !== convId);
      if (filtered.length === 0) {
        const newId = Date.now();
        const initialMsgs = activeTicker
          ? [{ id: newId + 1, role: 'system', type: 'context', stock: activeTicker }]
          : [];
        const newConv = { id: newId, isNew: true, messages: initialMsgs };
        setActiveConvId(newId);
        return [newConv];
      }
      if (convId === activeConvId) {
        setActiveConvId(filtered[0].id);
      }
      return filtered;
    });
  }, [activeConvId, activeTicker]);
  const handleSend = useCallback(async (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), role: 'user', content: text.trim() };

    setConversations(prev => prev.map(c => {
      if (c.id !== activeConvId) return c;
      const updated = { ...c, messages: [...c.messages, userMsg] };

      if (c.isNew) {
        updated.isNew = false;
        updated.title = generateTitle([...c.messages, userMsg]);
      }
      return updated;
    }));

    setInputMessage('');
    setIsTyping(true);

    try {
      const aiResponse = await chatService.sendMessage({ message: text.trim(), ticker: activeTicker });
      setConversations(prev => prev.map(c =>
        c.id === activeConvId
          ? { ...c, messages: [...c.messages, aiResponse] }
          : c
      ));
    } catch {
      setConversations(prev => prev.map(c =>
        c.id === activeConvId
          ? { ...c, messages: [...c.messages, { id: Date.now(), role: 'ai', type: 'error', contentKey: 'chat_panel.error_unavailable' }] }
          : c
      ));
    } finally {
      setIsTyping(false);
    }
  }, [activeConvId, activeTicker]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend(inputMessage);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputMessage);
    }
  };
  function renderMessages() {
    if (messages.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center px-4">
          <div className="w-12 h-12 border border-card-border flex items-center justify-center mb-5">
            <span className="font-mono text-[13px] text-accent">AI</span>
          </div>
          <h2 className="font-display text-[15px] text-text-main tracking-[2px] uppercase mb-2">
            {t('chat_panel.system_ready')}
          </h2>
          <p className="font-body text-[13px] text-text-secondary leading-relaxed max-w-xs">
            {t('chat_panel.system_ready_desc')}
          </p>
        </div>
      );
    }

    return messages.map((msg) => {
      if (msg.role === 'system') {
        const text = msg.type === 'context'
          ? t('chat_panel.stock_context', { stock: msg.stock })
          : msg.type === 'updated'
            ? t('chat_panel.stock_updated', { stock: msg.stock })
            : msg.content;

        return (
          <div key={msg.id} className="flex justify-center">
            <div className="px-3 py-1.5 border border-card-border">
              <p className="font-mono text-[10px] tracking-[1.5px] uppercase text-accent text-center">
                {text}
              </p>
            </div>
          </div>
        );
      }
      return (
        <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[90%] ${msg.role === 'user' ? 'bg-card-dark border border-card-border p-4' : ''}`}>
            {msg.type === 'error' && (
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 bg-danger rounded-full" />
                <p className="font-mono text-[9px] tracking-[2px] uppercase text-danger">{t('chat_panel.system_notice')}</p>
              </div>
            )}
            <div className={`font-body text-[13px] leading-relaxed ${
              msg.type === 'error' ? 'text-danger/80' : msg.role === 'ai' ? 'text-text-secondary prose prose-sm prose-invert max-w-none' : 'text-text-main'
            }`}>
              {msg.role === 'ai' && msg.type !== 'error' ? (
                <ReactMarkdown
                  components={{
                    p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold text-text-main" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2" {...props} />,
                    li: ({node, ...props}) => <li className="mb-1" {...props} />,
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              ) : msg.contentKey ? t(msg.contentKey) : msg.content}
            </div>
          </div>
        </div>
      );
    });
  }
  function renderTypingIndicator() {
    if (!isTyping) return null;
    return (
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-ping" />
        <p className="font-mono text-[9px] tracking-[2px] uppercase text-text-muted animate-pulse">
          {t('chat_panel.analyzing')}
        </p>
      </div>
    );
  }
  function renderInput() {
    return (
      <div className="border-t border-hairline flex-shrink-0 p-4">
        <form onSubmit={handleSubmit} className="bg-card-dark border border-card-border flex flex-col">
          <textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('chat_panel.placeholder')}
            aria-label={t('chat_panel.placeholder')}
            rows={1}
            className="w-full bg-transparent text-text-main font-body text-[13px] leading-relaxed px-3 pt-3 pb-1 resize-none placeholder:text-text-muted/60 focus:outline-none overflow-y-auto"
            style={{ maxHeight: '120px' }}
          />
          <div className="flex items-center justify-between px-3 pb-2 pt-1">
            <p className="font-body text-[9px] text-text-muted italic">
              {t('chat_panel.not_financial_advice')}
            </p>
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              aria-label="Send message"
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center border border-accent/40 text-accent hover:bg-accent hover:text-bg-dark disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-accent transition-all duration-200 rounded-full"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    );
  }
  function renderHistoryPanel() {
    return (
      <div className="flex flex-col h-full">
        
        <div className="h-14 flex items-center justify-between px-4 border-b border-card-border flex-shrink-0">
          <span className="font-mono text-[11px] tracking-[2px] uppercase text-text-main">{t('chat_panel.history')}</span>
          <button onClick={() => setShowHistory(false)} className="p-1 text-text-muted hover:text-text-main transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        
        <div className="p-3 border-b border-card-border">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 font-mono text-[10px] tracking-[2px] uppercase text-accent border border-accent/40 rounded-full px-4 py-2 hover:bg-accent hover:text-bg-dark transition-all duration-200"
          >
            <Plus className="w-3 h-3" />
            {t('chat_panel.new_chat')}
          </button>
        </div>

        
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`group flex items-center gap-2 px-4 py-3 border-b border-hairline cursor-pointer transition-colors duration-150 ${
                conv.id === activeConvId ? 'bg-accent-soft text-text-main' : 'text-text-secondary hover:bg-surface hover:text-text-main'
              }`}
            >
              <button
                onClick={() => { setActiveConvId(conv.id); setShowHistory(false); }}
                className="flex-1 flex items-center gap-2.5 min-w-0 text-left"
              >
                <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 text-text-muted" />
                <span className="font-mono text-[11px] tracking-[0.5px] truncate">
                  {conv.isNew ? t('chat_panel.new_analysis') : conv.title}
                </span>
              </button>
              {conversations.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteConv(conv.id); }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-text-muted hover:text-danger transition-all duration-150"
                  aria-label="Delete conversation"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
  function renderHeader({ showClose = false }) {
    return (
      <div className="h-14 flex items-center justify-between px-4 border-b border-card-border flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-1.5 text-text-muted hover:text-text-main transition-colors"
            aria-label="Toggle chat history"
            title="Chat history"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          
          <span className="font-mono text-[11px] tracking-[1px] uppercase text-text-main truncate">
            {activeConv?.isNew ? t('chat_panel.new_analysis') : (activeConv?.title || 'AI Assistant')}
          </span>
        </div>
        <div className="flex items-center gap-1">
          
          <button
            onClick={handleNewChat}
            className="p-1.5 text-text-muted hover:text-accent transition-colors"
            aria-label="New chat"
            title="New chat"
          >
            <Plus className="w-4 h-4" />
          </button>
          {showClose && (
            <button onClick={onToggle} className="p-1.5 text-text-muted hover:text-text-main transition-colors" aria-label="Close AI panel">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }
  if (isMobile) {
    return (
      <>
        {isOpen && <div className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300" onClick={onToggle} />}
        <div className={`fixed top-0 right-0 bottom-0 w-[90vw] max-w-[420px] bg-bg-dark border-l border-card-border z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          {renderHeader({ showClose: true })}
          {showHistory ? renderHistoryPanel() : (
            <>
              <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
                {renderMessages()}
                {renderTypingIndicator()}
                <div ref={messagesEndRef} />
              </div>
              {renderInput()}
            </>
          )}
        </div>
      </>
    );
  }
  return (
    <div className="relative flex-shrink-0" style={{ width: isOpen ? `${panelWidth}px` : '0px' }}>
      
      <button
        onClick={onToggle}
        className="absolute -left-6 top-1/2 -translate-y-1/2 z-30 w-6 h-6 bg-bg-dark border border-card-border flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/50 transition-colors duration-200"
        aria-label={isOpen ? 'Collapse AI panel' : 'Expand AI panel'}
        title={isOpen ? 'Collapse AI panel' : 'Expand AI panel'}
      >
        {isOpen ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      
      {isOpen && (
        <div
          className="absolute top-0 bottom-0 left-0 w-1 cursor-col-resize z-20 hover:bg-accent/30 active:bg-accent/50 transition-colors"
          onMouseDown={handleDragStart}
        />
      )}

      
      <div
        className={`h-full bg-bg-dark border-l border-card-border flex flex-col overflow-hidden ${isDragging ? '' : 'transition-all duration-300'}`}
        style={{ width: isOpen ? `${panelWidth}px` : '0px' }}
      >
        {isOpen && (
          <div className="flex flex-col h-full min-w-[320px]">
            {renderHeader({ showClose: false })}
            {showHistory ? renderHistoryPanel() : (
              <>
                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
                  {renderMessages()}
                  {renderTypingIndicator()}
                  <div ref={messagesEndRef} />
                </div>
                {renderInput()}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIChatPanel;
