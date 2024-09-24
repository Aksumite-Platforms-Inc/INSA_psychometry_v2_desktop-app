import React from 'react';

const DefaultLayout: React.FC = ({ children }) => {
  return (
    <div className="flex h-screen">
      <aside className="w-64 h-screen sticky top-0 overflow-y-auto bg-gray-200 p-4">
        {/* Sidebar content goes here */}
      </aside>
      <main className="flex-grow p-4 overflow-y-auto">{children}</main>
    </div>
  );
};

export default DefaultLayout;
