import { Button, Card } from 'animal-island-ui';
import {
  APERTURE_STOPS,
  ISO_STOPS,
  SHUTTER_STOPS,
  formatAperture,
  formatShutterSpeed,
} from '../lib/exposure';
import type { CameraSettings, LearnMode } from '../types';
import { ExposureMeter } from './ExposureMeter';

interface ControlPanelProps {
  settings: CameraSettings;
  mode: LearnMode;
  onChange: (settings: CameraSettings) => void;
}

export function ControlPanel({ settings, mode, onChange }: ControlPanelProps) {
  const apertureIndex = APERTURE_STOPS.findIndex((value) => value === settings.aperture);
  const shutterIndex = SHUTTER_STOPS.findIndex((stop) => stop.value === settings.shutterSeconds);
  const isoIndex = ISO_STOPS.findIndex((value) => value === settings.iso);

  return (
    <Card className="control-card" pattern="default">
      <div className="control-stack">
        <SliderControl
          label="光圈 Aperture"
          value={formatAperture(settings.aperture)}
          min={0}
          max={APERTURE_STOPS.length - 1}
          step={1}
          index={apertureIndex}
          description="大光圈让背景更虚，小光圈让远近都更清楚。"
          onInput={(index) => onChange({ ...settings, aperture: APERTURE_STOPS[index] })}
        />
        <SliderControl
          label="快门 Shutter"
          value={formatShutterSpeed(settings.shutterSeconds)}
          min={0}
          max={SHUTTER_STOPS.length - 1}
          step={1}
          index={shutterIndex}
          description="快门越慢，骑车的曼波本身越容易被拉成运动模糊。"
          onInput={(index) => onChange({ ...settings, shutterSeconds: SHUTTER_STOPS[index].value })}
        />
        <SliderControl
          label="ISO"
          value={String(settings.iso)}
          min={0}
          max={ISO_STOPS.length - 1}
          step={1}
          index={isoIndex}
          description="ISO 越高画面越亮，但噪点也越多。"
          onInput={(index) => onChange({ ...settings, iso: ISO_STOPS[index] })}
        />
        <ExposureMeter settings={settings} />
        <p className="lesson-copy">{buildLessonCopy(settings, mode)}</p>
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
          aria-label={`${label} 减少一档`}
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
          aria-label={`${label} 增加一档`}
          onClick={() => onInput(Math.min(max, index + step))}
        >
          +
        </Button>
      </span>
      <span className="slider-description">{description}</span>
    </label>
  );
}

function buildLessonCopy(settings: CameraSettings, mode: LearnMode) {
  if (mode === 'exposure') {
    return '学习曝光模式会把光圈、快门和 ISO 一起计入亮度，观察曝光条如何随着三者联动移动。';
  }

  if (settings.aperture <= 2.8) {
    return '当前大光圈让背景明显虚化，静止的曼波会更突出。';
  }

  if (settings.shutterSeconds >= 1 / 30) {
    return '当前快门偏慢，骑车的曼波会出现横向运动模糊。';
  }

  if (settings.iso >= 3200) {
    return '当前 ISO 偏高，画面更亮，同时能看到更明显的噪点。';
  }

  return '拖动三个参数，分别观察背景虚化、人物运动模糊和噪点变化。';
}
