import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';

// List of tests with their IDs and URLs
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
  const test = tests.find((t) => t.id === parseInt(testId || '', 10));

  const [testStarted, setTestStarted] = useState(false);
  const [iframeUrl, setIframeUrl] = useState<string | null>(
    test ? test.url : null,
  );
  const [interactionBlocked, setInteractionBlocked] = useState(true);

  useEffect(() => {
    if (window.electron && window.electron.ipcRenderer) {
      const unsubscribe = window.electron.ipcRenderer.on(
        'screenshot-taken',
        (_event: unknown, screenshotPath: unknown) => {
          alert(`Screenshot saved at: ${screenshotPath}`);
        },
      );

      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, []);

  if (!test) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-5">
          <Header title="Test Not Found" />
          <p>The selected test was not found.</p>
        </div>
      </div>
    );
  }

  const handleStartTest = () => {
    setTestStarted(true);
    setInteractionBlocked(false);
    alert(`Test ${test.name} started.`);
  };

  const handleEndTest = () => {
    setTestStarted(false);
    setInteractionBlocked(true);
    if (window.electron && window.electron.ipcRenderer) {
      window.electron.ipcRenderer.sendMessage('take-screenshot');
    } else {
      throw new Error('Electron IPC is not available');
    }
    alert(`Test ${test.name} ended. Screenshot taken.`);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-5">
        <Header title={`Test: ${test.name}`} />
        <div className="relative flex flex-col items-center mt-10 space-y-5">
          {/* Iframe with overlay for blocking interaction */}
          <div className="relative w-full flex justify-center">
            <iframe
              src={iframeUrl}
              title={test.name}
              width="700"
              height="500"
              className="border rounded-md"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
            {interactionBlocked && (
              <div className="absolute top-0 left-0 w-full h-full bg-gray-200 bg-opacity-50 flex items-center justify-center">
                <p className="text-gray-700">Click "Start Test" to begin</p>
              </div>
            )}
          </div>

          {/* Start and End Test Buttons */}
          <div className="flex space-x-5">
            <button
              type="button"
              onClick={handleStartTest}
              className={`bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200 ease-in-out ${
                testStarted ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={testStarted}
            >
              Start Test
            </button>
            <button
              type="button"
              onClick={handleEndTest}
              className={`bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200 ease-in-out ${
                !testStarted ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={!testStarted}
            >
              End Test & Take Screenshot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestPage;
