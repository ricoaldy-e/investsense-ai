import { useState, useRef, useEffect } from 'react';
import ChatSidebar from '../components/chatbot/ChatSidebar';
import ChatHeader from '../components/chatbot/ChatHeader';
import ChatInput from '../components/chatbot/ChatInput';
import AnalysisReportCard from '../components/chatbot/AnalysisReportCard';
import InsightPanel from '../components/chatbot/InsightPanel';
import { chatService } from '../services/chatService';

const Chatbot = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [insightOpen, setInsightOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll ke pesan terbaru
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    // 1. Tambahkan pesan user ke layar
    const userMsg = { id: Date.now(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    
    // 2. Tampilkan indikator loading AI
    setIsTyping(true);
    
    try {
      // 3. Panggil otak AI (simulasi backend)
      const aiResponse = await chatService.sendMessage(text);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen bg-bg-dark overflow-hidden">
      {/* Left Sidebar */}
      <ChatSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Analysis Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatHeader onMenuClick={() => setSidebarOpen(true)} />

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
                  
                  {msg.role === 'user' && (
                    <p className="font-mono text-[9px] tracking-[2px] uppercase text-text-muted mb-2">YOUR QUERY</p>
                  )}
                  
                  {msg.role === 'ai' && (
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                      <p className="font-mono text-[10px] tracking-[2px] uppercase text-accent">AI RESPONSE</p>
                    </div>
                  )}

                  <p className={`font-body text-[14px] leading-relaxed ${msg.role === 'ai' ? 'text-text-secondary' : 'text-text-main'}`}>
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
