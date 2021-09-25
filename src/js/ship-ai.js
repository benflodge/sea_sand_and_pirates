/* jslint browser: true */
/* global window, PF, p2 */
import * as constants from './constants';
import * as utils from './utils';
import ship from './ship';
import { WALL } from './map';

const defaults = {
    shipImageTile: 93,
    cannonRange: 192,
};

function normalizeAngle(angle) {
    angle = angle % (2 * Math.PI);
    if (angle < 0) {
        angle += 2 * Math.PI;
    }
    return angle;
}

export default {
    losTime: null,
    targetAngle: null,
    lineOfSight: false,

    create(view, x, y, options) {
        const { game } = view;

        if (
            !utils.typeChecker(
                ['object', 'object', 'number', 'number'],
                view,
                game,
                x,
                y
            )
        ) {
            return null;
        }

        const obj = ship.create.apply(ship, arguments);
        if (!obj) {
            return null;
        }

        return Object.assign(obj, defaults, options, this);
    },

    makeMove(view) {
        const { game } = view;
        const targetShip = game.actors.playerShip;
        const cannonBalls = game.actors.cannonBalls;
        const timeStamp = game.physics.timeStamp;
        const aStarGraph = game.aStarGraph;

        if (!this.isActive()) {
            return;
        }

        if (!targetShip.isActive()) {
            this.body.angularVelocity = 0;
            return;
        }

        const target = {
            ship: targetShip,
            angleToShip: utils.angleTo(this.body, targetShip.body),
            distance: utils.distance(this.body, targetShip.body),
        };

        if (timeStamp > this.losTime + 1) {
            this.hasLineOfSight(view, target);
            this.losTime = timeStamp;

            this.path = window.path = null;
        }

        // Critical systems - dont crash into the world or other ships
        // *near* is one ships distance

        // if near land turn port side
        // -- if port side is blocked turn starboard
        // --- if starboard is blocked stop and turn till facing open sea

        // if friendly ship is near and ahead turn toward other side
        // -- if other side is also blocked stop and turn till facing open sea

        // Mission Systems - kill the player
        // if target is is in range and direction of guns fire
        // if target is in line of sight and close, position to fire
        // if target is in line of sight and not close enough to fire follow ship
        // if target is not in line of sight and if the ship has a course set follow course
        // if target is not in line of sight plot course and follow

        const heading = normalizeAngle(this.getAngle());
        const bearing = target.angleToShip;
        const bearingDiff = utils.deltaAngle(heading, bearing);

        this.body.angularVelocity = 0;

        if (
            this.lineOfSight &&
            target.distance * 32 < 192 &&
            bearingDiff >= 0 &&
            bearingDiff < 0.24
        ) {
            this.turnToBroadside(bearingDiff);
            this.fireStarboard(cannonBalls);
        } else if (
            this.lineOfSight &&
            target.distance * 32 < 192 &&
            bearingDiff > 2.9 &&
            bearingDiff < 3.5
        ) {
            this.turnToBroadside(bearingDiff);
            this.firePort(cannonBalls);
        } else if (this.lineOfSight && target.distance * 32 < 192) {
            this.turnToBroadside(bearingDiff);
        } else if (this.lineOfSight) {
            this.followShip(target, heading);
        } else if (this.path && this.path.length) {
            this.followCourseToShip(target, aStarGraph, heading);
        } else {
            this.plotCourseToShip(target, aStarGraph, heading);
        }
    },

    hasLineOfSight(view, target) {
        const rayX = this.getX();
        const rayY = this.getY();

        const tx = target.ship.getX();
        const ty = target.ship.getY();

        const result = new p2.RaycastResult();
        const ray = new p2.Ray({
            mode: p2.Ray.ALL,
            from: [rayX, rayY],
            to: [tx, ty],
            callback: result => this.rayCallback(result, target, ray),
        });

        view.game.physics.world.raycast(result, ray);
    },

    rayCallback(result, target) {
        if (this.body === result.body) {
            return;
        }

        if (target.ship.body === result.body) {
            this.lineOfSight = true;
            return;
        }

        if (result.body.parent && WALL === result.body.parent.type) {
            this.lineOfSight = false;
            result.stop();
            return;
        }
    },

    turnToBroadside(bearingDiff) {
        if (bearingDiff > 0.01 && bearingDiff < 1.49) {
            this.body.angularVelocity = 1;
        } else if (bearingDiff < -0.01 && bearingDiff >= -1.5) {
            this.body.angularVelocity = -1;
        } else if (bearingDiff > 1.5 && bearingDiff < 3.1) {
            this.body.angularVelocity = -1;
        } else if (bearingDiff < -1.5 && bearingDiff > -3.1) {
            this.body.angularVelocity = 1;
        }
    },

    followShip(target, heading) {
        this.turnToward(heading, target.angleToShip);

        this.body.applyForceLocal([0, this.speed]);
    },

    turnToward(heading, targetAngle) {
        const difference = utils.deltaAngle(
            heading - constants.threeQAngle,
            targetAngle
        );

        if (Math.abs(difference) < 0.01) {
            // noop
        } else if (difference > 0) {
            this.body.angularVelocity = 1;
        } else {
            this.body.angularVelocity = -1;
        }
    },

    followCourseToShip(target, aStarGraph, heading) {
        let targetAngle = null;

        if (this.path && this.path.length) {
            this.findWayPoint(this.path);
            targetAngle = this.findDirectionFromPath(this.path);
        }

        if (targetAngle) {
            // let difference = utils.deltaAngle(newAngle, targetAngle).toFixed(3) * 1;
            this.turnToward(heading, targetAngle);
        }

        this.body.applyForceLocal([0, 20]);
    },

    findWayPoint(path) {
        const checkGridBounds = (pos, waypoint) =>
            pos >= waypoint && pos <= waypoint + 32;

        const pathPos = utils.scaleMapToPosition(path[0][0], path[0][1]);
        const pos = utils.scaleMapToPosition(this.getX(), this.getY());

        if (
            checkGridBounds(pos.x, pathPos.x) &&
            checkGridBounds(pos.y, pathPos.y)
        ) {
            path.shift();
        }
    },

    findDirectionFromPath(path) {
        if (path.length) {
            const pathPos = utils.scaleMapToPosition(path[0][0], path[0][1]);
            const pos = utils.scaleMapToPosition(this.getX(), this.getY());

            return utils.angleTo(
                {
                    position: [pos.x, pos.y],
                },
                {
                    position: [pathPos.x, pathPos.y],
                }
            );
        }

        return null;
    },

    plotCourseToShip(target, aStarGraph) {
        // Need to update the follow routine to use each step of the a* and only recalculate
        // when needed (if the player ship has moved significantly).

        this.path = this.findPathToShip(target.ship, aStarGraph);
        this.followCourseToShip.apply(this, arguments);
    },

    findPathToShip(targetShip, aStarGraph) {
        const checkInGridBoundsElseCenter = (pos, gridLength) =>
            pos >= 0 && pos < gridLength ? pos : Math.floor(gridLength / 2);

        const finder = new PF.AStarFinder({
            turnPenalty: 20,
            avoidStarcasing: true,
            allowDiagonal: true,
        });

        const path = (window.path = finder.findPath(
            checkInGridBoundsElseCenter(
                Math.floor(this.getX()),
                aStarGraph.width
            ),
            checkInGridBoundsElseCenter(
                Math.floor(this.getY()),
                aStarGraph.width
            ),
            checkInGridBoundsElseCenter(
                Math.floor(targetShip.getX()),
                aStarGraph.width
            ),
            checkInGridBoundsElseCenter(
                Math.floor(targetShip.getY()),
                aStarGraph.width
            ),
            aStarGraph.clone()
        ));

        return path;
    },
};
