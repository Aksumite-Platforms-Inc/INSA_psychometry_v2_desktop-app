// import { useEffect } from 'react';

// const useIpcRenderer = (
//   channel: string,
//   callback: (...args: any[]) => void,
// ) => {
//   useEffect(() => {
//     window.electron.ipcRenderer.on(channel, callback);

//     return () => {
//       window.electron.ipcRenderer.removeListener(channel, callback);
//     };
//   }, [channel, callback]);
// };

// export default useIpcRenderer;
