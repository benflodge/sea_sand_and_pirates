/* global window, console, XMLHttpRequest */
const AudioContext = window.AudioContext || window.webkitAudioContext;

export default {
    audioEnabled: true,

    create(audioFiles) {
        const obj = Object.create(this);
        obj.audioContext = new AudioContext();
        obj.audioFiles = audioFiles;
        obj.loadSounds(audioFiles);

        obj.gainNode = obj.audioContext.createGain();

        return obj;
    },

    loadSounds(audioFiles) {
        const audioFileNames = Object.keys(audioFiles);
        audioFileNames.forEach(soundName =>
            this.loadSound(audioFiles, soundName)
        );
    },

    loadSound(audioFiles, soundName) {
        const request = new XMLHttpRequest();

        request.open('GET', audioFiles[soundName].src, true);
        request.responseType = 'arraybuffer';

        // Decode asynchronously
        request.onload = () => {
            this.audioContext.decodeAudioData(
                request.response,
                function(buffer) {
                    audioFiles[soundName].sound = buffer;
                },
                // eslint-disable-next-line no-console
                console.error
            );
        };
        request.send();
    },

    playSound(soundBuffer) {
        if (!this.audioEnabled) {
            return;
        }

        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        let source = this.audioContext.createBufferSource();
        source.buffer = soundBuffer;
        source.connect(this.audioContext.destination);
        source.start(0);

        return source;
    },

    getSoundBuffer(soundName) {
        return (
            this.audioFiles &&
            this.audioFiles[soundName] &&
            this.audioFiles[soundName].sound
        );
    },

    enableSound() {
        if (this.audioEnabled === false) {
            this.audioContext.resume();
            this.audioEnabled = true;
        }
    },

    disableSound() {
        if (this.audioEnabled === true) {
            this.audioContext.suspend();
            this.audioEnabled = false;
        }
    },

    isEnabled() {
        return this.audioEnabled;
    },
};
