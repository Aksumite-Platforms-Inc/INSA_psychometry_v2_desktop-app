import React, { useState } from 'react';
import UserTable from '../../components/Tables/UserTable';
import DefaultLayout from '../../components/layout/defaultlayout';

function Users() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validExtensions = ['.xlsx', '.xls'];

      if (!validExtensions.some((ext) => file.name.endsWith(ext))) {
        alert('Please upload a valid Excel file (.xlsx or .xls).');
        return;
      }

      setSelectedFile(file);
    }
  };

  // Handle file upload
  const handleFileUpload = () => {
    if (!selectedFile) {
      alert('No file selected. Please choose a file to upload.');
      return;
    }

    if (window.electron && window.electron.ipcRenderer) {
      // Send file path to the main process
      window.electron.ipcRenderer.sendMessage('upload-excel-template', {
        filePath: selectedFile.path,
      });

      alert('File uploaded successfully! Processing...');
    }
  };

  return (
    <DefaultLayout>
      <div className="relative">
        {/* Main Content */}
        <div className="flex-1 p-5 h-screen overflow-y-auto">
          <div className="flex justify-between items-center mt-5">
            <h1 className="text-xl font-semibold">Manage Users</h1>

            {/* Download Template Button */}
            <button
              type="button"
              className="bg-green-500 text-white px-4 py-2 rounded-md"
              onClick={() =>
                window.electron &&
                window.electron.ipcRenderer.sendMessage('download-template')
              }
            >
              Download Template
            </button>
          </div>

          {/* Upload Excel Template */}
          <div className="mt-5 p-5 bg-white shadow rounded-md">
            <h2 className="text-lg font-bold mb-3">Bulk Upload Users</h2>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept=".xlsx,.xls"
                className="border p-2 rounded-md"
                onChange={handleFileChange}
              />
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={handleFileUpload}
              >
                Upload File
              </button>
            </div>
          </div>

          {/* User Table */}
          <div className="mt-8">
            <UserTable />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default Users;
