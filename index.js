const ffmpeg = require('fluent-ffmpeg');

function convertVideoToAudio(input, output) {
    ffmpeg(input)
        .noVideo()
        .audioCodec('pcm_s16le') // WAV compatible
        .audioFrequency(44100)
        .audioChannels(1) // mono recommandé
        .format('wav')
        .on('end', () => console.log('Conversion terminée'))
        .on('error', (err) => console.error('Erreur:', err))
        .save(output);
}

convertVideoToAudio('video.mp4', 'audio.wav');