import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultLayout from '../../components/layout/defaultlayout';
import { getUserRole } from '../../utils/validationUtils';

function Dashboard() {
  const navigate = useNavigate();
  const role = getUserRole();

  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      navigate('/Login');
    }
  }, [navigate]);

  return (
    <DefaultLayout>
      <main className="p-6 space-y-8 bg-gray-50 min-h-screen">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500 mt-1">INSA Personality Test Overview</p>
          </div>
        </header>

        {/* Overview Cards Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {[
            { title: 'Registered Users', iconColor: 'blue', count: '-', icon: 'user-group' },
            { title: 'Tested Users', iconColor: 'green', count: '-', icon: 'clock' },
            { title: 'Reports Generated', iconColor: 'yellow', count: '-', icon: 'chart-bar' },
          ].map((card, idx) => (
            <div
              key={idx}
              className="flex items-center p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-200"
            >
              <div
                className={`inline-flex items-center justify-center h-16 w-16 text-${card.iconColor}-600 bg-${card.iconColor}-100 rounded-full mr-4`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <use href={`#icon-${card.icon}`} />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{card.count}</h3>
                <p className="text-gray-500">{card.title}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Statistics and Charts Section */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col">
            <h2 className="font-semibold text-gray-800 border-b pb-4 mb-4">Currently Testing Users</h2>
            <div className="flex-grow flex items-center justify-center bg-gray-100 border-2 border-gray-200 border-dashed rounded-md">
              <span className="text-gray-400 text-lg">Chart Placeholder</span>
            </div>
          </div>
        </section>
      </main>
    </DefaultLayout>
  );
}

export default Dashboard;
