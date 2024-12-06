/* eslint-disable react/button-has-type */

import { useState, useEffect } from 'react';
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
    url: 'https://similarminds.com/enneagram-test.html',
  },
  {
    id: 3,
    name: 'Qualtrics',
    url: 'https://nsq.qualtrics.com/jfe/form/SV_09skGWMAzEiru3s',
  },
  {
    id: 4,
    name: 'RIASEC',
    url: 'https://openpsychometrics.org/tests/RIASEC/',
  },
];

function TestPage() {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const test = tests.find((t) => t.id === parseInt(testId || '', 10));
  const token = getToken();

  const [fullscreen, setFullscreen] = useState(false);
  const [interactionBlocked, setInteractionBlocked] = useState(true);
  const [existingResult, setExistingResult] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (test && window.electron) {
      window.electron.ipcRenderer.sendMessage('check-test-result', test.id);

      const handleTestResultCheck = (_event: any, exists: boolean) => {
        setExistingResult(exists);
      };

      window.electron.ipcRenderer.on(
        'test-result-exists',
        handleTestResultCheck,
      );

      return () => {
        window.electron.ipcRenderer.removeListener(
          'test-result-exists',
          handleTestResultCheck,
        );
      };
    }
  }, [test]);

  const handleStartTest = () => {
    setFullscreen(true);
    setInteractionBlocked(false);
  };

  const handleEndTest = () => {
    if (window.electron) {
      const confirmed = window.confirm(
        'Are you sure you want to submit the test?',
      );
      if (confirmed) {
        setShowLoader(true);
        window.electron.ipcRenderer.sendMessage('take-screenshot', {
          testId: test?.id,
          dimensions: { width: window.innerWidth, height: window.innerHeight },
          token,
        });

        window.electron.ipcRenderer.once('screenshot-complete', () => {
          setShowLoader(false);
          setFullscreen(false);
          setInteractionBlocked(true);
          navigate('/tests');
        });

        window.electron.ipcRenderer.once(
          'screenshot-failed',
          (_event, error: string) => {
            setShowLoader(false);
            if (error === 'Test is already taken') {
              alert(
                'The test has already been taken. You cannot submit it again.',
              );
            } else {
              setError(error);
            }
          },
        );
      }
    }
  };

  const handleResendResult = () => {
    if (window.electron) {
      setShowLoader(true);
      window.electron.ipcRenderer.sendMessage(
        'resend-test-result',
        test?.id,
        token,
      );

      window.electron.ipcRenderer.once('resend-test-result-success', () => {
        setShowLoader(false);
        alert('Result resent successfully.');
      });

      window.electron.ipcRenderer.once(
        'resend-test-result-failure',
        (_event, error: string) => {
          setShowLoader(false);
          alert(`Failed to resend result: ${error}`);
        },
      );
    }
  };

  const handleRetakeTest = () => {
    if (window.electron) {
      window.electron.ipcRenderer.sendMessage('delete-test-result', test?.id);
      setExistingResult(false);
      setInteractionBlocked(true);
    }
  };

  const handleQuitTest = () => {
    setFullscreen(false);
    setInteractionBlocked(true);
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
              disabled={showLoader}
            >
              {showLoader ? 'Processing...' : 'End Test'}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-5 mt-10 relative">
          <div className="relative">
            <iframe
              src={test.url}
              title={test.name}
              width="1000"
              height="500"
              className="border rounded shadow-lg"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
            {interactionBlocked && (
              <div className="absolute inset-0 w-[1000px] h-[500px] bg-gray-200 bg-opacity-50 flex flex-col items-center justify-center">
                <p className="text-gray-700 text-lg font-medium">
                  {existingResult
                    ? 'Test already exists.'
                    : 'Click Start Test to begin.'}
                </p>
                <div className="mt-4">
                  {existingResult ? (
                    <>
                      <button
                        onClick={handleResendResult}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                      >
                        Resend Result
                      </button>
                      <button
                        onClick={handleRetakeTest}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Retake Test
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleStartTest}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Start Test
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </DefaultLayout>
  );
}

export default TestPage;
