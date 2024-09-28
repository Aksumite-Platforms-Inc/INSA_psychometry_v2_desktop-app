import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
// import Footer from './Footer';

interface DefaultLayoutProps {
  children: React.ReactNode;
}

function DefaultLayout({ children }: DefaultLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      <aside
        className={`flex flex-col bg-gray-800 text-white h-screen justify-between transition-transform duration-500 ${isSidebarOpen ? 'w-64 p-5' : 'w-0'}`}
      >
        <Sidebar />
      </aside>

      <div className="flex flex-1 flex-col bg-gray-100 overflow-y-auto">
        <header className="">
          <Header toggleSidebar={toggleSidebar} />
        </header>
        <main className="">{children}</main>
      </div>
    </div>
  );
}

export default DefaultLayout;
