/* global p2 */
import * as constants from './constants';
import * as utils from './utils';
import shipSprites from './constants/shipSprites/ships-miscellaneous-sheet';

export const CANNON_BALL = 'CANNON_BALL';

const startVelocity = 6;
const radius = 0.1;
const lifeTimeSec = 1.4;

export default {
    parent: null,
    dieTime: null,
    type: CANNON_BALL,
    create(view, x, y, options) {
        if (!utils.typeChecker(['object', 'number', 'number'], view, x, y)) {
            return null;
        }

        const obj = Object.create(this);
        if (!obj) {
            return null;
        }

        return this.setProps(obj, view, x, y, options);
    },

    reset(view, x, y, options) {
        if (this.body) {
            return null;
        }

        return this.setProps(this, view, x, y, options);
    },

    setProps(context, view, x, y, options) {
        const { game } = view;
        const { xVel, yVel, parent } = options;
        let { angle } = options;

        if (
            !utils.typeChecker(
                ['number', 'number', 'number', 'object'],
                xVel,
                yVel,
                angle,
                parent
            )
        ) {
            return null;
        }

        angle = angle + Math.PI / 2;

        context.parent = parent;
        context.active = true;

        context.dieTime = game.physics.world.time + lifeTimeSec;

        context.body = new p2.Body({
            mass: 4,
            damping: 0.3,
            angularDamping: 0,
            position: [1 * Math.cos(angle) + x, 1 * Math.sin(angle) + y],
            velocity: [
                startVelocity * Math.cos(angle) + xVel,
                startVelocity * Math.sin(angle) + yVel,
            ],
        });

        const ballShape = new p2.Circle({
            radius: radius,
        });

        context.body.parent = context;
        context.body.addShape(ballShape);
        game.physics.world.addBody(context.body);

        view.sfx.playCannonSound(view);

        return context;
    },

    update(view) {
        const { game } = view;
        if (this.isActive() && this.dieTime <= game.physics.world.time) {
            this.setActive(view, false);
        }
    },

    setActive(view, isActive) {
        const { game } = view;

        if (typeof isActive === 'boolean') {
            this.active = isActive;

            if (!isActive) {
                game.physics.removeBodies.push(this.body);
                this.body.parent = null;
                this.body = null;
            }
        }
    },

    isActive() {
        return this.active;
    },

    findRenderPoint() {
        if (!this.body) {
            return null;
        }
        return this.body.interpolatedPosition;
    },

    findRenderX() {
        if (!this.body) {
            return null;
        }
        return this.body.interpolatedPosition[0];
    },

    findRenderY() {
        if (!this.body) {
            return null;
        }
        return this.body.interpolatedPosition[1];
    },

    getX() {
        if (!this.body) {
            return null;
        }
        return this.body.position[0];
    },

    getY() {
        if (!this.body) {
            return null;
        }
        return this.body.position[1];
    },

    getAngle() {
        if (!this.body) {
            return null;
        }
        return this.body.interpolatedAngle;
    },

    draw(view, assets) {
        if (!this.isActive()) {
            return;
        }

        // Draw cannon balls
        view.context.drawImage(
            assets.pirateShips,
            shipSprites.SubTexture[1].x,
            shipSprites.SubTexture[1].y,
            shipSprites.SubTexture[1].width,
            shipSprites.SubTexture[1].height,
            utils.bitFloor(this.getX() * constants.tileSize + view.viewport.x),
            utils.bitFloor(this.getY() * constants.tileSize + view.viewport.y),
            10,
            10
        );
    },
};
