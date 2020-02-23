/* jslint browser: true */
import ship from './ship';

export default {
    create() {
        let obj = ship.create.apply(ship, arguments);
        if (!obj) {
            return null;
        }

        obj = Object.assign(obj, this);
        return obj;
    },

    makeMove(view, game) {
        this.updateControls(view.keyDown, game.actors.cannonBalls);
        this.updateAngle(view.keyDown, game.actors.cannonBalls);
    },

    updateControls(keyDown, cannonBalls) {
        if (!this.isActive()) {
            return;
        }

        if (keyDown.c) {
            this.fireStarboard(cannonBalls);
        }

        if (keyDown.v) {
            this.firePort(cannonBalls);
        }
    },

    updateAngle(keyDown) {
        if (!this.isActive()) {
            return;
        }

        if (keyDown.up) {
            this.body.applyForceLocal([0, this.speed]);
        }

        if (keyDown.right) {
            this.body.angularVelocity = 1;
        } else if (keyDown.left) {
            this.body.angularVelocity = -1;
        } else {
            this.body.angularVelocity = 0;
        }
    },
};
