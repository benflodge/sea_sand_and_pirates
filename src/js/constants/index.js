/* jslint browser: true */

export const fps = 30;
// World map settings
export const tileSize = 32; // The size of an ingame tile (32×32)
export const rowTileCount = 14; // The number of tiles in a row of our background
export const colTileCount = 6; // The number of tiles in a column of our background
export const imageTileSize = 64; // The size of tiles in a our background image
export const imageNumTiles = 3; // The number of tiles per row in the tileset image
export const mapSize = 4000;

// Perlin constants
export const scale = 0.0016;
export const res = 32;

export const fullAngle = Math.PI * 2;
export const quarterAngle = Math.PI / 2;
export const threeQAngle = Math.PI + quarterAngle;

// Ship constants
export const nauticalConstants = {
    PORT: quarterAngle,
    STARBOARD: threeQAngle,
};

export const nauticalTerms = Object.keys(nauticalConstants);
