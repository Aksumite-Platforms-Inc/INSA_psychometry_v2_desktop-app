import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'take-screenshot' | 'screenshot-taken';

export interface ElectronHandler {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]): void;
    on(channel: Channels, func: (...args: unknown[]) => void): () => void;
    once(channel: Channels, func: (...args: unknown[]) => void): void;
  };
}

const electronHandler: ElectronHandler = {
  ipcRenderer: {
    sendMessage(channel, ...args) {
      console.log(`Sending IPC message to channel: ${channel}`);
      ipcRenderer.send(channel, ...args);
    },
    on(channel, func) {
      console.log(`Listening on IPC channel: ${channel}`);
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) => {
        func(...args);
      };
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel, func) {
      console.log(`Listening once on IPC channel: ${channel}`);
      ipcRenderer.once(channel, (_event, ...args) => {
        func(...args);
      });
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);
