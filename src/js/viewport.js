import * as utils from './utils';

export default {
    x: 0,
    y: 0,
    isInViewport(xPos, yPos, screenWidth, screenHeight, margin = 200) {
        return (
            xPos > -this.x - margin &&
            xPos < -this.x + screenWidth + margin &&
            yPos > -this.y - margin &&
            yPos < -this.y + screenHeight + margin
        );
    },
    calculateX(shipX, screenWidth, mapSize, margin = 100) {
        return utils.clamp(
            -shipX + screenWidth / 2,
            screenWidth - mapSize - margin,
            margin
        );
    },

    calculateY(shipY, screenHeight, mapSize, margin = 100) {
        return utils.clamp(
            -shipY + screenHeight / 2,
            screenHeight - mapSize - margin,
            margin
        );
    },
    setX(shipX, screenWidth, mapSize) {
        this.x = utils.bitFloor(this.calculateX(shipX, screenWidth, mapSize));
    },
    setY(shipY, screenHeight, mapSize) {
        this.y = utils.bitFloor(this.calculateY(shipY, screenHeight, mapSize));
    },
};
