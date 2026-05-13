const {
    app,
    BrowserWindow,
    ipcMain,
    dialog
} = require('electron');

const path = require('path');

const {
    convertFolderVideosToAudio,
    convertFolderAudio
} = require('./converter');

function createWindow() {

    const win = new BrowserWindow({
        width: 900,
        height: 700,

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

// VIDEO -> AUDIO

ipcMain.handle(
    'start-video-conversion',

    async (event, input, output) => {

        return await convertFolderVideosToAudio(
            input,
            output,

            (log) => {
                event.sender.send('conversion-log', log);
            }
        );
    }
);

// AUDIO CONVERTER

ipcMain.handle(
    'start-audio-conversion',

    async (
        event,
        input,
        output,
        format
    ) => {

        return await convertFolderAudio(
            input,
            output,
            format,

            (log) => {
                event.sender.send('conversion-log', log);
            }
        );
    }
);