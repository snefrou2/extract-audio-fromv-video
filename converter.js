const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

const VIDEO_EXTENSIONS = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];
const AUDIO_EXTENSIONS = [
    '.mp3',
    '.wav',
    '.m4a',
    '.aac',
    '.flac',
    '.ogg',
    '.opus',
    '.wma',
    '.aiff',
    '.alac',
    '.ac3',
    '.amr',
    '.webm',
    '.mka'
];
function ensureFolder(folder) {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }
}

// =======================
// VIDEO -> WAV
// =======================

function convertVideoToAudio(inputPath, outputPath, log) {

    return new Promise((resolve, reject) => {

        ffmpeg(inputPath)
            .noVideo()
            .audioCodec('pcm_s16le')
            .audioFrequency(44100)
            .audioChannels(1)
            .format('wav')

            .on('end', () => {
                log(`✅ ${path.basename(inputPath)} converti`);
                resolve();
            })

            .on('error', (err) => {
                log(`❌ ${inputPath}`);
                reject(err);
            })

            .save(outputPath);
    });
}

async function convertFolderVideosToAudio(inputFolder, outputFolder, log) {

    ensureFolder(outputFolder);

    const files = fs.readdirSync(inputFolder);

    const videoFiles = files.filter(file =>
        VIDEO_EXTENSIONS.includes(
            path.extname(file).toLowerCase()
        )
    );

    log(`🎬 ${videoFiles.length} vidéo(s)`);

    for (const file of videoFiles) {

        const inputPath = path.join(inputFolder, file);

        const outputPath = path.join(
            outputFolder,
            path.parse(file).name + '.wav'
        );

        await convertVideoToAudio(
            inputPath,
            outputPath,
            log
        );
    }

    log('🎉 Conversion vidéo terminée');
}

// =======================
// AUDIO CONVERTER
// =======================

function convertAudioFile(
    inputPath,
    outputPath,
    format,
    log
) {

    return new Promise((resolve, reject) => {

        let command = ffmpeg(inputPath);

        if (format === 'wav') {

            command
                .audioCodec('pcm_s16le')
                .audioFrequency(44100)
                .audioChannels(1)
                .format('wav');

        } else if (format === 'mp3') {

            command
                .audioCodec('libmp3lame')
                .audioBitrate('192k')
                .format('mp3');
        }

        command
            .on('end', () => {
                log(`✅ ${path.basename(inputPath)} -> ${format}`);
                resolve();
            })

            .on('error', (err) => {
                log(`❌ Erreur ${inputPath}`);
                reject(err);
            })

            .save(outputPath);
    });
}

async function convertFolderAudio(
    inputFolder,
    outputFolder,
    format,
    log
) {

    ensureFolder(outputFolder);

    const files = fs.readdirSync(inputFolder);
    

    const audioFiles = files.filter(file =>
        AUDIO_EXTENSIONS.includes(
            path.extname(file).toLowerCase()
        )
    );

    log(`🎵 ${audioFiles.length} audio(s)`);

    for (const file of audioFiles) {

    const currentExtension =
        path.extname(file).toLowerCase();

    // Ignore si déjà au bon format
    if (currentExtension === '.' + format) {

        log(`⏭️ Skip ${file} déjà en ${format}`);

        continue;
    }

    const inputPath =
        path.join(inputFolder, file);

    const outputPath = path.join(
        outputFolder,
        path.parse(file).name + '.' + format
    );

    await convertAudioFile(
        inputPath,
        outputPath,
        format,
        log
    );
}

    log('🎉 Conversion audio terminée');
}

module.exports = {
    convertFolderVideosToAudio,
    convertFolderAudio
};