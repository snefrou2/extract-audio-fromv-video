const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

// Extensions vidéo supportées
const VIDEO_EXTENSIONS = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];

function convertVideoToAudio(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .noVideo()
            .audioCodec('pcm_s16le')
            .audioFrequency(44100)
            .audioChannels(1)
            .format('wav')
            .on('end', () => {
                console.log(`✅ ${path.basename(inputPath)} -> ${path.basename(outputPath)}`);
                resolve();
            })
            .on('error', (err) => {
                console.error(`❌ Erreur sur ${inputPath}`);
                reject(err);
            })
            .save(outputPath);
    });
}

async function convertFolderVideosToAudio(inputFolder, outputFolder) {
    // Vérifie si le dossier input existe
    if (!fs.existsSync(inputFolder)) {
        console.error(`❌ Le dossier input n'existe pas : ${inputFolder}`);
        process.exit(1);
    }

    // Crée le dossier output si nécessaire
    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true });
    }

    const files = fs.readdirSync(inputFolder);

    const videoFiles = files.filter(file =>
        VIDEO_EXTENSIONS.includes(path.extname(file).toLowerCase())
    );

    if (videoFiles.length === 0) {
        console.log('⚠️ Aucune vidéo trouvée');
        return;
    }

    console.log(`🎬 ${videoFiles.length} vidéo(s) trouvée(s)`);

    for (const file of videoFiles) {
        const inputPath = path.join(inputFolder, file);

        const outputFileName =
            path.parse(file).name + '.wav';

        const outputPath = path.join(outputFolder, outputFileName);

        try {
            await convertVideoToAudio(inputPath, outputPath);
        } catch (err) {
            console.error(`Erreur conversion : ${file}`);
        }
    }

    console.log('🎉 Conversion terminée');
}

// ----------------------
// Arguments CLI
// ----------------------

const inputFolder = process.argv[2];
const outputFolder = process.argv[3];

if (!inputFolder || !outputFolder) {
    console.log('Usage :');
    console.log('node index.js <dossier_videos> <dossier_audios>');
    process.exit(1);
}

convertFolderVideosToAudio(inputFolder, outputFolder);