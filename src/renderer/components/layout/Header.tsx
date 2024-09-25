import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

function Header({ title }: { title: string }) {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-100 shadow-lg">
      <nav className="text-gray-600 text-sm font-medium flex items-center space-x-2">
        <a
          href="/users"
          className="text-blue-600 flex items-center space-x-1 hover:text-blue-800 transition duration-150 ease-in-out"
        >
          <FontAwesomeIcon icon={faHome} />{' '}
          {/* Home icon for better navigation */}
          <span>Home</span>
        </a>
        <span>{'>'}</span>
        <span className="text-gray-500">{title}</span>{' '}
        {/* Current page title */}
      </nav>
      <div className="text-blue-800 font-extrabold text-lg">
        Abyssinia Bank SC
      </div>
    </div>
  );
}

export default Header;
