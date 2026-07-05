import { describe, expect, it } from 'vitest';
import { SCENE_SUBJECT_LAYOUT } from './canvasRenderer';

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
