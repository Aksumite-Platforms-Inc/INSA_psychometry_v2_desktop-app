import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels =
  | 'take-screenshot'
  | 'screenshot-taken'
  | 'user-login'
  | 'user-login-success'
  | 'profile-updated'
  | 'update-profile'
  | 'delete-member'
  | 'member-deleted'
  | 'members-listed'
  | 'get-members'
  | 'get-branches'
  | 'branches-listed'
  | 'delete-branch'
  | 'branch-deleted'
  | 'create-branch'
  | 'branch-created'
  | 'get-branch-details'
  | 'branch-details-fetched'
  | 'download-template'
  | 'template-downloaded'
  | 'upload-excel-template'
  | 'excel-template-uploaded'
  | 'get-branch-members'
  | 'branch-members-listed';

export interface ElectronHandler {
  ipcRenderer: {
    removeListener(
      channel: Channels,
      listener: (...args: unknown[]) => void,
    ): void;
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
    removeListener(
      channel: Channels,
      listener: (...args: unknown[]) => void,
    ): void {
      ipcRenderer.removeListener(channel, listener);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);
