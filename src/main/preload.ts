import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'take-screenshot' | 'screenshot-taken';

export interface ElectronHandler {
  ipcRenderer: {
    invoke(channel: string, ...args: any[]): Promise<any>;
    sendMessage(channel: Channels, ...args: unknown[]): void;
    on(channel: Channels, func: (...args: unknown[]) => void): () => void;
    once(channel: Channels, func: (...args: unknown[]) => void): void;
  };
}

const electronHandler: ElectronHandler = {
  ipcRenderer: {
    invoke: (channel: string, ...args: any[]) =>
      ipcRenderer.invoke(channel, ...args),

    sendMessage(channel, ...args) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel, func) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) => {
        func(...args);
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

console.log('Preload script loaded!');
contextBridge.exposeInMainWorld('electron', electronHandler);
