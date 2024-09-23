import { useRef } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';

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

const TestList: React.FC = function TestList() {
  const handle = useFullScreenHandle();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Tests</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
        {tests.map((test, index) => (
          <div key={index} className="bg-white p-4 shadow rounded">
            <h2 className="text-xl font-semibold">{test.name}</h2>
            <a
              href={test.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Start Test
            </a>
          </div>
        ))}
      </div>
      <div className="mt-6 flex space-x-4">
        <button
          type="button"
          className="bg-blue-500 text-white py-2 px-4 rounded-lg"
        >
          Start Exam
        </button>
        <button
          type="button"
          className="bg-yellow-500 text-white py-2 px-4 rounded-lg"
        >
          Screenshot Exam
        </button>
        <button
          type="button"
          className="bg-green-500 text-white py-2 px-4 rounded-lg"
        >
          Finish Exam
        </button>
        <button
          onClick={handle.enter}
          type="button"
          className="bg-gray-500 text-white py-2 px-4 rounded-lg"
        >
          Fullscreen
        </button>
      </div>
      <FullScreen handle={handle}>
        <iframe
          src="https://openpsychometrics.org/tests/OEJTS/"
          className="w-full h-[500px] mt-4 rounded-lg"
        />
      </FullScreen>
    </div>
  );
};

export default TestList;
