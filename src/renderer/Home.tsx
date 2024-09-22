import { useRef, useEffect, useState } from 'react';

function Home() {
  const iframeRef = useRef<HTMLIFrameElement>(null); // Reference to the iframe
  const [screenshot, setScreenshot] = useState<string | null>(null);

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

  return (
    <div>
      <div className="iframe-container">
        <iframe
          ref={iframeRef}
          src="https://openpsychometrics.org/tests/OEJTS/"
          width="700px"
          height="500px"
          title="Example Iframe"
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
  );
}

export default Home;
