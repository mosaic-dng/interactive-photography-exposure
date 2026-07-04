export type ExposureStatusLevel =
  | 'severe-under'
  | 'under'
  | 'normal'
  | 'over'
  | 'severe-over';

export interface ExposureStatus {
  level: ExposureStatusLevel;
  label: string;
  hint: string;
}

export interface ShutterMotionBlurSettings {
  sampleCount: number;
  blurDistance: number;
  alpha: number;
  trailCount: number;
  trailAlpha: number;
  dynamicBlur: number;
}

export interface IsoNoiseSettings {
  alpha: number;
  density: number;
  brightnessLift: number;
}

const BASELINE_APERTURE = 16;
const BASELINE_SHUTTER_SECONDS = 1 / 125;
const BASELINE_ISO = 100;

export const APERTURE_STOPS = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22] as const;

export const SHUTTER_STOPS = [
  { label: '1/4000s', value: 1 / 4000 },
  { label: '1/2000s', value: 1 / 2000 },
  { label: '1/1000s', value: 1 / 1000 },
  { label: '1/500s', value: 1 / 500 },
  { label: '1/250s', value: 1 / 250 },
  { label: '1/125s', value: 1 / 125 },
  { label: '1/60s', value: 1 / 60 },
  { label: '1/30s', value: 1 / 30 },
  { label: '1/15s', value: 1 / 15 },
  { label: '1/8s', value: 1 / 8 },
  { label: '1s', value: 1 },
] as const;

export const ISO_STOPS = [100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600] as const;

export function formatAperture(aperture: number) {
  return `f/${aperture}`;
}

export function formatShutterSpeed(seconds: number) {
  if (seconds >= 1) {
    return `${seconds}s`;
  }

  return `1/${Math.round(1 / seconds)}s`;
}

export function calculateExposureEV(
  aperture: number,
  shutterSeconds: number,
  iso: number,
) {
  const apertureEV = Math.log2((BASELINE_APERTURE / aperture) ** 2);
  const shutterEV = Math.log2(shutterSeconds / BASELINE_SHUTTER_SECONDS);
  const isoEV = Math.log2(iso / BASELINE_ISO);

  return apertureEV + shutterEV + isoEV;
}

export function getExposureStatus(ev: number): ExposureStatus {
  if (ev <= -3) {
    return {
      level: 'severe-under',
      label: '严重欠曝',
      hint: '画面会明显发暗，细节容易沉下去。',
    };
  }

  if (ev < -1) {
    return {
      level: 'under',
      label: '欠曝',
      hint: '画面偏暗，可以放慢快门、开大光圈或提高 ISO。',
    };
  }

  if (ev <= 1) {
    return {
      level: 'normal',
      label: '正常曝光',
      hint: '整体亮度比较舒服，适合观察三要素的平衡。',
    };
  }

  if (ev < 3) {
    return {
      level: 'over',
      label: '过曝',
      hint: '画面偏亮，可以收小光圈、加快快门或降低 ISO。',
    };
  }

  return {
    level: 'severe-over',
    label: '严重过曝',
    hint: '画面会明显泛白，高光细节容易丢失。',
  };
}

export function getApertureBlur(aperture: number) {
  if (aperture <= 1.4) return 16;
  if (aperture <= 2) return 13;
  if (aperture <= 2.8) return 10;
  if (aperture <= 4) return 7;
  if (aperture <= 5.6) return 4.5;
  if (aperture <= 8) return 2.4;
  if (aperture <= 11) return 1;
  return 0;
}

export function getShutterMotionBlurSettings(
  shutterSeconds: number,
): ShutterMotionBlurSettings {
  if (shutterSeconds <= 1 / 500) {
    return {
      sampleCount: 1,
      blurDistance: 0,
      alpha: 1,
      trailCount: 0,
      trailAlpha: 0,
      dynamicBlur: 0,
    };
  }

  if (shutterSeconds <= 1 / 125) {
    return {
      sampleCount: 8,
      blurDistance: 22,
      alpha: 0.16,
      trailCount: 2,
      trailAlpha: 0.07,
      dynamicBlur: 1.1,
    };
  }

  if (shutterSeconds <= 1 / 30) {
    return {
      sampleCount: 14,
      blurDistance: 54,
      alpha: 0.1,
      trailCount: 4,
      trailAlpha: 0.11,
      dynamicBlur: 2.1,
    };
  }

  if (shutterSeconds <= 1 / 15) {
    return {
      sampleCount: 20,
      blurDistance: 86,
      alpha: 0.072,
      trailCount: 5,
      trailAlpha: 0.14,
      dynamicBlur: 3.1,
    };
  }

  if (shutterSeconds <= 1 / 8) {
    return {
      sampleCount: 26,
      blurDistance: 118,
      alpha: 0.052,
      trailCount: 7,
      trailAlpha: 0.17,
      dynamicBlur: 4.2,
    };
  }

  return {
    sampleCount: 34,
    blurDistance: 164,
    alpha: 0.04,
    trailCount: 9,
    trailAlpha: 0.2,
    dynamicBlur: 5.4,
  };
}

export function getIsoNoiseSettings(iso: number): IsoNoiseSettings {
  const stopsAboveBase = Math.max(0, Math.log2(iso / BASELINE_ISO));
  const normalized = Math.min(stopsAboveBase / 8, 1);

  return {
    alpha: 0.02 + normalized * 0.22,
    density: 0.015 + normalized * 0.18,
    brightnessLift: normalized * 0.2,
  };
}

export function clampEVForMeter(ev: number) {
  return Math.max(-4, Math.min(4, ev));
}
