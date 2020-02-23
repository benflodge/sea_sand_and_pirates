/* global */
import * as utils from './utils';
import audio from './audio';
import audioFiles from './constants/audioFiles';

export default {
    create() {
        const obj = Object.create(this);
        obj.audio = audio.create(audioFiles);

        return obj;
    },

    playCannonSound() {
        if (!this.audio.isEnabled()) {
            return;
        }

        const soundNo = utils.randomRange(1, 8);
        const soundBuffer = this.audio.getSoundBuffer(`cannon${soundNo}`);

        if (soundBuffer) {
            this.audio.playSound(soundBuffer);
        }
    },
};
