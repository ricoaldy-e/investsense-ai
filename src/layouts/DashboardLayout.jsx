import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import FloatingChatButton from '../components/FloatingChatButton';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userMode, setUserMode] = useState(() => localStorage.getItem('userMode') || 'beginner');

  useEffect(() => {
    localStorage.setItem('userMode', userMode);
  }, [userMode]);

  return (
    <div className="flex h-screen overflow-hidden bg-bg-dark relative">
      {/* Sidebar - fixed left */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} userMode={userMode} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Navbar 
          onMenuClick={() => setIsSidebarOpen(true)} 
          userMode={userMode}
          onModeChange={setUserMode}
        />
        
        {/* Scrollable Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet context={{ userMode }} />
          </div>
        </main>
      </div>

      {/* Floating Chat Button */}
      <FloatingChatButton />
    </div>
  );
};

export default DashboardLayout;
