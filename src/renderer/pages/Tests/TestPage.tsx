/* eslint-disable react/button-has-type */
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DefaultLayout from '../../components/layout/defaultlayout';
import { getToken } from '../../utils/validationUtils';

const tests = [
  {
    id: 1,
    name: 'OEJTS',
    url: 'https://openpsychometrics.org/tests/OEJTS/',
  },
  {
    id: 2,
    name: 'Enneagram',
    url: 'https://www.eclecticenergies.com/enneagram/test',
  },
  {
    id: 3,
    name: 'Qualtrics',
    url: 'https://nsq.qualtrics.com/jfe/form/SV_09skGWMAzEiru3s',
  },
  {
    id: 4,
    name: 'RIASEC',
    url: 'https://personalitytests.com/riasec/',
  },
];

function TestPage() {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const test = tests.find((t) => t.id === parseInt(testId || '', 10));
  const token = getToken();

  const [fullscreen, setFullscreen] = useState(false);

  const handleStartTest = () => {
    setFullscreen(true); // Enable fullscreen mode
  };

  const handleQuitTest = () => {
    setFullscreen(false); // Exit fullscreen mode
  };

  const handleEndTest = () => {
    if (window.electron && window.electron.ipcRenderer) {
      const confirmed = window.confirm(
        'Are you sure you want to submit the test?',
      );
      if (confirmed) {
        if (test) {
          window.electron.ipcRenderer.sendMessage(
            'take-screenshot',
            test.id,
            token,
          );
        }
        setFullscreen(false); // Exit fullscreen mode
        navigate('/tests');
      }
    } else {
      console.log('Electron IPC is not available');
    }
  };

  if (!test) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center h-full">
          <p className="text-lg text-gray-700">
            The selected test was not found.
          </p>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      {fullscreen ? (
        // Fullscreen Mode
        <div className="fixed inset-0 z-50 flex flex-col bg-white">
          <iframe
            src={test.url}
            title={test.name}
            className="flex-grow w-full h-full border-none"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
          <div className="flex justify-between bg-gray-200 p-4">
            <button
              onClick={handleQuitTest}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Quit Test
            </button>
            <button
              onClick={handleEndTest}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              End Test
            </button>
          </div>
        </div>
      ) : (
        // Normal View
        <div className="flex flex-col items-center space-y-5 mt-10">
          <iframe
            src={test.url}
            title={test.name}
            width="1000"
            height="500"
            className="border rounded shadow-lg"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
          <button
            type="button"
            onClick={handleStartTest}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Start Test
          </button>
        </div>
      )}
    </DefaultLayout>
  );
}

export default TestPage;
