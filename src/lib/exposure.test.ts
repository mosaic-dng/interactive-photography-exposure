import { describe, expect, it } from 'vitest';
import {
  calculateExposureEV,
  getExposureStatus,
  getApertureBlur,
  getShutterMotionBlurSettings,
  getIsoNoiseSettings,
  getMeterAriaValue,
} from './exposure';

describe('exposure calculations', () => {
  it('treats f/16, 1/125s, ISO 100 as the 0EV baseline', () => {
    expect(calculateExposureEV(16, 1 / 125, 100)).toBeCloseTo(0, 5);
  });

  it('adds exposure when aperture opens, shutter slows, or ISO rises', () => {
    expect(calculateExposureEV(8, 1 / 125, 100)).toBeCloseTo(2, 5);
    expect(calculateExposureEV(16, 1 / 30, 100)).toBeCloseTo(2.06, 2);
    expect(calculateExposureEV(16, 1 / 125, 800)).toBeCloseTo(3, 5);
  });

  it('classifies underexposure, normal exposure, and overexposure', () => {
    expect(getExposureStatus(-3.2).label).toBe('严重欠曝');
    expect(getExposureStatus(-1.5).label).toBe('欠曝');
    expect(getExposureStatus(0.4).label).toBe('正常曝光');
    expect(getExposureStatus(1.5).label).toBe('过曝');
    expect(getExposureStatus(3.2).label).toBe('严重过曝');
  });

  it('clamps the aria meter value to the visible meter range', () => {
    expect(getMeterAriaValue(-12)).toBe(-4);
    expect(getMeterAriaValue(0.75)).toBe(0.75);
    expect(getMeterAriaValue(12)).toBe(4);
  });
});

describe('visual effect mappings', () => {
  it('makes wide apertures visibly blurrier than narrow apertures', () => {
    expect(getApertureBlur(1.4)).toBeGreaterThan(getApertureBlur(5.6));
    expect(getApertureBlur(5.6)).toBeGreaterThan(getApertureBlur(16));
    expect(getApertureBlur(1.4)).toBeGreaterThanOrEqual(14);
    expect(getApertureBlur(5.6)).toBeGreaterThanOrEqual(4);
  });

  it('adds stronger motion blur for slower shutter speeds', () => {
    expect(getShutterMotionBlurSettings(1 / 8).blurDistance).toBeGreaterThan(
      getShutterMotionBlurSettings(1 / 500).blurDistance,
    );
    expect(getShutterMotionBlurSettings(1 / 8).sampleCount).toBeGreaterThan(
      getShutterMotionBlurSettings(1 / 500).sampleCount,
    );
  });

  it('adds ghost trails and directional blur for slower shutter speeds', () => {
    const fast = getShutterMotionBlurSettings(1 / 500);
    const slow = getShutterMotionBlurSettings(1 / 15);

    expect(slow).toMatchObject({
      trailCount: expect.any(Number),
      trailAlpha: expect.any(Number),
      dynamicBlur: expect.any(Number),
    });
    expect((slow as typeof slow & { trailCount: number }).trailCount).toBeGreaterThan(
      (fast as typeof fast & { trailCount: number }).trailCount,
    );
    expect((slow as typeof slow & { trailAlpha: number }).trailAlpha).toBeGreaterThan(0);
    expect((slow as typeof slow & { dynamicBlur: number }).dynamicBlur).toBeGreaterThan(0);
  });

  it('increases ISO noise and brightness lift as ISO rises', () => {
    expect(getIsoNoiseSettings(12800).alpha).toBeGreaterThan(
      getIsoNoiseSettings(100).alpha,
    );
    expect(getIsoNoiseSettings(12800).density).toBeGreaterThan(
      getIsoNoiseSettings(100).density,
    );
  });
});
