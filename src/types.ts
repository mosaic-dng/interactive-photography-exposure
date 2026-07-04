export type LearnMode = 'effects' | 'exposure';

export interface CameraSettings {
  aperture: number;
  shutterSeconds: number;
  iso: number;
}

export type AssetKey =
  | 'background'
  | 'boyStatic'
  | 'girlBike'
  | 'referenceImage';

export type SceneAssets = Partial<Record<AssetKey, HTMLImageElement>>;
