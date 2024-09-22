import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard/AdminDashboard';
// import Profile from './pages/Profile';
import Tests from './pages/Tests/TestList';
import Report from './pages/Reports/ReportList';

import './App.css';
const App = () => {
  return (
    <Router>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 p-4 overflow-y-auto">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            {/* <Route path="/profile" element={<Profile />} /> */}
            <Route path="/tests" element={<Tests />} />
            <Route path="/report" element={<Report />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
