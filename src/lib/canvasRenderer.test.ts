import { describe, expect, it } from 'vitest';
import { SCENE_SUBJECT_LAYOUT } from './canvasRenderer';

describe('scene subject layout', () => {
  it('places the cycling Manbo on the same ground line as the standing Manbo', () => {
    const standingGround =
      SCENE_SUBJECT_LAYOUT.standing.box.y +
      SCENE_SUBJECT_LAYOUT.standing.box.height * SCENE_SUBJECT_LAYOUT.standing.shadowBaseline;
    const cyclingGround =
      SCENE_SUBJECT_LAYOUT.cycling.box.y +
      SCENE_SUBJECT_LAYOUT.cycling.box.height * SCENE_SUBJECT_LAYOUT.cycling.shadowBaseline;

    expect(cyclingGround).toBeCloseTo(standingGround, 0);
  });
});
