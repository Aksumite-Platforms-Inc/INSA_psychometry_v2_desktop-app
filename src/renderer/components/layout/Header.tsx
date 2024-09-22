import React from 'react';

function Header(): React.ReactElement {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">My Electron App</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a href="/dashboard" className="hover:underline">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/tests" className="hover:underline">
                Tests
              </a>
            </li>
            <li>
              <a href="/users" className="hover:underline">
                Users
              </a>
            </li>
            <li>
              <a href="/reports" className="hover:underline">
                Reports
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
