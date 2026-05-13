const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { convertFolderVideosToAudio } = require('./converter');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.loadFile('ui/index.html');
}

app.whenReady().then(createWindow);

ipcMain.handle('select-folder', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory']
    });

    if (result.canceled) return null;

    return result.filePaths[0];
});

ipcMain.handle('start-conversion', async (event, input, output) => {
    return await convertFolderVideosToAudio(input, output, (log) => {
        event.sender.send('conversion-log', log);
    });
});