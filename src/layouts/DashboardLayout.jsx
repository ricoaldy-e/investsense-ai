import { useState, useEffect, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import AIChatPanel from '../components/AIChatPanel';

const DEFAULT_PANEL_WIDTH = 380;

const DashboardLayout = () => {
  const location = useLocation();

  const isAIRoute = location.pathname === '/dashboard';

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userMode, setUserMode] = useState(() => localStorage.getItem('userMode') || 'beginner');
  

  const [isPanelOpen, setIsPanelOpen] = useState(() => {

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

  useEffect(() => {
    localStorage.setItem('aiPanelWidth', panelWidth.toString());
  }, [panelWidth]);
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

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
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        userMode={userMode} 
        onModeChange={setUserMode} 
      />
      
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        <Navbar 
          onMenuClick={() => setIsSidebarOpen(true)} 
          isSidebarOpen={isSidebarOpen}
          onCloseSidebar={() => setIsSidebarOpen(false)}
          userMode={userMode}
          onModeChange={setUserMode}
          onToggleAIPanel={isAIRoute ? handleTogglePanel : undefined}
          isPanelOpen={isAIRoute ? isPanelOpen : false}
          isMobile={isMobile}
        />
        
        
        <div className="flex-1 flex min-h-0">
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 min-w-0">
            <Outlet context={{ userMode }} />
          </main>

          
          {isAIRoute && (
            <AIChatPanel
              isOpen={isPanelOpen}
              onToggle={handleTogglePanel}
              panelWidth={panelWidth}
              onWidthChange={handleWidthChange}
              isMobile={isMobile}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
