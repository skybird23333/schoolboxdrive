import {app, BrowserWindow, ipcMain, session, dialog} from 'electron';
import {join} from 'path';// In your main process (main.ts)
import * as fs from 'fs';
import * as http from 'http';

function createWindow () {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false
    }
  });

  if (process.env.NODE_ENV === 'development') {
    const rendererPort = process.argv[2];
    mainWindow.loadURL(`http://localhost:${rendererPort}`);
  }
  else {
    mainWindow.loadFile(join(app.getAppPath(), 'renderer', 'index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ['script-src \'self\'']
      }
    })
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors')
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

ipcMain.on('message', (event, message) => {
  console.log(message);
})

ipcMain.handle('upload-file', async () => {
  const { filePaths } = await dialog.showOpenDialog({ properties: ['openFile'] });
  if (filePaths.length > 0) {
    const fileContent = fs.readFileSync(filePaths[0]);
    return {
      filePath: filePaths[0],
      fileContent
    };
  }
});

ipcMain.handle('download-file', async (event, url: string, path: string) => {
  const file = fs.createWriteStream(path);
  return new Promise((resolve, reject) => {
    http.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(undefined);
      });
    }).on('error', (error) => {
      fs.unlink(path, () => {});
      reject(error.message);
    });
  });
});