import React, { useState, useEffect } from 'react';
import UserTable from '../../components/Tables/UserTable';
import DefaultLayout from '../../components/layout/defaultlayout';

function Users() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedData, setUploadedData] = useState<any[]>([]); // Store processed JSON data
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (window.electron && window.electron.ipcRenderer) {
      const handleUploadResponse = (_event: any, response: any) => {
        if (response.success) {
          console.log('Processed Data:', response.data);
          setUploadedData(response.data); // Save for potential display or debugging
          alert('File processed successfully!');
        } else {
          console.error('Error processing file:', response.message);
          setError(response.message);
        }
      };

      window.electron.ipcRenderer.on(
        'excel-template-uploaded',
        handleUploadResponse,
      );

      return () => {
        window.electron.ipcRenderer.removeListener(
          'excel-template-uploaded',
          handleUploadResponse,
        );
      };
    }
    return undefined;
  }, []);

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

  const handleFileUpload = () => {
    if (!selectedFile) {
      alert('No file selected. Please choose a file to upload.');
      return;
    }

    console.log('Selected file path:', selectedFile.path); // Log the file path

    if (window.electron && window.electron.ipcRenderer) {
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
          {/* Optional: Render Uploaded Data */}
          {uploadedData.length > 0 && (
            <div className="mt-5">
              <h3 className="text-lg font-bold">Uploaded Users:</h3>
              <ul>
                {uploadedData.map((user) => (
                  <li key={user.email}>
                    {user.name} ({user.email})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {error && <p className="text-red-500 mt-5">{error}</p>}

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
