/**
 * Should match main/preload.ts for typescript support in renderer
 */
export default interface ElectronApi {
  sendMessage: (message: string) => void
  selectFile(): Promise<{filePath: string, fileContent: Uint8Array}>
  downloadFile(url: string, path: string): Promise<any>
}

declare global {
  interface Window {
    electronAPI: ElectronApi,
  }
}
