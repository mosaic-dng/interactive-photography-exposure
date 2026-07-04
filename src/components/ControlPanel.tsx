import { Button, Card } from 'animal-island-ui';
import {
  APERTURE_STOPS,
  ISO_STOPS,
  SHUTTER_STOPS,
  formatAperture,
  formatShutterSpeed,
} from '../lib/exposure';
import type { getTranslation } from '../lib/i18n';
import type { CameraSettings, LearnMode } from '../types';
import { ExposureMeter } from './ExposureMeter';

type Translation = ReturnType<typeof getTranslation>;

interface ControlPanelProps {
  settings: CameraSettings;
  mode: LearnMode;
  translation: Translation;
  onChange: (settings: CameraSettings) => void;
}

export function ControlPanel({ settings, mode, translation, onChange }: ControlPanelProps) {
  const apertureIndex = APERTURE_STOPS.findIndex((value) => value === settings.aperture);
  const shutterIndex = SHUTTER_STOPS.findIndex((stop) => stop.value === settings.shutterSeconds);
  const isoIndex = ISO_STOPS.findIndex((value) => value === settings.iso);
  const { controls } = translation;

  return (
    <Card className="control-card" pattern="default">
      <div className="control-stack">
        <SliderControl
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
        <ExposureMeter settings={settings} translation={translation} />
        <p className="lesson-copy">{buildLessonCopy(settings, mode, translation)}</p>
      </div>
    </Card>
  );
}

interface SliderControlProps {
  label: string;
  value: string;
  min: number;
  max: number;
  step: number;
  index: number;
  description: string;
  stepDownLabel: string;
  stepUpLabel: string;
  onInput: (index: number) => void;
}

function SliderControl({
  label,
  value,
  min,
  max,
  step,
  index,
  description,
  stepDownLabel,
  stepUpLabel,
  onInput,
}: SliderControlProps) {
  const canStepDown = index > min;
  const canStepUp = index < max;

  return (
    <label className="slider-control">
      <span className="slider-row">
        <span>{label}</span>
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
          type="range"
          min={min}
          max={max}
          step={step}
          value={index}
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
    </label>
  );
}

function buildLessonCopy(settings: CameraSettings, mode: LearnMode, translation: Translation) {
  if (mode === 'exposure') {
    return translation.lessons.exposureMode;
  }

  if (settings.aperture <= 2.8) {
    return translation.lessons.wideAperture;
  }

  if (settings.shutterSeconds >= 1 / 30) {
    return translation.lessons.slowShutter;
  }

  if (settings.iso >= 3200) {
    return translation.lessons.highIso;
  }

  return translation.lessons.default;
}
