import { describe, expect, it } from 'vitest';
import {
  getApertureBlurStrategy,
  getPortableBlurScale,
  SCENE_SUBJECT_LAYOUT,
} from './canvasRenderer';

describe('aperture blur strategy', () => {
  it('uses native blur when canvas filters are available', () => {
    expect(getApertureBlurStrategy('none', 12)).toBe('native');
  });

  it('uses portable blur when canvas filters are unavailable', () => {
    expect(getApertureBlurStrategy(undefined, 12)).toBe('portable');
  });

  it('skips blur when the blur amount is zero', () => {
    expect(getApertureBlurStrategy(undefined, 0)).toBe('none');
  });

  it('keeps full scale when blur is disabled', () => {
    expect(getPortableBlurScale(0)).toBe(1);
  });

  it('downscales for a positive blur amount', () => {
    expect(getPortableBlurScale(2)).toBeLessThan(1);
  });

  it('uses a strong but bounded downscale for aperture blur', () => {
    const scale = getPortableBlurScale(12);

    expect(scale).toBeGreaterThanOrEqual(0.12);
    expect(scale).toBeLessThanOrEqual(0.2);
  });
});

describe('scene subject layout', () => {
  it('makes the cycling Manbo larger and the standing Manbo smaller', () => {
    expect(SCENE_SUBJECT_LAYOUT.standing.box.width).toBeLessThan(292);
    expect(SCENE_SUBJECT_LAYOUT.standing.box.height).toBeLessThan(430);
    expect(SCENE_SUBJECT_LAYOUT.cycling.box.width).toBeGreaterThan(500);
    expect(SCENE_SUBJECT_LAYOUT.cycling.box.height).toBeGreaterThan(486);
  });

  it('places the cycling Manbo visible wheels on the same ground line as the standing Manbo feet', () => {
    const standingGround =
      SCENE_SUBJECT_LAYOUT.standing.box.y +
      SCENE_SUBJECT_LAYOUT.standing.box.height * SCENE_SUBJECT_LAYOUT.standing.visibleBottomBaseline;
    const cyclingGround =
      SCENE_SUBJECT_LAYOUT.cycling.box.y +
      SCENE_SUBJECT_LAYOUT.cycling.box.height * SCENE_SUBJECT_LAYOUT.cycling.visibleBottomBaseline;

    expect(cyclingGround).toBeCloseTo(standingGround, 0);
  });
});
