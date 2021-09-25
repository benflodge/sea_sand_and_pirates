/* global p2 */
import { SHIP } from './ship';
import { CANNON_BALL } from './cannon-ball';
import { WALL } from './map';

export default function startPhysics(view) {
    const { game } = view;
    const physics = (game.physics = {});

    physics.removeBodies = [];
    physics.world = new p2.World({
        gravity: [0, 0],
    });
    physics.world.defaultContactMaterial.friction = 0;
    physics.world.applyGravity = false;
    physics.world.on('postStep', () => postStep(view));
    physics.world.on('beginContact', evt => beginContact(evt, view));
}

export function update(view, frameDuration, deltaTime, maxSubSteps, timeStamp) {
    const { game } = view;
    const { physics, actors } = game;

    physics.timeStamp = timeStamp;


    // const ships = actors.enemyShips.concat([actors.playerShip]);
    // var windForce = p2.vec2.create();
    // for(let i = 0; i < ships.length; i++){
    //     var b =  ships[i].body;
    //     p2.vec2.scale(windForce, mapWind.vector, b.mass);
    //     p2.vec2.add(b.force, b.force, windForce);
    // }

    actors.cannonBalls.collection.forEach(ball => ball.update(view));

    physics.removeBodies.forEach(removeBody => {
        physics.world.removeBody(removeBody);
    });

    physics.world.step(frameDuration, deltaTime, maxSubSteps);
}

function postStep(view) {
    const { game } = view;

    let enemyCount = 0
    game.actors.enemyShips.forEach(ship => {
        if (ship.isActive()) {
            ship.makeMove(
                view,
                game.actors.playerShip,
                game.physics.timeStamp,
                game.actors.cannonBalls,
                game.aStarGraph
            );
            enemyCount ++;
        }
    });

    if (game.actors.playerShip.isActive()) {
        game.actors.playerShip.makeMove(view, game);
    } else {
        view.ui.gameOver();
        return;
    }

    if(enemyCount == 0) {
        view.ui.winGame();
        return;
    }
}

function beginContact(evt, view) {
    const thingA = evt.bodyA.parent;
    const thingB = evt.bodyB.parent;

    if (!thingA || !thingB) {
        return;
    }

    if (thingA.type === SHIP && thingB.type === SHIP) {
        thingA.damageHull(view, 20);
        thingB.damageHull(view, 20);
    } else if (
        thingA.type === SHIP &&
        thingB.type === CANNON_BALL &&
        thingB.parent !== thingA
    ) {
        thingA.damageHull(view);
    } else if (
        thingB.type === SHIP &&
        thingA.type === CANNON_BALL &&
        thingA.parent !== thingB
    ) {
        thingB.damageHull(view);
    } else if (thingA.type === SHIP && thingB.type === WALL) {
        thingA.damageHull(view, 50);
    } else if (thingB.type === SHIP && thingA.type === WALL) {
        thingB.damageHull(view, 50);
    } else {
        // do nothing - no one cares
    }
}
