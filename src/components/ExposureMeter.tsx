import { Tag } from 'animal-island-ui';
import { calculateExposureEV, clampEVForMeter, getExposureStatus } from '../lib/exposure';
import type { CameraSettings } from '../types';

interface ExposureMeterProps {
  settings: CameraSettings;
}

const TAG_COLOR_BY_LEVEL = {
  'severe-under': 'app-blue',
  under: 'app-teal',
  normal: 'app-green',
  over: 'app-yellow',
  'severe-over': 'app-red',
} as const;

export function ExposureMeter({ settings }: ExposureMeterProps) {
  const ev = calculateExposureEV(settings.aperture, settings.shutterSeconds, settings.iso);
  const status = getExposureStatus(ev);
  const pointerLeft = ((clampEVForMeter(ev) + 4) / 8) * 100;

  return (
    <section className="meter" aria-label="曝光状态">
      <div className="meter-head">
        <span className="meter-title">曝光指示</span>
        <Tag color={TAG_COLOR_BY_LEVEL[status.level]} variant="solid">
          {status.label}
        </Tag>
      </div>
      <div className="meter-value">EV {ev >= 0 ? '+' : ''}{ev.toFixed(2)}</div>
      <div className="meter-track" role="meter" aria-valuemin={-4} aria-valuemax={4} aria-valuenow={ev}>
        <span className="meter-zone under">欠曝</span>
        <span className="meter-zone normal">正常</span>
        <span className="meter-zone over">过曝</span>
        <span className="meter-pointer" style={{ left: `${pointerLeft}%` }} />
      </div>
      <p className="meter-hint">{status.hint}</p>
    </section>
  );
}
