/* global document, window */
import * as constants from './constants/index';
import uiElementIds from './constants/uiElements';
import * as events from './events';
import viewport from './viewport';
import setUiElements from './ui-elements';
import audioSfx from './audio-sfx';

const keyDown = {};

function bindKeyboardEvents() {
    events.addEvent(document.body, 'keydown', evt => {
        events.eventAction(evt, keyDown);
    });
    events.addEvent(document.body, 'keyup', evt => {
        events.eventEnd(evt, keyDown);
    });
}

function bindUiControls(view) {
    events.addEvent(view.uiElements.uiControls, 'click', evt => {
        switch (evt.target.parentElement) {
            case view.uiElements.audioControl:
                toggleAudio(view);
                break;

            case view.uiElements.musicControl:
                toggleMusic(view);
                break;

            case view.uiElements.help:
                view.uiElements.helpPopup.classList.toggle('hidden');
                view.currentGame.stop();
                break;
        }
    });
}

function toggleMusic(view) {
    const audioEnabled = view.music.audio.isEnabled();
    audioEnabled
        ? view.music.audio.disableSound()
        : view.music.audio.enableSound();
    toggleSoundButton(view, !audioEnabled, 'Music');
}

function toggleAudio(view) {
    const audioEnabled = view.sfx.audio.isEnabled();
    audioEnabled ? view.sfx.audio.disableSound() : view.sfx.audio.enableSound();
    toggleSoundButton(view, !audioEnabled, 'Audio');
}

function toggleSoundButton(view, isEnabled, soundType) {
    if (isEnabled) {
        view.uiElements[`audioControl${soundType}Off`].classList.add('hidden');
        view.uiElements[`audioControl${soundType}On`].classList.remove(
            'hidden'
        );
    } else {
        view.uiElements[`audioControl${soundType}Off`].classList.remove(
            'hidden'
        );
        view.uiElements[`audioControl${soundType}On`].classList.add('hidden');
    }
}

function bindHelpPopupModal(view) {
    events.addEvent(view.uiElements.helpPopup, 'click', evt => {
        switch (evt.target) {
            case view.uiElements.helpPopup:
            case view.uiElements.helpClose:
                view.uiElements.helpPopup.classList.toggle('hidden');
                view.currentGame.run();
                break;
            case view.uiElements.startGameButton:
                view.uiElements.helpPopup.classList.toggle('hidden');
                view.startGame();
                break;
        }
    });
}

export default function setupView() {
    const uiElements = setUiElements(uiElementIds);

    const seaContext = uiElements.seaSand.getContext('2d');
    const context = uiElements.canvas.getContext('2d');
    const mapContext = uiElements.mapCanvas.getContext('2d');

    const mapHeight = (uiElements.mapCanvas.height =
        constants.mapSize / constants.tileSize);
    const mapWidth = (uiElements.mapCanvas.width =
        constants.mapSize / constants.tileSize);
    const height = (uiElements.seaSand.height = uiElements.canvas.height =
        window.innerHeight);
    const width = (uiElements.seaSand.width = uiElements.canvas.width =
        window.innerWidth);

    const sfx = audioSfx.create();

    const view = {
        keyDown,
        sfx,
        uiElements,
        seaContext,
        context,
        mapContext,
        mapHeight,
        mapWidth,
        height,
        width,
        viewport,
    };

    bindKeyboardEvents();
    bindUiControls(view);
    bindHelpPopupModal(view);

    return view;
}
