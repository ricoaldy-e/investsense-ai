import { useState, useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import AIChatPanel from '../components/AIChatPanel';

const DEFAULT_PANEL_WIDTH = 380;

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userMode, setUserMode] = useState(() => localStorage.getItem('userMode') || 'beginner');
  
  // AI Panel state
  const [isPanelOpen, setIsPanelOpen] = useState(() => {
    // Default: open on desktop, closed on mobile
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return true;
  });
  const [panelWidth, setPanelWidth] = useState(() => {
    const saved = localStorage.getItem('aiPanelWidth');
    return saved ? parseInt(saved, 10) : DEFAULT_PANEL_WIDTH;
  });
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('userMode', userMode);
  }, [userMode]);

  // Persist panel width
  useEffect(() => {
    localStorage.setItem('aiPanelWidth', panelWidth.toString());
  }, [panelWidth]);

  // Responsive: track mobile breakpoint
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Auto-close panel on mobile, auto-open on desktop
      if (mobile) {
        setIsPanelOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTogglePanel = useCallback(() => {
    setIsPanelOpen(prev => !prev);
  }, []);

  const handleWidthChange = useCallback((newWidth) => {
    setPanelWidth(newWidth);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-bg-dark relative">
      {/* Sidebar - fixed left */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        userMode={userMode} 
        onModeChange={setUserMode} 
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Navbar 
          onMenuClick={() => setIsSidebarOpen(true)} 
          isSidebarOpen={isSidebarOpen}
          onCloseSidebar={() => setIsSidebarOpen(false)}
          userMode={userMode}
          onModeChange={setUserMode}
          onToggleAIPanel={handleTogglePanel}
          isPanelOpen={isPanelOpen}
          isMobile={isMobile}
        />
        
        {/* Content + AI Panel flex container */}
        <div className="flex-1 flex min-h-0">
          {/* Scrollable Dashboard/MarketInsight Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 min-w-0">
            <Outlet context={{ userMode }} />
          </main>

          {/* AI Assistant Panel (Desktop: flex sibling, Mobile: overlay) */}
          <AIChatPanel
            isOpen={isPanelOpen}
            onToggle={handleTogglePanel}
            panelWidth={panelWidth}
            onWidthChange={handleWidthChange}
            isMobile={isMobile}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
