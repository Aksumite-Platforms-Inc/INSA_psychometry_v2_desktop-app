import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';

function Reports() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-50">
        <Header title="Reports" />

        <div className="mt-5 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Organization Reports
          </h2>

          {/* Reports Table */}
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-blue-100 text-gray-700">
                <tr>
                  <th className="py-3 px-5">Report Name</th>
                  <th className="py-3 px-5">Date Generated</th>
                  <th className="py-3 px-5 text-center">Download</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {/* Replace with dynamic content */}
                <tr className="border-t hover:bg-gray-100 transition duration-150">
                  <td className="py-3 px-5">Abyssinia Bank Test Report</td>
                  <td className="py-3 px-5">September 22, 2024</td>
                  <td className="py-3 px-5 text-center">
                    <button
                      type="button"
                      className="text-blue-500 hover:text-blue-700 transition duration-150 ease-in-out"
                    >
                      <FontAwesomeIcon icon={faFileAlt} className="mr-2" />{' '}
                      Download
                    </button>
                  </td>
                </tr>
                {/* Repeat for more reports */}
                <tr className="border-t hover:bg-gray-100 transition duration-150">
                  <td className="py-3 px-5">Other Report Example</td>
                  <td className="py-3 px-5">August 15, 2024</td>
                  <td className="py-3 px-5 text-center">
                    <button
                      type="button"
                      className="text-blue-500 hover:text-blue-700 transition duration-150 ease-in-out"
                    >
                      <FontAwesomeIcon icon={faFileAlt} className="mr-2" />{' '}
                      Download
                    </button>
                  </td>
                </tr>
                {/* Add more rows as needed */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
