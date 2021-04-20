function bitRound(float) {
    return (0.5 + float) | 0;
}

function bitFloor(float) {
    return float | 0;
}

function randomRange(min, max) {
    min = Math.ceil(min);
    max = bitFloor(max);
    return bitFloor(Math.random() * (max - min)) + min;
}

function scalePositionToMap(x, y, tileSize = 32) {
    return {
        x: bitFloor(x / tileSize),
        y: bitFloor(y / tileSize),
    };
}

function scaleMapToPosition(x, y, tileSize = 32) {
    return {
        x: bitFloor(x) * tileSize,
        y: bitFloor(y) * tileSize,
    };
}

function terrainIsPassible(map, x, y, tileSize = 32) {
    const position = scalePositionToMap(x, y, tileSize);

    if (map[position.y] && map[position.y][position.x] === 1) {
        return false;
    } else {
        return true;
    }
}

function norm(value, min, max) {
    return (value - min) / (max - min);
}

function lerp(norm, min, max) {
    return (max - min) * norm + min;
}

function map(value, sourceMin, sourceMax, destMin, destMax) {
    return lerp(norm(value, sourceMin, sourceMax), destMin, destMax);
}

function clamp(value, min, max) {
    return value < min ? min : value > max ? max : value;
}

function angleTo(p1, p2) {
    return Math.atan2(
        p2.position[1] - p1.position[1],
        p2.position[0] - p1.position[0]
    );
}

function distance(p0, p1) {
    const dx = p1.position[0] - p0.position[0],
        dy = p1.position[1] - p0.position[1];
    return Math.sqrt(dx * dx + dy * dy);
}

function distanceXY(x0, y0, x1, y1) {
    const dx = x1 - x0,
        dy = y1 - y0;
    return Math.sqrt(dx * dx + dy * dy);
}

function deltaAngle(current, target) {
    let delta = target - current;

    // Keep it in range from -180 to 180 to make the most efficient turns.
    if (delta > Math.PI) delta -= Math.PI * 2;
    if (delta < -Math.PI) delta += Math.PI * 2;

    return delta;
}

function typeChecker(types) {
    let isOk = true;
    for (let i = 0; i < types.length; i++) {
        isOk = typeof arguments[i + 1] === types[i];
        if (!isOk) {
            break;
        }
    }
    return isOk;
}

export {
    angleTo,
    bitRound,
    bitFloor,
    clamp,
    deltaAngle,
    distance,
    distanceXY,
    lerp,
    map,
    norm,
    randomRange,
    scaleMapToPosition,
    scalePositionToMap,
    terrainIsPassible,
    typeChecker,
};
