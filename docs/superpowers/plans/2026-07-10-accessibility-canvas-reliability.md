# Accessibility and Canvas Reliability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the exposure controls accessible, preserve aperture blur without Canvas filter support, and avoid rebuilding unchanged background sources.

**Architecture:** Keep React state and the existing render order intact. Add explicit control semantics in the components, select a native or portable aperture-blur strategy in the renderer, and cache only the unblurred background source through a small generic cache helper.

**Tech Stack:** React 19, TypeScript 5.9, Canvas 2D, Vitest 4, Vite 7

---

### Task 1: Expose meaningful range-control semantics

**Files:**
- Modify: `src/components/ControlPanel.test.ts`
- Modify: `src/components/ControlPanel.tsx:22-141`

- [ ] **Step 1: Replace the structural smoke assertions with a failing accessibility test**

Replace `src/components/ControlPanel.test.ts` with this complete test file:

```tsx
import type { ReactElement, ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { getTranslation } from '../lib/i18n';
import { ControlPanel } from './ControlPanel';

type TestElementProps = {
  children?: ReactNode;
  htmlFor?: string;
  id?: string;
  onChange?: (event: { currentTarget: { value: string } }) => void;
  type?: string;
  'aria-valuetext'?: string;
};

vi.mock('animal-island-ui', () => ({
  Button: ({ children, ...props }: { children?: ReactNode }) => ({
    type: 'button',
    props: { ...props, children },
  }),
  Card: ({ children, ...props }: { children?: ReactNode }) => ({
    type: 'div',
    props: { ...props, children },
  }),
  Tag: ({ children, ...props }: { children?: ReactNode }) => ({
    type: 'span',
    props: { ...props, children },
  }),
}));

function renderControlPanel(onChange = vi.fn()) {
  return ControlPanel({
    settings: { aperture: 8, shutterSeconds: 1 / 500, iso: 100 },
    mode: 'effects',
    translation: getTranslation('zh'),
    onChange,
  });
}

function findElements(node: ReactNode, type: string): ReactElement<TestElementProps>[] {
  if (node === null || node === undefined || typeof node === 'boolean') return [];
  if (Array.isArray(node)) return node.flatMap((child) => findElements(child, type));
  if (typeof node !== 'object' || !('props' in node)) return [];

  const element = node as ReactElement<TestElementProps>;
  if (typeof element.type === 'function') {
    const renderComponent = element.type as (props: TestElementProps) => ReactNode;
    return findElements(renderComponent(element.props), type);
  }

  const children = findElements(element.props.children, type);
  return element.type === type ? [element, ...children] : children;
}

describe('ControlPanel range controls', () => {
it('associates every range with a translated label and formatted value', () => {
  const panel = renderControlPanel();
  const ranges = findElements(panel, 'input').filter(
    (element) => element.props.type === 'range',
  );
  const labels = findElements(panel, 'label');

  expect(ranges.map((range) => ({
    id: range.props.id,
    ariaValueText: range.props['aria-valuetext'],
  }))).toEqual([
    { id: 'aperture-control', ariaValueText: 'f/8' },
    { id: 'shutter-control', ariaValueText: '1/500s' },
    { id: 'iso-control', ariaValueText: 'ISO 100' },
  ]);
  expect(labels.map((label) => label.props.htmlFor)).toEqual([
    'aperture-control',
    'shutter-control',
    'iso-control',
  ]);
});

  it('updates camera settings through the native range change handler', () => {
    const onChange = vi.fn();
    const apertureRange = findElements(renderControlPanel(onChange), 'input').find(
      (element) => element.props.id === 'aperture-control',
    );

    apertureRange?.props.onChange?.({ currentTarget: { value: '4' } });

    expect(onChange).toHaveBeenCalledWith({
      aperture: 5.6,
      shutterSeconds: 1 / 500,
      iso: 100,
    });
  });
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- src/components/ControlPanel.test.ts`

Expected: FAIL because the ranges do not have IDs or `aria-valuetext`, and the wrapping labels do not have `htmlFor`.

- [ ] **Step 3: Implement explicit labels and accessible values**

Add these exact props to the three existing `SliderControl` calls while leaving their current label, bounds, description, button labels, and `onInput` callbacks unchanged:

```tsx
<SliderControl
  controlId="aperture-control"
  ariaValueText={formatAperture(settings.aperture)}
  label={controls.apertureLabel}
  value={formatAperture(settings.aperture)}
  min={0}
  max={APERTURE_STOPS.length - 1}
  step={1}
  index={apertureIndex}
  description={controls.apertureDescription}
  stepDownLabel={controls.stepDown}
  stepUpLabel={controls.stepUp}
  onInput={(index) => onChange({ ...settings, aperture: APERTURE_STOPS[index] })}
/>

<SliderControl
  controlId="shutter-control"
  ariaValueText={formatShutterSpeed(settings.shutterSeconds)}
  label={controls.shutterLabel}
  value={formatShutterSpeed(settings.shutterSeconds)}
  min={0}
  max={SHUTTER_STOPS.length - 1}
  step={1}
  index={shutterIndex}
  description={controls.shutterDescription}
  stepDownLabel={controls.stepDown}
  stepUpLabel={controls.stepUp}
  onInput={(index) => onChange({ ...settings, shutterSeconds: SHUTTER_STOPS[index].value })}
/>

<SliderControl
  controlId="iso-control"
  ariaValueText={`ISO ${settings.iso}`}
  label={controls.isoLabel}
  value={String(settings.iso)}
  min={0}
  max={ISO_STOPS.length - 1}
  step={1}
  index={isoIndex}
  description={controls.isoDescription}
  stepDownLabel={controls.stepDown}
  stepUpLabel={controls.stepUp}
  onInput={(index) => onChange({ ...settings, iso: ISO_STOPS[index] })}
/>
```

Add `controlId: string` and `ariaValueText: string` to `SliderControlProps`, destructure them in `SliderControl`, remove the draft Pointer/Touch handlers and React event-type import, and replace the returned element with:

```tsx
<div className="slider-control">
  <span className="slider-row">
    <label htmlFor={controlId}>{label}</label>
    <strong>{value}</strong>
  </span>
  <span className="range-row">
    <Button
      type="default"
      size="small"
      htmlType="button"
      disabled={!canStepDown}
      aria-label={`${label} ${stepDownLabel}`}
      onClick={() => onInput(Math.max(min, index - step))}
    >
      -
    </Button>
    <input
      id={controlId}
      type="range"
      min={min}
      max={max}
      step={step}
      value={index}
      aria-valuetext={ariaValueText}
      onChange={(event) => onInput(Number(event.currentTarget.value))}
    />
    <Button
      type="default"
      size="small"
      htmlType="button"
      disabled={!canStepUp}
      aria-label={`${label} ${stepUpLabel}`}
      onClick={() => onInput(Math.min(max, index + step))}
    >
      +
    </Button>
  </span>
  <span className="slider-description">{description}</span>
</div>
```

- [ ] **Step 4: Verify GREEN**

Run: `npm test -- src/components/ControlPanel.test.ts`

Expected: PASS with the three IDs, explicit label associations, and formatted accessible values.

- [ ] **Step 5: Commit the range-control fix**

```bash
git add src/components/ControlPanel.tsx src/components/ControlPanel.test.ts
git commit -m "fix: label exposure range controls"
```

### Task 2: Expose the selected learning mode

**Files:**
- Create: `src/components/ModeSwitch.test.ts`
- Modify: `src/components/ModeSwitch.tsx:14-31`

- [ ] **Step 1: Write a failing mode-state test**

```tsx
import type { ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ModeSwitch } from './ModeSwitch';

vi.mock('animal-island-ui', () => ({
  Button: 'button',
}));

it('exposes the mode group and current pressed state', () => {
  const result = ModeSwitch({
    mode: 'effects',
    labels: {
      ariaLabel: '学习模式切换',
      effects: '学习效果',
      exposure: '学习曝光',
    },
    onChange: () => undefined,
  }) as ReactElement<{
    role?: string;
    children: ReactElement<{ 'aria-pressed'?: boolean }>[];
  }>;

  expect(result.props.role).toBe('group');
  expect(result.props.children.map((button) => button.props['aria-pressed'])).toEqual([
    true,
    false,
  ]);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- src/components/ModeSwitch.test.ts`

Expected: FAIL because the container has no group role and the buttons have no `aria-pressed` state.

- [ ] **Step 3: Add group and toggle-button semantics**

```tsx
<div className="mode-switch" role="group" aria-label={labels.ariaLabel}>
  <Button
    type={mode === 'effects' ? 'primary' : 'default'}
    size="middle"
    aria-pressed={mode === 'effects'}
    onClick={() => onChange('effects')}
  >
    {labels.effects}
  </Button>
  <Button
    type={mode === 'exposure' ? 'primary' : 'default'}
    size="middle"
    aria-pressed={mode === 'exposure'}
    onClick={() => onChange('exposure')}
  >
    {labels.exposure}
  </Button>
</div>
```

- [ ] **Step 4: Verify GREEN and commit**

Run: `npm test -- src/components/ModeSwitch.test.ts`

Expected: PASS.

```bash
git add src/components/ModeSwitch.tsx src/components/ModeSwitch.test.ts
git commit -m "fix: expose selected learning mode"
```

### Task 3: Select a portable blur strategy

**Files:**
- Modify: `src/lib/canvasRenderer.test.ts`
- Modify: `src/lib/canvasRenderer.ts:56-129`

- [ ] **Step 1: Write failing strategy tests**

```ts
import {
  getApertureBlurStrategy,
  getPortableBlurScale,
} from './canvasRenderer';

describe('aperture blur strategy', () => {
  it('uses native filters only when the context exposes them', () => {
    expect(getApertureBlurStrategy('none', 12)).toBe('native');
    expect(getApertureBlurStrategy(undefined, 12)).toBe('portable');
    expect(getApertureBlurStrategy(undefined, 0)).toBe('none');
  });

  it('keeps portable downsampling within usable bounds', () => {
    expect(getPortableBlurScale(0)).toBe(1);
    expect(getPortableBlurScale(2)).toBeLessThan(1);
    expect(getPortableBlurScale(12)).toBeGreaterThanOrEqual(0.12);
    expect(getPortableBlurScale(12)).toBeLessThanOrEqual(0.2);
  });
});
```

- [ ] **Step 2: Run the renderer test and verify RED**

Run: `npm test -- src/lib/canvasRenderer.test.ts`

Expected: FAIL because `getApertureBlurStrategy` is not exported.

- [ ] **Step 3: Implement strategy selection and distinct draw paths**

```ts
export type ApertureBlurStrategy = 'none' | 'native' | 'portable';

export function getApertureBlurStrategy(
  canvasFilter: string | undefined,
  blur: number,
): ApertureBlurStrategy {
  if (blur <= 0) return 'none';
  return typeof canvasFilter === 'string' ? 'native' : 'portable';
}

export function getPortableBlurScale(blur: number) {
  if (blur <= 0) return 1;
  return Math.max(0.12, 1 / (1 + blur * 0.44));
}

function drawApertureBackground(
  ctx: CanvasRenderingContext2D,
  background: HTMLCanvasElement,
  blur: number,
) {
  const strategy = getApertureBlurStrategy(ctx.filter, blur);

  if (strategy === 'none') {
    ctx.drawImage(background, 0, 0);
    return;
  }

  if (strategy === 'native') {
    ctx.save();
    ctx.filter = `blur(${blur}px)`;
    ctx.drawImage(background, 0, 0);
    ctx.restore();
    return;
  }

  const scale = getPortableBlurScale(blur);
  const blurLayer = document.createElement('canvas');
  blurLayer.width = Math.max(1, Math.round(CANVAS_WIDTH * scale));
  blurLayer.height = Math.max(1, Math.round(CANVAS_HEIGHT * scale));
  const blurCtx = blurLayer.getContext('2d');

  if (!blurCtx) {
    ctx.drawImage(background, 0, 0);
    return;
  }

  blurCtx.imageSmoothingEnabled = true;
  blurCtx.imageSmoothingQuality = 'high';
  blurCtx.drawImage(background, 0, 0, blurLayer.width, blurLayer.height);
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(
    blurLayer,
    0,
    0,
    blurLayer.width,
    blurLayer.height,
    0,
    0,
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
  );
  ctx.restore();
}
```

Make `drawUnifiedBackground` call `drawApertureBackground(ctx, background, blur)` after retrieving its source.

- [ ] **Step 4: Verify GREEN**

Run: `npm test -- src/lib/canvasRenderer.test.ts`

Expected: PASS, including the existing subject-layout tests.

- [ ] **Step 5: Commit the portable blur behavior**

```bash
git add src/lib/canvasRenderer.ts src/lib/canvasRenderer.test.ts
git commit -m "fix: add portable aperture blur fallback"
```

### Task 4: Cache unchanged background sources

**Files:**
- Modify: `src/lib/canvasRenderer.test.ts`
- Modify: `src/lib/canvasRenderer.ts:41-85`

- [ ] **Step 1: Write a failing cache-reuse test**

```ts
import { vi } from 'vitest';
import { createBackgroundSourceCache } from './canvasRenderer';

it('reuses image-backed and generated background sources', () => {
  const cache = createBackgroundSourceCache<object, object>();
  const create = vi.fn((image?: object) => ({ image }));
  const image = {};

  expect(cache.get(image, create)).toBe(cache.get(image, create));
  expect(cache.get(undefined, create)).toBe(cache.get(undefined, create));
  expect(create).toHaveBeenCalledTimes(2);
});
```

- [ ] **Step 2: Run the renderer test and verify RED**

Run: `npm test -- src/lib/canvasRenderer.test.ts`

Expected: FAIL because `createBackgroundSourceCache` does not exist.

- [ ] **Step 3: Implement the cache helper and use it in rendering**

```ts
export function createBackgroundSourceCache<TImage extends object, TSource>() {
  const imageSources = new WeakMap<TImage, TSource>();
  let generatedSource: TSource | undefined;

  return {
    get(image: TImage | undefined, create: (image?: TImage) => TSource) {
      if (!image) {
        generatedSource ??= create();
        return generatedSource;
      }

      const cached = imageSources.get(image);
      if (cached) return cached;

      const source = create(image);
      imageSources.set(image, source);
      return source;
    },
  };
}

const backgroundSourceCache =
  createBackgroundSourceCache<HTMLImageElement, HTMLCanvasElement>();

function createUnifiedBackground(backgroundImage?: HTMLImageElement) {
  const background = document.createElement('canvas');
  background.width = CANVAS_WIDTH;
  background.height = CANVAS_HEIGHT;
  const bg = background.getContext('2d');
  if (!bg) return background;

  if (backgroundImage) {
    drawCoverImage(bg, backgroundImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  } else {
    drawSky(bg);
    drawSun(bg, 150, 130, 58);
    drawCloud(bg, 348, 150, 0.98);
    drawCloud(bg, 700, 154, 0.95);
    drawCloud(bg, 1106, 165, 1.14);
    drawMountains(bg);
    drawHorizonAndGround(bg);
    drawDistantTreesAndBushes(bg);
    drawFlowersAndGrass(bg);
  }

  return background;
}

function drawUnifiedBackground(
  ctx: CanvasRenderingContext2D,
  blur: number,
  backgroundImage?: HTMLImageElement,
) {
  const background = backgroundSourceCache.get(
    backgroundImage,
    createUnifiedBackground,
  );
  drawApertureBackground(ctx, background, blur);
}
```

- [ ] **Step 4: Verify GREEN and commit**

Run: `npm test -- src/lib/canvasRenderer.test.ts`

Expected: PASS with one factory call per unique image and one factory call for generated scenery.

```bash
git add src/lib/canvasRenderer.ts src/lib/canvasRenderer.test.ts
git commit -m "perf: cache canvas background sources"
```

### Task 5: Run full verification and update the repository

**Files:**
- Verify: `src/**/*.ts`
- Verify: `src/**/*.tsx`
- Verify: `docs/superpowers/specs/2026-07-10-accessibility-canvas-reliability-design.md`
- Verify: `docs/superpowers/plans/2026-07-10-accessibility-canvas-reliability.md`

- [ ] **Step 1: Run automated verification**

```bash
npm test
npm run build
npm audit --omit=dev --audit-level=moderate
git diff --check
```

Expected: all tests pass, Vite production build exits 0, audit reports zero known production vulnerabilities, and `git diff --check` prints no errors.

- [ ] **Step 2: Run browser verification**

Verify the deployed-equivalent production build at desktop width and 390×844:

- No horizontal overflow.
- All three sliders expose translated accessible names and formatted values.
- Exactly one learning-mode button is pressed.
- Aperture, shutter, ISO, language, and mode interactions update visible state.
- No console warnings or errors.

- [ ] **Step 3: Apply the React quality checklist**

Confirm explicit labels, native keyboard interactions, complete hook dependencies, stable IDs, no redundant Pointer/Touch handlers, and no unnecessary component memoization.

- [ ] **Step 4: Commit the plan and any final verification adjustments**

```bash
git add docs/superpowers/plans/2026-07-10-accessibility-canvas-reliability.md
git commit -m "docs: plan accessibility and canvas fixes"
```

- [ ] **Step 5: Push the verified commits directly to main**

```bash
git push origin main
```

Expected: the remote `main` advances to the final verified commit.
