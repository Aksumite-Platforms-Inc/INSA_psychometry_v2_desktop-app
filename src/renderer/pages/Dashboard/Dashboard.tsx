import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultLayout from '../../components/layout/defaultlayout';
import { getUserRole } from '../../utils/validationUtils';

function Dashboard() {
  const navigate = useNavigate();
  const role = getUserRole();

  useEffect(() => {
    console.log('role', role);
    if (!localStorage.getItem('authToken')) {
      navigate('/Login');
    }
  });
  return (
    <DefaultLayout>
      <main className="p-5 sm:p-5 space-y-6">
        {/* <Header /> */}
        <br />
        <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between">
          <div className="mr-6">
            <h1 className="text-4xl font-semibold mb-2">Dashboard</h1>
            <h2 className="text-gray-600 ml-0.5">INSA personality test</h2>
          </div>
        </div>

        <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="flex items-center p-8 bg-white shadow-lg rounded-lg">
            <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
              <svg
                aria-hidden="true"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <span className="block text-2xl font-bold">-</span>
              <span className="block text-gray-500">Registered Users</span>
            </div>
          </div>
          <div className="flex items-center p-8 bg-white shadow-lg rounded-lg">
            <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-green-600 bg-green-100 rounded-full mr-6">
              <svg
                aria-hidden="true"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6 "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <span className="block text-2xl font-bold">-</span>
              <span className="block text-gray-500">Tested Users</span>
            </div>
          </div>
          <div className="flex items-center p-8 bg-white shadow-md rounded-lg">
            <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-yellow-600 bg-yellow-100 rounded-full mr-6">
              <svg
                aria-hidden="true"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path fill="#fff" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path
                  fill="#fff"
                  d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                />
              </svg>
            </div>
            <div>
              <span className="block text-2xl font-bold">-</span>
              <span className="block text-gray-500">Reports Generated</span>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="grid md:grid-cols-2 xl:grid-cols-1 xl:grid-rows-3 xl:grid-flow-col gap-6 ">
          <div className="flex flex-col md:col-span-3 md:row-span-2 bg-white shadow-md rounded-lg">
            <div className="px-6 py-5 font-semibold border-b border-gray-100">
              Curently Test taking Users
            </div>
            <div className="p-4 flex-grow">
              <div className="flex items-center justify-center h-full px-4 py-16 text-gray-400 text-3xl font-semibold bg-gray-100 border-2 border-gray-200 border-dashed rounded-md">
                Chart
              </div>
            </div>
          </div>
        </section>
      </main>
    </DefaultLayout>
  );
}

export default Dashboard;
