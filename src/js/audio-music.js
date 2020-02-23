/* global */
import audio from './audio';
import musicFiles from './constants/musicFiles';

export default {
    musicPlaying: false,
    create() {
        const obj = Object.create(this);
        obj.audio = audio.create(musicFiles);

        return obj;
    },

    playMusic() {
        if (!this.audio.isEnabled() || this.musicPlaying) {
            return;
        }

        const soundBuffer = this.audio.getSoundBuffer('music');

        if (soundBuffer) {
            this.musicPlaying = true;
            this.playSound(soundBuffer);
        }
    },
};
