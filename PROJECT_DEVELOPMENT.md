# Interactive Photography Exposure Learning Tool

## Project Overview

This project is a Vite + React + TypeScript single-page learning tool for photography beginners. It visualizes the exposure triangle with a warm island-style teaching scene:

- Aperture changes background blur.
- Shutter speed changes motion blur on the cycling Manbo subject.
- ISO changes brightness and noise.
- The exposure meter shows EV offset and exposure status.
- Users can switch between effect learning and exposure learning modes.
- The interface supports Chinese, Japanese, Korean, and English.

The current product name shown in Chinese is `互动式摄影曝光学习工具`.

## Current Stack

- Vite
- React
- TypeScript
- `animal-island-ui`
- Canvas 2D
- Vitest

## Runtime Structure

```text
src/
  App.tsx
  components/
    ControlPanel.tsx
    ExposureCanvas.tsx
    ExposureMeter.tsx
    ModeSwitch.tsx
  lib/
    assetLoader.ts
    canvasRenderer.ts
    exposure.ts
    i18n.ts
  styles.css
```

## Main Data Flow

`App.tsx` owns the global UI state:

- `mode`: `effects` or `exposure`
- `settings`: aperture, shutter speed, ISO
- `language`: `zh`, `ja`, `ko`, or `en`

The selected language is resolved through `getTranslation(language)` in `src/lib/i18n.ts`, then passed into the mode switch, control panel, and exposure meter. Exposure math remains in `src/lib/exposure.ts` so it can stay independent from UI language.

`ExposureCanvas` loads image assets from `public/assets/` and calls `renderExposureScene()` whenever assets, mode, or camera settings change.

## Language Support

The language options are defined in `src/lib/i18n.ts`:

- `zh`: Chinese
- `ja`: Japanese
- `ko`: Korean
- `en`: English

When adding or editing interface copy, update the translation object for all four languages and extend `src/lib/i18n.test.ts` if the copy is part of a core workflow.

## Assets

Runtime assets live in `public/assets/`:

```text
public/assets/background.png
public/assets/cat_reference.jpg
public/assets/manbo.png
public/assets/manbo_bike.png
public/assets/manbo_bike_2.png
```

Source/reference images kept in the repository root use English names:

```text
background-source.png
generated-scene-2026-07-04-184109.png
manbo-static-source.png
manbo-bike-source.png
manbo-bike-alt-source.png
```

The app has Canvas fallbacks for required runtime assets. Missing assets should not crash the page.

## Exposure Model

The baseline exposure is:

```text
f/16, 1/125s, ISO 100 = EV 0
```

`src/lib/exposure.ts` provides:

- discrete aperture, shutter, and ISO stops
- exposure EV calculation
- exposure status classification
- aperture blur mapping
- shutter motion blur mapping
- ISO noise mapping

Keep this module focused on calculations and visual-effect parameters. UI labels and localized teaching copy belong in `src/lib/i18n.ts`.

## Development Commands

```bash
npm install
npm run dev
npm test
npm run build
npm run preview
```

## Verification Checklist

Before publishing changes:

1. Run `npm test`.
2. Run `npm run build`.
3. Open the app locally and check:
   - language selector changes visible UI copy
   - both learning modes work
   - aperture, shutter, and ISO controls update the Canvas
   - exposure meter text changes with the selected language
   - mobile layout remains usable

## GitHub

Remote repository:

[https://github.com/mosaic-dng/photography-learning](https://github.com/mosaic-dng/photography-learning)
