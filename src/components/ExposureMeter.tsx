import { Tag } from 'animal-island-ui';
import { calculateExposureEV, clampEVForMeter, getExposureStatus } from '../lib/exposure';
import type { getTranslation } from '../lib/i18n';
import type { CameraSettings } from '../types';

type Translation = ReturnType<typeof getTranslation>;

interface ExposureMeterProps {
  settings: CameraSettings;
  translation: Translation;
}

const TAG_COLOR_BY_LEVEL = {
  'severe-under': 'app-blue',
  under: 'app-teal',
  normal: 'app-green',
  over: 'app-yellow',
  'severe-over': 'app-red',
} as const;

export function ExposureMeter({ settings, translation }: ExposureMeterProps) {
  const ev = calculateExposureEV(settings.aperture, settings.shutterSeconds, settings.iso);
  const status = getExposureStatus(ev);
  const statusCopy = translation.exposureStatus[status.level];
  const pointerLeft = ((clampEVForMeter(ev) + 4) / 8) * 100;

  return (
    <section className="meter" aria-label={translation.meter.ariaLabel}>
      <div className="meter-head">
        <span className="meter-title">{translation.meter.title}</span>
        <Tag color={TAG_COLOR_BY_LEVEL[status.level]} variant="solid">
          {statusCopy.label}
        </Tag>
      </div>
      <div className="meter-value">
        EV {ev >= 0 ? '+' : ''}
        {ev.toFixed(2)}
      </div>
      <div
        className="meter-track"
        role="meter"
        aria-valuemin={-4}
        aria-valuemax={4}
        aria-valuenow={ev}
      >
        <span className="meter-zone under">{translation.meter.under}</span>
        <span className="meter-zone normal">{translation.meter.normal}</span>
        <span className="meter-zone over">{translation.meter.over}</span>
        <span className="meter-pointer" style={{ left: `${pointerLeft}%` }} />
      </div>
      <p className="meter-hint">{statusCopy.hint}</p>
    </section>
  );
}
