import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels =
  | 'take-screenshot'
  | 'screenshot-taken'
  | 'user-login'
  | 'user-login-success';

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
      ipcRenderer.send(channel, ...args);
    },
    on<T>(
      channel: Channels,
      func: (event: IpcRendererEvent, data: T) => void,
    ): () => void {
      const subscription = (event: IpcRendererEvent, data: T) => {
        func(event, data);
      };
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel, func) {
      ipcRenderer.once(channel, (_event, ...args) => {
        func(...args);
      });
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);
