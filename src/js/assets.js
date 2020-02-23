/* global Image */
import imageAssets from './constants/imageAssets';

function loadAllAssets(assets) {
    return Promise.all(
        assets.map(
            asset =>
                new Promise(resolve => {
                    const image = new Image();
                    asset.image = image;
                    image.onload = () => resolve(asset);
                    image.src = asset.url;
                })
        )
    );
}

function parseAssets(assets) {
    const assetMap = {};
    assets.forEach(asset => {
        assetMap[asset.name] = asset.image;
    });

    return assetMap;
}

export default function loadAssets(view) {
    return loadAllAssets(imageAssets)
        .then(parseAssets)
        .then(assets => {
            view.assets = assets;
        });
}
