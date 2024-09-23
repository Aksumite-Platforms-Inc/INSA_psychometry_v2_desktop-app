import React, { useState } from 'react';

const TestTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['Personality Test', 'Aptitude Test', 'Emotional Intelligence'];

  return (
    <div>
      <div className="flex justify-center space-x-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`py-2 px-4 rounded-lg transition ${
              activeTab === index
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="mt-6">
        {activeTab === 0 && <div>Personality Test content...</div>}
        {activeTab === 1 && <div>Aptitude Test content...</div>}
        {activeTab === 2 && <div>Emotional Intelligence content...</div>}
      </div>
    </div>
  );
};

export default TestTabs;
