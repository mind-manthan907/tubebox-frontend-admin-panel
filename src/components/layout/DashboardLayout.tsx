import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { cn } from '@/lib/utils';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleCloseSidebar = useCallback(() => setIsSidebarOpen(false), []);
  const handleOpenSidebar = useCallback(() => setIsSidebarOpen(true), []);
  const handleToggleCollapse = useCallback(() => setIsSidebarCollapsed(prev => !prev), []);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={handleCloseSidebar} 
        isCollapsed={isSidebarCollapsed}
      />
      
      <div 
        className={cn(
            "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out",
            isSidebarCollapsed ? "md:pl-[70px]" : "md:pl-64"
        )}
      >
        <Header 
            onMenuClick={handleOpenSidebar} 
            onCollapseClick={handleToggleCollapse}
            isCollapsed={isSidebarCollapsed}
        />
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;