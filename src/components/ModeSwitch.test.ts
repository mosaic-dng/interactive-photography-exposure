import { Children, isValidElement, type ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ModeSwitch } from './ModeSwitch';

vi.mock('animal-island-ui', () => ({
  Button: 'button',
}));

describe('ModeSwitch', () => {
  it('exposes the selected learning mode to assistive technology', () => {
    const tree = ModeSwitch({
      mode: 'effects',
      labels: {
        ariaLabel: '学习模式切换',
        effects: '参数效果',
        exposure: '曝光练习',
      },
      onChange: () => {},
    });
    const buttons = Children.toArray(tree.props.children).filter(isValidElement) as ReactElement<
      Record<string, unknown>
    >[];

    expect(tree.props).toMatchObject({
      role: 'group',
      'aria-label': '学习模式切换',
    });
    expect(buttons.map(({ props }) => props['aria-pressed'])).toEqual([true, false]);
    expect(buttons.map(({ props }) => props.children)).toEqual(['参数效果', '曝光练习']);
  });
});
