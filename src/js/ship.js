/* jslint browser: true */
/* global window, p2 */
import * as constants from './constants';
import * as utils from './utils';
import shipSprites from './constants/shipSprites/ships-miscellaneous-sheet';

export const SHIP = 'SHIP';

const defaults = {
    cannonSpeed: 600,
    speed: 60,
    hull: 300,
    shipImageTile: 91,
};

export default {
    firing: false,
    type: SHIP,

    create(view, x, y, options) {
        const { game } = view;

        if (!utils.typeChecker(['object', 'number', 'number'], view, x, y)) {
            return null;
        }

        const obj = Object.create(this);

        Object.assign(obj, defaults, options);

        obj.active = true;
        obj.view = view;

        const shipShape = new p2.Circle({
            radius: 1,
        });

        obj.body = new p2.Body({
            mass: 30,
            damping: 0.3,
            angularDamping: 0,
            position: [x / 32, y / 32],
        });

        obj.body.parent = obj;

        obj.body.addShape(shipShape);
        game.physics.world.addBody(obj.body);

        return obj;
    },

    fireStarboard(cannonBalls) {
        this.fire(cannonBalls, 'STARBOARD');
    },

    firePort(cannonBalls) {
        this.fire(cannonBalls, 'PORT');
    },

    fire(cannonBalls, dir) {
        if (this.firing) {
            return;
        }

        this.firing = true;

        const options = {
            xVel: this.getXVel(),
            yVel: this.getYVel(),
            angle: this.getAngle() + constants.nauticalConstants[dir],
            parent: this,
        };

        cannonBalls.add(this.view, this.getX(), this.getY(), options);

        window.setTimeout(this.fireFinished.bind(this), this.cannonSpeed);
    },

    fireFinished() {
        this.firing = false;
    },

    damageHull(view, dmg) {
        this.hull -= typeof dmg === 'number' ? dmg : 100;
        if (this.hull <= 0) {
            this.setActive(view, false);
        }
    },

    draw(view, image) {
        if (!this.isActive()) {
            return;
        }

        var point = this.findRenderPoint();

        view.context.save();
        view.context.beginPath();
        view.context.translate(
            utils.bitFloor(point[0] * 32 + view.viewport.x),
            utils.bitFloor(point[1] * 32 + view.viewport.y)
        );

        view.context.rotate(this.getAngle());

        view.context.drawImage(
            image,
            shipSprites.SubTexture[this.shipImageTile].x,
            shipSprites.SubTexture[this.shipImageTile].y,
            shipSprites.SubTexture[this.shipImageTile].width,
            shipSprites.SubTexture[this.shipImageTile].height,
            -30,
            -50,
            60,
            100
        );

        if (window.debug) {
            view.context.beginPath();
            view.context.arc(0, 0, 1 * 32, 0, 2 * Math.PI);
            view.context.stroke();

            view.context.arc(0, 0, 192, 0, 2 * Math.PI);
            view.context.stroke();
        }
        view.context.restore();

        if (window.debug) {
            // Debug: draw a* path on mini map
            if (this.path) {
                for (let i = 0; i < this.path.length; i++) {
                    const element = this.path[i];

                    view.mapContext.save();
                    view.mapContext.translate(element[0], element[1]);

                    view.mapContext.fillStyle = 'orange';
                    view.mapContext.fillRect(0, 0, 2, 2);
                    view.mapContext.restore();
                }
            }

            // Debug: draw a* path on map
            if (this.path) {
                for (let i = 0; i < this.path.length; i++) {
                    const element = this.path[i];
                    const pos = utils.scaleMapToPosition(
                        element[0],
                        element[1]
                    );

                    view.context.save();
                    view.context.translate(
                        pos.x + 16 + view.viewport.x,
                        pos.y + 16 + view.viewport.y
                    );
                    view.context.fillStyle = 'orange';
                    view.context.fillRect(0, 0, 4, 4);
                    view.context.restore();
                }
            }
        }
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

    getXVel() {
        if (!this.body) {
            return null;
        }
        return this.body.velocity[0];
    },

    getYVel() {
        if (!this.body) {
            return null;
        }
        return this.body.velocity[1];
    },

    getRenderAngle() {
        return this.body.interpolatedAngle;
    },

    getAngle() {
        if (!this.body) {
            return null;
        }
        return this.body.angle;
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
};
