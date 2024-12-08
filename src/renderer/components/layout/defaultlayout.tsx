import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface DefaultLayoutProps {
  children: React.ReactNode;
}

function DefaultLayout({ children }: DefaultLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() =>
    JSON.parse(localStorage.getItem('sidebarCollapsed') || 'false'),
  );

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev: boolean): boolean => {
      const newState: boolean = !prev;
      localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
      return newState;
    });
  };

  return (
    <div className="flex h-screen">
      <aside
        className={`flex flex-col bg-gray-800 text-white transition-transform duration-300 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <Sidebar isCollapsed={isSidebarCollapsed} />
      </aside>

      <div className="flex flex-1 flex-col bg-gray-100 overflow-y-auto">
        <Header toggleSidebar={toggleSidebar} />
        <main className="">{children}</main>
      </div>
    </div>
  );
}

export default DefaultLayout;
