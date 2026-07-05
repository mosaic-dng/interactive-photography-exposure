import { describe, expect, it } from 'vitest';
import { shouldRenderExposureScene } from './ExposureCanvas';

describe('ExposureCanvas render timing', () => {
  it('waits for asset loading to finish before rendering the scene', () => {
    expect(shouldRenderExposureScene(null)).toBe(false);
    expect(shouldRenderExposureScene({})).toBe(true);
  });
});
