const inputFolder = document.getElementById('inputFolder');
const outputFolder = document.getElementById('outputFolder');

const logs = document.getElementById('logs');

document.getElementById('browseInput')
    .addEventListener('click', async () => {

        const folder =
            await window.electronAPI.selectFolder();

        if (folder) {
            inputFolder.value = folder;
        }
    });

document.getElementById('browseOutput')
    .addEventListener('click', async () => {

        const folder =
            await window.electronAPI.selectFolder();

        if (folder) {
            outputFolder.value = folder;
        }
    });

document.getElementById('startButton')
    .addEventListener('click', async () => {

        logs.textContent = '';

        await window.electronAPI.startConversion(
            inputFolder.value,
            outputFolder.value
        );
    });

window.electronAPI.onLog((message) => {
    logs.textContent += message + '\n';
});