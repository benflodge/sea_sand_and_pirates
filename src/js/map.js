/* global window, PF, p2 */
import * as constants from './constants';
import { bitFloor } from './utils';

export const WALL = 'wall';
export default function createGameMap(view, seed) {
    const { game } = view;
    game.map = createMap(constants.mapSize, constants.mapSize, seed);
    game.mapForImages = parseMapForImages(game.map);
    game.tileMapValues = findTileMapValues(game.mapForImages);
    game.aStarGraph = new PF.Grid(game.map);

    createMapCollisions(game.tileMapValues, game.physics.world);
}

const LAND = 1;
const SHALLOW_WATER = 99;
const WATER = null;

function createMap(width, height, seed = 0) {

    window.noise.seed(typeof seed === 'number' ? seed : 0);

    const map = [];
    for (let x = 0; x < width; x += constants.res) {
        let row = [];
        map.push(row);
        for (let y = 0; y < height; y += constants.res) {
            let p = window.noise.perlin2(
                x * constants.scale,
                y * constants.scale
            );

            if (p > 0.4) {
                row.push(LAND);
            } else if (p > 0.32) {
                row.push(SHALLOW_WATER);
            } else {
                row.push(WATER);
            }
        }
    }
    return map;
}

function parseMapForImages(map) {
    // Flip the values in the map array 1 for land null for water
    return map.map(function(arr) {
        return arr.map(function(val) {
            return val === 1 ? 0 : null;
        });
    });
}

function findTileMapValues(map) {
    return map.map((row, rowIdx) => {
        return row.map((val, idx) => {
            return val === null || val !== 0
                ? null
                : findN(map, rowIdx, idx) |
                      findE(row, idx) |
                      findS(map, rowIdx, idx) |
                      findW(row, idx);
        });
    });
}

function findN(map, rowIdx, idx) {
    return map[rowIdx - 1] && map[rowIdx - 1][idx] === 0 ? 1 : 0;
}

function findS(map, rowIdx, idx) {
    return map[rowIdx + 1] && map[rowIdx + 1][idx] === 0 ? 8 : 0;
}

function findE(row, idx) {
    return row[idx + 1] === 0 ? 4 : 0;
}

function findW(row, idx) {
    return row[idx - 1] === 0 ? 2 : 0;
}

function createMapCollisions(map, world) {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            let tile = map[y][x];
            if (typeof tile === 'number') {
                let box = new p2.Box({ width: 1, height: 1 });
                let wallBody = new p2.Body({
                    mass: 0,
                    position: [x, y],
                });

                wallBody.addShape(box);
                wallBody.parent = {
                    type: WALL,
                };

                world.addBody(wallBody);
            }
        }
    }
}

export function drawMap(view, map, assets) {
    view.context.beginPath();
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            let tile = map[y][x];
            if (typeof tile === 'number') {
                let tilePosition = findSpritePosition(tile);
                // Map is scaled up when drawn by tileSize
                let xPos = x * constants.tileSize;
                let yPos = y * constants.tileSize;

                if (
                    view.viewport.isInViewport(
                        xPos,
                        yPos,
                        view.width,
                        view.height
                    )
                ) {
                    view.context.drawImage(
                        assets.sandTileSet,
                        tilePosition[0] * constants.imageTileSize,
                        tilePosition[1] * constants.imageTileSize,
                        constants.imageTileSize,
                        constants.imageTileSize,
                        bitFloor(xPos + view.viewport.x) -
                            constants.tileSize / 2,
                        bitFloor(yPos + view.viewport.y) -
                            constants.tileSize / 2,
                        constants.tileSize,
                        constants.tileSize
                    );
                }
            }
        }
    }
}

//constants.rowTileCount // 14
//constants.colTileCount // 6
//constants.imageTileSize //64
//0,1,2,4,6,8,9 = 2,5

function findSpritePosition(tile) {
    let value = null;

    switch (tile) {
        case 3:
            value = [2, 2];
            break;
        case 5:
            value = [0, 2];
            break;
        case 7:
            value = [1, 2];
            break;
        case 10:
            value = [2, 0];
            break;
        case 11:
            value = [2, 1];
            break;
        case 12:
            value = [0, 0];
            break;
        case 13:
            value = [0, 1];
            break;
        case 14:
            value = [1, 0];
            break;
        case 15:
            value = [3, 4];
            break;
        default:
            value = [1, 4];
    }
    return value;
}

export function drawMiniMap(context, map) {
    const tileSize = 1;
    context.save();

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            let tile = map[y][x];
            if (typeof tile === 'number') {
                let xPos = bitFloor(x * tileSize);
                let yPos = bitFloor(y * tileSize);

                context.fillStyle = tile === 1 ? '#dbbe64' : '#2a82a8';
                context.fillRect(xPos, yPos, tileSize, tileSize);
            }
        }
    }
    context.restore();
}

export function drawShipOnMiniMap(context, ship) {
    if (!ship.isActive()) {
        return;
    }
    context.save();
    context.translate(bitFloor(ship.getX()), bitFloor(ship.getY()));
    context.fillStyle = ship.color || 'black';
    context.fillRect(0, 0, 2, 2);
    context.restore();
}
