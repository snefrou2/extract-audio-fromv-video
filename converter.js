const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

const VIDEO_EXTENSIONS = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];

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
                log(`❌ Erreur ${inputPath}`);
                reject(err);
            })
            .save(outputPath);
    });
}

async function convertFolderVideosToAudio(inputFolder, outputFolder, log) {

    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true });
    }

    const files = fs.readdirSync(inputFolder);

    const videoFiles = files.filter(file =>
        VIDEO_EXTENSIONS.includes(path.extname(file).toLowerCase())
    );

    log(`🎬 ${videoFiles.length} vidéo(s) trouvée(s)`);

    for (const file of videoFiles) {

        const inputPath = path.join(inputFolder, file);

        const outputPath = path.join(
            outputFolder,
            path.parse(file).name + '.wav'
        );

        await convertVideoToAudio(inputPath, outputPath, log);
    }

    log('🎉 Conversion terminée');

    return true;
}

module.exports = {
    convertFolderVideosToAudio
};