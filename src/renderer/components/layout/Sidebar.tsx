import React from 'react';

function Sidebar(): React.ReactElement {
  return (
    <aside className="bg-gray-100 h-screen p-4 w-64 shadow-lg">
      <nav>
        <ul className="space-y-4">
          <li>
            <a href="/dashboard" className="block text-gray-700 font-semibold">
              Dashboard
            </a>
          </li>
          <li>
            <a href="/tests" className="block text-gray-700 font-semibold">
              Tests
            </a>
          </li>
          <li>
            <a href="/users" className="block text-gray-700 font-semibold">
              Users
            </a>
          </li>
          <li>
            <a href="/reports" className="block text-gray-700 font-semibold">
              Reports
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
