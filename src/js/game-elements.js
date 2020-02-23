import PlayerShip from './ship-player';
import aiShip from './ship-ai';
import { scaleMapToPosition, terrainIsPassible, randomRange } from './utils';
import wind from './wind';
import objectPool from './object-pool';
import cannonBall from './cannon-ball';
import enemyShipsConfig from './constants/enemyShips';

function findRandomStartingPoint(map) {
    let x, y;

    do {
        x = randomRange(0, map.length);
        y = randomRange(0, map.length);
    } while (!terrainIsPassible(map, x, y));

    return scaleMapToPosition(x, y);
}

export default function createGameActors(view) {
    const { game } = view;
    const { map } = game;
    const actors = (game.actors = {});

    const playerStartPos = findRandomStartingPoint(map);
    actors.playerShip = PlayerShip.create(
        view,
        playerStartPos.x,
        playerStartPos.y
    );

    actors.enemyShips = enemyShipsConfig.map(config => {
        const startPos = findRandomStartingPoint(map);
        return aiShip.create(view, startPos.x, startPos.y, config);
    });

    actors.cannonBalls = objectPool.create(cannonBall);
    actors.mapWind = wind.create(view.compassArrow);
}
