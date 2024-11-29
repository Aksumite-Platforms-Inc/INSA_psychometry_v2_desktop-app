import React from 'react';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DefaultLayout from '../../components/layout/defaultlayout';

function Reports() {
  return (
    <DefaultLayout>
      <div className="relative">
        <div className="flex h-screen overflow-y-auto items-center justify-center bg-gray-50">
          <div className="text-center p-6 bg-white rounded-lg shadow-lg">
            <FontAwesomeIcon
              icon={faClock}
              className="text-blue-500 text-6xl mb-4"
            />
            <h2 className="text-3xl font-bold mb-2 text-gray-800">
              Coming Soon
            </h2>
            <p className="text-gray-600 mb-4">
              We are working hard to bring you this feature. Stay tuned!
            </p>
            <button
              type="button"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-150 ease-in-out"
              onClick={() =>
                alert('You will be notified when this feature is available.')
              }
            >
              Notify Me
            </button>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default Reports;
