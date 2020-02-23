import * as constants from './constants';
import * as utils from './utils';

import { drawMap, drawMiniMap, drawShipOnMiniMap } from './map';

export default function draw(view, timeStamp) {
    const { game } = view;
    const { actors } = game;

    const playerPoint = actors.playerShip.findRenderPoint();

    if (playerPoint) {
        view.viewport.setX(
            constants.tileSize * playerPoint[0],
            view.width,
            constants.mapSize
        );
        view.viewport.setY(
            constants.tileSize * playerPoint[1],
            view.height,
            constants.mapSize
        );
    }

    view.uiElements.canvas.style = `background-position-x: ${utils.bitFloor(
        view.viewport.x
    ) % constants.imageTileSize}px; background-position-y: ${utils.bitFloor(
        view.viewport.y
    ) % constants.imageTileSize}px;`;

    // Clear context
    view.context.clearRect(0, 0, view.width, view.height);

    drawMap(view, game.tileMapValues, view.assets);

    actors.playerShip.draw(view, view.assets.pirateShips);

    actors.enemyShips.forEach(ship => {
        ship.draw(view, view.assets.pirateShips);
    });

    actors.cannonBalls.collection.forEach(ball => ball.draw(view, view.assets));

    if (timeStamp) {
        view.mapContext.beginPath();
        view.mapContext.clearRect(0, 0, view.mapWidth, view.mapHeight);

        // Draw mini map and playerShip dot
        drawMiniMap(view.mapContext, game.map);
        drawShipOnMiniMap(view.mapContext, actors.playerShip);

        actors.enemyShips.forEach(ship => {
            drawShipOnMiniMap(view.mapContext, ship);
        });
    }

    if (Math.random() > 0.999) {
        // mapWind.changeWind();
        // view.uiElements.compassArrow.setAttribute('transform', 'rotate(' + mapWind.getAngleDegrees() + ')');
    }
}
