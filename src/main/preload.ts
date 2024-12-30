import {contextBridge, ipcRenderer} from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (message: string) => ipcRenderer.send('message', message),
  async selectFile(): Promise<{filePath: string, fileContent: Buffer}> {
    return await ipcRenderer.invoke('upload-file');
  },
  async selectFiles(): Promise<{filePath: string, fileContent: Buffer}[]> {
    return await ipcRenderer.invoke('upload-files');},
  async downloadFile(url: string, path: string) {
    await ipcRenderer.invoke('download-file', url, path);
    // File has been downloaded to the specified path
  }
});