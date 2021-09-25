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

function showHelp(view) {
    view.uiElements.helpPopup.classList.toggle('hidden');
    view.currentGame && view.currentGame.stop();
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
                showHelp(view);
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

function toggleMenu(view) {
    view.uiElements.startPopup.classList.toggle('hidden');
}

function bindStartPopupModal(view) {
    events.addEvent(view.uiElements.startPopup, 'click', evt => {
        switch (evt.target) {
            case view.uiElements.startGameButton:
                toggleMenu(view);
                const seed = view.uiElements.startGameSeed.valueAsNumber;
                view.startGame(seed >= 0 || seed <= 65536 ? seed : 0);
                break;
        }
    });

    view.ui.toggleMenu = () => toggleMenu(view)
}

function bindHelpPopupModal(view) {
    events.addEvent(view.uiElements.helpPopup, 'click', evt => {
        switch (evt.target) {
            case view.uiElements.helpPopup:
            case view.uiElements.helpClose:
                view.uiElements.helpPopup.classList.toggle('hidden');
                view.currentGame && view.currentGame.run();
                break;
            case view.uiElements.restartGameButton:
                view.uiElements.helpPopup.classList.toggle('hidden');
                view.ui.toggleMenu();
                break;
        }
    });

    view.ui.pause = () => showHelp(view);
}

function toggleGameOverPopup(view) {
    view.currentGame && view.currentGame.stop();
    view.uiElements.gameOverPopup.classList.toggle('hidden');
}

function bindGameOverPopupModal(view) {
    events.addEvent(view.uiElements.gameOverPopup, 'click', evt => {
        switch (evt.target) {
            case view.uiElements.tryAgainButton:
                toggleGameOverPopup(view);
                view.ui.toggleMenu();
                break;
        }
    });

    view.ui.gameOver = () => toggleGameOverPopup(view);
}

function toggleWinPopup(view) {
    view.currentGame && view.currentGame.stop();
    view.uiElements.winPopup.classList.toggle('hidden');
}

function bindWinPopupModal(view) {
    events.addEvent(view.uiElements.winPopup, 'click', evt => {
        switch (evt.target) {
            case view.uiElements.newGameButton:
                toggleWinPopup(view);
                view.ui.toggleMenu();
                break;
        }
    });

    view.ui.winGame = () => toggleWinPopup(view);
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
    const ui = {};

    const view = {
        keyDown,
        sfx,
        uiElements,
        ui,
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
    bindStartPopupModal(view);
    bindHelpPopupModal(view);
    bindGameOverPopupModal(view);
    bindWinPopupModal(view);

    return view;
}
