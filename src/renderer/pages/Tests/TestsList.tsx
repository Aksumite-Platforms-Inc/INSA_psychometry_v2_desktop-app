import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';

// List of tests with descriptions
const tests = [
  {
    id: 1,
    name: 'OEJTS',
    description: 'This test measures Jungian personality types.',
  },
  {
    id: 2,
    name: 'Enneagram',
    description: 'A test that identifies your Enneagram personality type.',
  },
  {
    id: 3,
    name: 'Qualtrics',
    description: 'Survey test for personal assessment.',
  },
  {
    id: 4,
    name: 'RIASEC',
    description: 'A career personality test based on the RIASEC model.',
  },
];

function Tests() {
  const navigate = useNavigate();

  // Function to handle test click
  const handleTestClick = (testId: number) => {
    navigate(`/test/${testId}`);
  };

  // Function to return background color based on test ID
  const getBackgroundColor = (id: number) => {
    switch (id) {
      case 1:
        return 'bg-blue-100';
      case 2:
        return 'bg-yellow-100';
      case 3:
        return 'bg-red-100';
      case 4:
        return 'bg-green-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-50">
        <Header />

        {/* Grid for test cards */}
        <br />
        <hr />
        <br />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {tests.map((test) => (
            <div
              key={test.id}
              className={`p-6 rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer hover:shadow-xl transition-shadow duration-200 ${getBackgroundColor(test.id)}`}
              role="button"
              tabIndex={0}
              onClick={() => handleTestClick(test.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleTestClick(test.id);
                }
              }}
            >
              <div className="text-center">
                <span className="text-xl font-bold text-gray-700">
                  {test.name}
                </span>
                <p className="text-sm mt-2 text-gray-600">{test.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Tests;
