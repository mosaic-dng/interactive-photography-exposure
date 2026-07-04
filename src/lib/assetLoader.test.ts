import { describe, expect, it } from 'vitest';
import { ASSET_PATHS } from './assetLoader';

describe('scene asset paths', () => {
  it('uses the generated Manbo scene assets for the main canvas', () => {
    expect(ASSET_PATHS).toMatchObject({
      background: '/assets/background.png',
      boyStatic: '/assets/manbo.png',
      girlBike: '/assets/manbo_bike_2.png',
    });
  });
});
