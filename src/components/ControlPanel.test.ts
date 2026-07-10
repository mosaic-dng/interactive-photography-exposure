import { createElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { getTranslation } from '../lib/i18n';
import type { CameraSettings } from '../types';
import { ControlPanel } from './ControlPanel';

vi.mock('animal-island-ui', async () => {
  const { createElement } = await import('react');

  return {
    Button: (props: Record<string, unknown>) => createElement('button', props),
    Card: (props: Record<string, unknown>) => createElement('div', props),
    Tag: (props: Record<string, unknown>) => createElement('span', props),
  };
});

type HostElement = ReactElement<Record<string, unknown>, string>;

function render(node: ReactNode): ReactNode {
  if (Array.isArray(node)) {
    return node.map(render);
  }

  if (!isValidElement(node)) {
    return node;
  }

  if (typeof node.type === 'function') {
    const Component = node.type as (props: unknown) => ReactNode;
    return render(Component(node.props));
  }

  const props = node.props as Record<string, unknown>;
  return {
    ...node,
    props: {
      ...props,
      children: render(props.children as ReactNode),
    },
  } as ReactElement;
}

function findAll(node: ReactNode, type: string): HostElement[] {
  if (Array.isArray(node)) {
    return node.flatMap((child) => findAll(child, type));
  }

  if (!isValidElement(node)) {
    return [];
  }

  const props = node.props as Record<string, unknown>;
  const descendants = findAll(props.children as ReactNode, type);
  return node.type === type ? [node as HostElement, ...descendants] : descendants;
}

const settings: CameraSettings = {
  aperture: 8,
  shutterSeconds: 1 / 500,
  iso: 100,
};

function renderControlPanel(onChange = vi.fn()) {
  return render(createElement(ControlPanel, {
    settings,
    mode: 'effects',
    translation: getTranslation('en'),
    onChange,
  }));
}

describe('ControlPanel', () => {
  it('labels each range and exposes its formatted camera value', () => {
    const tree = renderControlPanel();
    const ranges = findAll(tree, 'input').filter((element) => element.props.type === 'range');

    expect(ranges.map(({ props }) => ({
      id: props.id,
      ariaValueText: props['aria-valuetext'],
    }))).toEqual([
      { id: 'aperture-control', ariaValueText: 'f/8' },
      { id: 'shutter-control', ariaValueText: '1/500s' },
      { id: 'iso-control', ariaValueText: 'ISO 100' },
    ]);
    expect(findAll(tree, 'label').map(({ props }) => props.htmlFor)).toEqual([
      'aperture-control',
      'shutter-control',
      'iso-control',
    ]);
  });

  it('updates aperture through the native range change event', () => {
    const onChange = vi.fn();
    const tree = renderControlPanel(onChange);
    const apertureRange = findAll(tree, 'input').find(
      (element) => element.props.id === 'aperture-control',
    );

    expect(apertureRange).toBeDefined();
    const handleChange = apertureRange?.props.onChange as
      | ((event: { currentTarget: { value: string } }) => void)
      | undefined;
    handleChange?.({ currentTarget: { value: '4' } });

    expect(onChange).toHaveBeenCalledWith({
      aperture: 5.6,
      shutterSeconds: 1 / 500,
      iso: 100,
    });
  });
});
