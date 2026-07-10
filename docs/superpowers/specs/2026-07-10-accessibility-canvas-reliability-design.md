# Accessibility and Canvas Reliability Design

## Goal

Improve the exposure learning tool's cross-browser Canvas behavior, assistive-technology support, and render efficiency without changing its visual design or camera-control model.

## Scope

This change covers four reviewed problems:

1. Aperture blur must remain visible when `CanvasRenderingContext2D.filter` is unavailable.
2. Aperture, shutter, and ISO range controls must expose meaningful accessible names and values.
3. The active learning mode must be programmatically identifiable.
4. Repeated setting changes must avoid recreating the unchanged full-resolution background source.

The work will not introduce WebGL, replace the design system, redesign the page, or perform a broad renderer rewrite.

## Architecture

### Range controls

`SliderControl` remains a private component inside `ControlPanel.tsx`. Its outer element changes from a wrapping `<label>` to a neutral container. Each range receives a stable ID derived from an explicit control ID prop, while the visible title becomes an explicit `<label htmlFor>`.

The range exposes `aria-valuetext` using the already formatted display value. Assistive technology will therefore announce values such as `f/8`, `1/500s`, and `ISO 100` rather than internal array indexes. Native range pointer, touch, and keyboard behavior remains authoritative; no parallel custom drag event system will be added.

### Learning mode

The two existing buttons remain visually unchanged. Their container becomes a named group, and each button exposes `aria-pressed` according to the current `LearnMode`. The same click callbacks continue to update state.

### Portable aperture blur

The renderer will isolate aperture-background drawing behind small pure helpers:

- A capability helper determines whether the current 2D context can use `filter`.
- A scale helper converts blur strength into a bounded downsampling ratio.
- Supported contexts draw the background with native Canvas blur.
- Unsupported contexts downsample the background to an intermediate canvas and upscale it with image smoothing, producing a portable low-pass blur.

The fallback applies only when blur is requested. A zero-blur aperture draws the source directly.

### Background caching

The full 1280×720 background source is cached by the input background image. Generated fallback scenery uses a separate reusable cached source. The cache stores only the unblurred source; aperture-specific output remains transient so settings do not leak between renders.

This boundary avoids recreating and repainting the static background when shutter speed, ISO, or learning mode changes, while keeping subject motion blur, ISO noise, and exposure overlays responsive.

## Data Flow

1. `App` updates `CameraSettings` or `LearnMode`.
2. `ExposureCanvas` invokes `renderExposureScene` with the current settings and loaded assets.
3. The renderer retrieves or creates the cached unblurred background source.
4. Aperture blur selects the native or portable drawing path.
5. Subjects, motion blur, ISO noise, and the exposure overlay render in their existing order.

No new global application state or asynchronous rendering pipeline is introduced.

## Error Handling

- If an intermediate Canvas context cannot be created, the renderer draws the unblurred source instead of leaving the preview blank.
- Asset-loading behavior remains unchanged.
- Accessibility attributes derive from existing translated labels and formatted values, so all four supported languages remain covered.

## Testing Strategy

Tests will be written before production changes and observed failing for the intended reason.

- `ControlPanel.test.ts` will inspect actual returned React elements and verify each range has a meaningful ID, accessible name association, and formatted `aria-valuetext`.
- `ModeSwitch.test.ts` will verify group semantics and mutually exclusive `aria-pressed` states.
- `canvasRenderer.test.ts` will cover blur capability selection, portable scale bounds, zero-blur behavior, and background-cache reuse through exported testable helpers.
- Existing exposure, asset-loading, internationalization, and renderer tests must remain green.
- Final verification includes the complete Vitest suite, TypeScript/Vite production build, dependency audit, and browser checks at desktop and 390px mobile widths.

## Delivery

The design document is committed separately. After implementation and verification, the code and tests will be committed and pushed directly to `main`, as approved by the repository owner.
