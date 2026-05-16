import { useState } from 'react';
import ChatSidebar from '../components/chatbot/ChatSidebar';
import ChatHeader from '../components/chatbot/ChatHeader';
import ChatInput from '../components/chatbot/ChatInput';
import AnalysisReportCard from '../components/chatbot/AnalysisReportCard';
import InsightPanel from '../components/chatbot/InsightPanel';

const Chatbot = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [insightOpen, setInsightOpen] = useState(true);

  const handleSend = (message) => {
    // Future: send to AI backend via Axios
    console.log('Sending:', message);
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
          <div className="max-w-3xl mx-auto px-5 py-8">
            {/* Welcome state / Analysis report */}
            <AnalysisReportCard />
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
