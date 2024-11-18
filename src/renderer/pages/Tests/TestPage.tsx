import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DefaultLayout from '../../components/layout/defaultlayout';

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
  const navigate = useNavigate();
  const test = tests.find((t) => t.id === parseInt(testId || '', 10));

  const [testStarted, setTestStarted] = useState(false);
  const [iframeUrl] = useState<string>(test ? test.url : '');
  const [interactionBlocked, setInteractionBlocked] = useState(true);

  useEffect(() => {
    if (window.electron && window.electron.ipcRenderer) {
      const unsubscribe = window.electron.ipcRenderer.on(
        'screenshot-taken',
        (_event: unknown, screenshotPath: unknown) => {
          console.log(`Screenshot saved at: ${screenshotPath}`);
        },
      );

      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
    return undefined;
  }, []);

  if (!test) {
    return (
      <DefaultLayout>
        <div className="flex">
          <div className="flex-1 p-5">
            <p>The selected test was not found.</p>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  const handleStartTest = () => {
    setTestStarted(true);
    setInteractionBlocked(false);
  };

  const handleEndTest = () => {
    setTestStarted(false);
    setInteractionBlocked(true);
    if (window.electron && window.electron.ipcRenderer) {
      const confirmed = window.confirm(
        'Are you sure you want to submit the test?',
      );
      if (confirmed) {
        window.electron.ipcRenderer.sendMessage('take-screenshot', test.id);
        navigate('/tests');
      }
    } else {
      console.log('Electron IPC is not available');
    }
  };

  return (
    <DefaultLayout>
      <div className="flex">
        <div className="flex-1 p-5">
          <div className="relative flex flex-col items-center mt-10 space-y-5">
            {/* Iframe with overlay for blocking interaction */}
            <div className="relative w-full flex justify-center">
              <iframe
                src={iframeUrl}
                title={test.name}
                width="1000"
                height="750"
                className="border rounded-md"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
              {interactionBlocked && (
                <div className="absolute top-0 left-0 w-full h-full bg-gray-200 bg-opacity-50 flex items-center justify-center">
                  <p className="text-gray-700">
                    Click &quot;Start Test&quot; to begin
                  </p>
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
                className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-200 transition duration-200 ease-in-out ${
                  !testStarted ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={!testStarted}
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default TestPage;
