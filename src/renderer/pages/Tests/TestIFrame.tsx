import React, { useState, useRef } from 'react';
import {
  ArrowsExpandIcon,
  CameraIcon,
  CheckIcon,
} from '@heroicons/react/solid';

const TestIframe: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (iframeRef.current) {
      if (!isFullscreen) {
        iframeRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const handleScreenshot = () => {
    const handleScreenshot = () => {
      // Implement screenshot functionality here
      alert('Screenshot function to be implemented');
    };

    const handleFinishTest = () => {
      // Implement finish test functionality here
      alert('Finish test function to be implemented');
    };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-full h-96 border-2 border-gray-300 rounded-lg overflow-hidden">
        <iframe
          ref={iframeRef}
          src="https://openpsychometrics.org/tests/OEJTS/"
          className="w-full h-full"
          title="Test"
        />
        type="button"
        onClick={toggleFullscreen}
        type="button" onClick={toggleFullscreen}
          className="absolute top-2 right-2 bg-gray-100 p-2 rounded-lg shadow hover:bg-gray-200"
        >
          <ArrowsExpandIcon className="w-5 h-5" />
        </button>
      </div>
          type="button"
          onClick={handleScreenshot}">
        <button
          onClick={handleScreenshot}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <CameraIcon className="w-5 h-5" />
          type="button"
          onClick={handleFinishTest}
        </button>
        <button
          onClick={handleFinishTest}
          className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <CheckIcon className="w-5 h-5" />
          <span>Finish Test</span>
        </button>
      </div>
    </div>
  );
};

export default TestIframe;
