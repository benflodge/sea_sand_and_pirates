/* global window */
import * as constants from './constants';
import * as utils from './utils';

let runner = null;

function gameLoop(timeStamp) {
    if (!this.running) {
        return;
    }

    window.requestAnimationFrame(this.gameLoop);

    // Calculate the time that has elapsed since the last frame
    if (!timeStamp) timeStamp = 0;

    const deltaTime = this.previous ? (timeStamp - this.previous) / 1000 : 0;

    this.update(
        this.view,
        this.frameDuration,
        deltaTime,
        this.maxSubSteps,
        timeStamp
    );
    this.draw(this.view, timeStamp);

    this.previous = timeStamp;
}

const defaults = {
    maxSubSteps: 10,
    frameDuration: 1 / constants.fps,
};

export default {
    update: null,
    draw: null,
    view: null,
    running: false,
    previous: 0,
    lag: 0,
    create(view, update, draw) {
        if (
            !utils.typeChecker(
                ['object', 'function', 'function'],
                view,
                update,
                draw
            )
        ) {
            return null;
        }

        const obj = Object.create(this);
        obj.gameLoop = gameLoop.bind(obj);
        Object.assign(obj, defaults, {
            view,
            update,
            draw,
        });

        return obj;
    },

    run() {
        if (runner) {
            return false;
        }

        this.running = true;
        runner = this;

        this.gameLoop();
        return true;
    },

    stop() {
        this.running = false;
        this.previous = null;
        runner = null;
    },
};
