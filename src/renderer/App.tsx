import {
  MemoryRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard/AdminDashboard';
import TestList from './pages/Tests/TestList';
import TestTabs from './pages/Tests/TestTabs';
import Report from './pages/Reports/ReportList';
import Header from './components/layout/Header';
import './index.css';
// import './App.css';

const App: React.FC = () => (
  <Router>
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 p-6 overflow-y-auto">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tests" element={<TestList />} />
            <Route path="/testTabs" element={<TestTabs />} />
            <Route path="/report" element={<Report />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </div>
    </div>
  </Router>
);

export default App;
