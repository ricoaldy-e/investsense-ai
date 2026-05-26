import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import ChatSidebar from '../components/chatbot/ChatSidebar';
import ChatHeader from '../components/chatbot/ChatHeader';
import ChatInput from '../components/chatbot/ChatInput';
import InsightPanel from '../components/chatbot/InsightPanel';
import { chatService } from '../services/chatService';

const conversationsData = [
  { id: 0, title: 'Analyze BBCA Sentiment', time: '2m ago' },
  { id: 1, title: 'Tesla Risk Assessment', time: '1h ago' },
  { id: 2, title: 'RSI Indicator Explained', time: '3h ago' },
  { id: 3, title: 'Market News Summary', time: 'Yesterday' },
];

const getMockMessages = (chatId) => {
  if (chatId === 0) {
    return [
      { id: 1, role: 'user', content: 'Analyze BBCA Sentiment' },
      { id: 2, role: 'ai', type: 'text', content: 'Bank Central Asia Tbk (BBCA) shows highly resilient bullish sentiment. High institutional inflows and robust retail banking metrics support steady upward valuation.' }
    ];
  }
  if (chatId === 1) {
    return [
      { id: 1, role: 'user', content: 'Tesla Risk Assessment' },
      { id: 2, role: 'ai', type: 'text', content: 'Tesla Inc. (TSLA) exhibits high volatility due to macroeconomic pressures and EV competition. Key risk factors include regulatory changes, margin compression, and dependency on global supply chains.' }
    ];
  }
  if (chatId === 2) {
    return [
      { id: 1, role: 'user', content: 'RSI Indicator Explained' },
      { id: 2, role: 'ai', type: 'text', content: 'The Relative Strength Index (RSI) is a momentum oscillator that measures the speed and change of price movements. Values above 70 indicate overbought conditions, while values below 30 indicate oversold conditions.' }
    ];
  }
  if (chatId === 3) {
    return [
      { id: 1, role: 'user', content: 'Market News Summary' },
      { id: 2, role: 'ai', type: 'text', content: 'Global markets opened mixed today. Technical indicators suggest consolidation in major tech stocks. Focus remains on inflation data releases scheduled for later this week.' }
    ];
  }
  return [];
};

const Chatbot = () => {
  const location = useLocation();
  const [activeChatId, setActiveChatId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [insightOpen, setInsightOpen] = useState(true);
  const [messages, setMessages] = useState(() => getMockMessages(null));
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const hasTriggeredRef = useRef(false);

  // Auto-scroll ke pesan terbaru
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSelectChat = (chatId) => {
    setActiveChatId(chatId);
    setMessages(getMockMessages(chatId));
  };

  const handleSend = useCallback(async (text) => {
    // 1. Tambahkan pesan user ke layar
    const userMsg = { id: Date.now(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);

    // 2. Tampilkan indikator loading AI
    setIsTyping(true);

    try {
      // 3. Panggil otak AI (simulasi backend)
      const aiResponse = await chatService.sendMessage(text);
      setMessages(prev => [...prev, aiResponse]);
    } catch {
      // Tampilkan error sebagai pesan AI agar user mendapat feedback
      const errorMsg = {
        id: Date.now(),
        role: 'ai',
        type: 'error',
        content: 'Analysis engine is temporarily unavailable. Please try again shortly.'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  }, []);

  // Pemicu analisis otomatis ketika navigasi berasal dari tombol melayang di Dashboard
  useEffect(() => {
    if (location.state?.useStockContext && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      const lastStock = localStorage.getItem('lastViewedStock');
      if (lastStock) {
        setTimeout(() => {
          handleSend(`Analyze ${lastStock} Sentiment`);
        }, 0);
      }
    }
  }, [location.state, handleSend]);

  const handleNewAnalysis = () => {
    setActiveChatId(null);
    setMessages([]);
    setSidebarOpen(false);
  };

  // Determine dynamic title for ChatHeader without useless assignments
  const activeChat = conversationsData.find(c => c.id === activeChatId);
  const headerTitle = (activeChatId !== null && activeChat)
    ? activeChat.title
    : (messages.length > 0
      ? (messages.find(m => m.role === 'user')?.content || 'New Analysis')
      : 'New Analysis');

  return (
    <div className="flex h-screen bg-bg-dark overflow-hidden">
      {/* Left Sidebar */}
      <ChatSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewAnalysis={handleNewAnalysis}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        conversations={conversationsData}
      />

      {/* Main Analysis Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatHeader onMenuClick={() => setSidebarOpen(true)} title={headerTitle} />

        {/* Analysis content — scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-5 py-8 space-y-8">

            {/* Zero State / Empty Chat */}
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                <div className="w-12 h-12 border border-card-border flex items-center justify-center mb-6">
                  <span className="font-mono text-[14px] text-accent">AI</span>
                </div>
                <h2 className="font-display text-[16px] text-text-main tracking-[2px] uppercase mb-2">
                  System Ready
                </h2>
                <p className="font-body text-[14px] text-text-secondary max-w-sm leading-relaxed">
                  I am the InvestSense AI Assistant. Provide a stock ticker or ask an investment question to begin clinical analysis.
                </p>
              </div>
            )}

            {/* Chat History Render */}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-card-dark border border-card-border p-5' : ''}`}>

                  {msg.type === 'error' && (
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-1.5 h-1.5 bg-danger rounded-full" />
                      <p className="font-mono text-[10px] tracking-[2px] uppercase text-danger">SYSTEM NOTICE</p>
                    </div>
                  )}

                  <p className={`font-body text-[14px] leading-relaxed ${msg.type === 'error' ? 'text-danger/80' : msg.role === 'ai' ? 'text-text-secondary' : 'text-text-main'}`}>
                    {msg.content}
                  </p>

                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-ping" />
                <p className="font-mono text-[10px] tracking-[2px] uppercase text-text-muted animate-pulse">
                  [ANALYZING MARKET DATA...]
                </p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area — fixed bottom */}
        <ChatInput onSend={handleSend} />
      </div>

      {/* Right Insight Panel */}
      <InsightPanel
        isOpen={insightOpen}
        onToggle={() => setInsightOpen(!insightOpen)}
      />
    </div>
  );
};

export default Chatbot;
