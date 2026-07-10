import { describe, expect, it, vi } from 'vitest';
import {
  createBackgroundSourceCache,
  drawApertureBackground,
  getApertureBlurStrategy,
  getPortableBlurScale,
  SCENE_SUBJECT_LAYOUT,
} from './canvasRenderer';

describe('background source cache', () => {
  it('reuses unchanged image and generated background sources', () => {
    const cache = createBackgroundSourceCache<object, object>();
    const create = vi.fn((image?: object) => ({ image }));
    const image = {};

    expect(cache.get(image, create)).toBe(cache.get(image, create));
    expect(cache.get(undefined, create)).toBe(cache.get(undefined, create));
    expect(create).toHaveBeenCalledTimes(2);
  });
});

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

  it('draws a zero-blur background sharply and restores the existing filter', () => {
    let filterAtDraw: string | undefined;
    let currentFilter: string | undefined = 'blur(8px)';
    const savedFilters: Array<string | undefined> = [];
    const context = {
      get filter() {
        return currentFilter;
      },
      set filter(value: string | undefined) {
        currentFilter = value;
      },
      save() {
        savedFilters.push(currentFilter);
      },
      drawImage() {
        filterAtDraw = currentFilter;
      },
      restore() {
        currentFilter = savedFilters.pop();
      },
    } as unknown as CanvasRenderingContext2D;

    drawApertureBackground(context, {} as HTMLCanvasElement, 0);

    expect(filterAtDraw).toBe('none');
    expect(context.filter).toBe('blur(8px)');
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
