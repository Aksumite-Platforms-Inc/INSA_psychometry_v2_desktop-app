import React from 'react';

interface Report {
  id: number;
  title: string;
  date: string;
}

const reports: Report[] = [
  { id: 1, title: 'Report 1', date: '2023-10-01' },
  { id: 2, title: 'Report 2', date: '2023-10-02' },
  { id: 3, title: 'Report 3', date: '2023-10-03' },
];

const ReportDetail: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Reports List</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 bg-gray-200">ID</th>
              <th className="py-2 px-4 bg-gray-200">Title</th>
              <th className="py-2 px-4 bg-gray-200">Date</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="border-t">
                <td className="py-2 px-4">{report.id}</td>
                <td className="py-2 px-4">{report.title}</td>
                <td className="py-2 px-4">{report.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportDetail;
