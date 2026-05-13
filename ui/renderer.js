const logs = document.getElementById('logs');

function addLog(message) {
    logs.textContent += message + '\n';
}

// =======================
// TABS
// =======================

document.querySelectorAll('.tab').forEach(tab => {

    tab.addEventListener('click', () => {

        document
            .querySelectorAll('.tab')
            .forEach(t => t.classList.remove('active'));

        document
            .querySelectorAll('.tabContent')
            .forEach(c => c.classList.remove('active'));

        tab.classList.add('active');

        document
            .getElementById(tab.dataset.tab)
            .classList.add('active');
    });
});

// =======================
// HELPERS
// =======================

async function chooseFolder(inputId) {

    const folder =
        await window.electronAPI.selectFolder();

    if (folder) {
        document.getElementById(inputId).value = folder;
    }
}

// =======================
// VIDEO
// =======================

document
    .getElementById('browseVideoInput')
    .onclick = () =>
        chooseFolder('videoInput');

document
    .getElementById('browseVideoOutput')
    .onclick = () =>
        chooseFolder('videoOutput');

document
    .getElementById('startVideo')
    .onclick = async () => {

        logs.textContent = '';

        await window.electronAPI
            .startVideoConversion(

                document.getElementById('videoInput').value,

                document.getElementById('videoOutput').value
            );
    };

// =======================
// AUDIO
// =======================

document
    .getElementById('browseAudioInput')
    .onclick = () =>
        chooseFolder('audioInput');

document
    .getElementById('browseAudioOutput')
    .onclick = () =>
        chooseFolder('audioOutput');

document
    .getElementById('startAudio')
    .onclick = async () => {

        logs.textContent = '';

        await window.electronAPI
            .startAudioConversion(

                document.getElementById('audioInput').value,

                document.getElementById('audioOutput').value,

                document.getElementById('audioFormat').value
            );
    };

window.electronAPI.onLog(addLog);