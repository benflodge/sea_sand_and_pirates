/* global  */
import setupView from './game-view';
import gameLoop from './game-loop';
import startPhysics, { update } from './physics';
import createGameActors from './game-elements';
import draw from './draw';
import createGameMap from './map';
import loadAssets from './assets';

function startGame(seed) {
    view.game = {
        physics: null,
        map: null,
        actors: null,
    };

    startPhysics(view);
    createGameMap(view, seed);
    createGameActors(view);

    const currentGame = (view.currentGame = gameLoop.create(
        view,
        update,
        draw
    ));
    currentGame.run();
}

const view = setupView();
view.startGame = startGame;

loadAssets(view).then(view.ui.toggleMenu);
