const {
    contextBridge,
    ipcRenderer
} = require('electron');

contextBridge.exposeInMainWorld(
    'electronAPI',

    {
        selectFolder: () =>
            ipcRenderer.invoke('select-folder'),

        startVideoConversion: (
            input,
            output
        ) =>
            ipcRenderer.invoke(
                'start-video-conversion',
                input,
                output
            ),

        startAudioConversion: (
            input,
            output,
            format
        ) =>
            ipcRenderer.invoke(
                'start-audio-conversion',
                input,
                output,
                format
            ),

        onLog: (callback) =>
            ipcRenderer.on(
                'conversion-log',

                (_, message) => callback(message)
            )
    }
);