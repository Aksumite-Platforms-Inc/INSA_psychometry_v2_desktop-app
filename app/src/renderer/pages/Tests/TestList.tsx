import { useRef, useEffect, useState } from 'react';

const tests = [
  { name: 'OEJTS', url: 'https://openpsychometrics.org/tests/OEJTS/' },
  {
    name: 'Enneagram Test',
    url: 'https://www.eclecticenergies.com/enneagram/test',
  },
  {
    name: 'Qualtrics Test',
    url: 'https://nsq.qualtrics.com/jfe/form/SV_09skGWMAzEiru3s',
  },
  { name: 'RIASEC Test', url: 'https://personalitytests.com/riasec/' },
];

function TestList() {
  const iframeRef = useRef<HTMLIFrameElement>(null); // Reference to the iframe
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [selectedTest, setSelectedTest] = useState<string | null>(null);

  // Set up IPC listener to receive screenshot path from main process
  useEffect(() => {
    if (window.electron && window.electron.ipcRenderer) {
      const unsubscribe = window.electron.ipcRenderer.on(
        'screenshot-taken',
        (_event: unknown, screenshotPath: unknown) => {
          const path = screenshotPath as string;
          setScreenshot(path);
        },
      );

      // Clean up the listener when the component unmounts
      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
    throw new Error('Electron IPC is not available');
  }, []);

  // Send IPC message to take a screenshot
  const handleScreenshot = () => {
    if (window.electron && window.electron.ipcRenderer) {
      window.electron.ipcRenderer.sendMessage('take-screenshot');
    } else {
      throw new Error('Electron IPC is not available');
    }
  };

  const [testUrl, setTestUrl] = useState<string | null>(null);

  return (
    <div>
      <div className="test-list">
        <h2>Select a Test</h2>
        <ul>
          {tests.map((test) => (
            <li key={test.name}>
              <button onClick={() => setTestUrl(test.url)}>{test.name}</button>
            </li>
          ))}
        </ul>
      </div>
      {testUrl && (
        <div>
          <div className="iframe-container">
            <iframe
              ref={iframeRef}
              src={testUrl}
              width="700px"
              height="500px"
              title="Test Iframe"
            />
          </div>
          <div>
            <button type="button" onClick={handleScreenshot}>
              <span role="img" aria-label="screenshot">
                📸
              </span>{' '}
              Take Screenshot
            </button>
          </div>
          {screenshot && (
            <div>
              <p>Screenshot saved at: {screenshot}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TestList;
