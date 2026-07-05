import type { AssetKey, SceneAssets } from '../types';

export const ASSET_PATHS: Record<AssetKey, string> = {
  background: '/assets/background.png',
  boyStatic: '/assets/manbo.png',
  girlBike: '/assets/manbo_bike_2.png',
};

function loadImage(key: AssetKey, src: string): Promise<[AssetKey, HTMLImageElement | null]> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve([key, image]);
    image.onerror = () => {
      console.warn(`Required asset missing, using Canvas fallback: ${src}`);
      resolve([key, null]);
    };
    image.src = src;
  });
}

export async function loadSceneAssets(): Promise<SceneAssets> {
  const entries = await Promise.all(
    Object.entries(ASSET_PATHS).map(([key, src]) => loadImage(key as AssetKey, src)),
  );

  return entries.reduce<SceneAssets>((assets, [key, image]) => {
    if (image) {
      assets[key] = image;
    }

    return assets;
  }, {});
}
