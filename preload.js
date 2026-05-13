const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    selectFolder: () => ipcRenderer.invoke('select-folder'),

    startConversion: (input, output) =>
        ipcRenderer.invoke('start-conversion', input, output),

    onLog: (callback) =>
        ipcRenderer.on('conversion-log', (_, message) => callback(message))
});