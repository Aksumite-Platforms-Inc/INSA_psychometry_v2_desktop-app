/* eslint-disable consistent-return */
import React, { useState, useEffect } from 'react';
import OrgUserTable from '../../components/Tables/OrgUserTable';
import DefaultLayout from '../../components/layout/defaultlayout';
import { getToken } from '../../utils/validationUtils';

function UsersList() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedData, setUploadedData] = useState<
    { name: string; email: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [refreshTable, setRefreshTable] = useState(false); // State to trigger table refresh
  const token = getToken();

  useEffect(() => {
    const { electron } = window;

    if (electron?.ipcRenderer) {
      const handleUploadResponse = (_event: any, response: unknown) => {
        const typedResponse = response as {
          success: boolean;
          data?: any[];
          message?: string;
        };
        if (typedResponse.success) {
          setUploadedData(typedResponse.data || []);
          setRefreshTable((prev) => !prev); // Toggle refreshTable to refresh OrgUserTable
          alert('File processed successfully!');
        } else {
          setError(typedResponse.message || 'Error processing file.');
        }
      };

      electron.ipcRenderer.on('excel-template-uploaded', handleUploadResponse);

      return () => {
        electron.ipcRenderer.removeListener(
          'excel-template-uploaded',
          handleUploadResponse,
        );
      };
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const validExtensions = ['.xlsx', '.xls'];

    if (file) {
      if (!validExtensions.some((ext) => file.name.endsWith(ext))) {
        alert('Please upload a valid Excel file (.xlsx or .xls).');
        return;
      }
      setSelectedFile(file);
      setError(null); // Clear previous errors
    }
  };

  const handleFileUpload = () => {
    if (!selectedFile) {
      alert('No file selected. Please choose a file to upload.');
      return;
    }

    const { electron } = window;

    if (electron?.ipcRenderer) {
      electron.ipcRenderer.sendMessage('upload-excel-template', {
        token,
        filePath: selectedFile.path,
      });
      alert('File uploaded successfully! Processing...');
    }
  };

  const handleDownloadTemplate = () => {
    const { electron } = window;

    if (electron?.ipcRenderer) {
      electron.ipcRenderer.sendMessage('download-template');
      alert('Downloading template...');
    }
  };

  return (
    <DefaultLayout>
      <div className="relative">
        <div className="flex-1 p-5 h-screen overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center mt-5">
            <h1 className="text-xl font-semibold">Manage Users</h1>
            <button
              type="button"
              className="bg-green-500 text-white px-4 py-2 rounded-md"
              onClick={handleDownloadTemplate}
            >
              Download Template
            </button>
          </div>

          {/* Bulk Upload Section */}
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

          {/* Uploaded Data Section */}
          {uploadedData.length > 0 && (
            <div className="mt-5">
              <h3 className="text-lg font-bold">Uploaded Users:</h3>
              <ul className="list-disc pl-5">
                {uploadedData.map((user) => (
                  <li key={user.email} className="py-1">
                    {user.name} ({user.email})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <p className="text-red-500 mt-5">
              <strong>Error:</strong> {error}
            </p>
          )}

          {/* User Table */}
          <div className="mt-8">
            {/* Pass refreshTable to OrgUserTable as a key to trigger re-render */}
            <OrgUserTable key={refreshTable.toString()} />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default UsersList;
