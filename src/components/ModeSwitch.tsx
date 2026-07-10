import { Button } from 'animal-island-ui';
import type { LearnMode } from '../types';

interface ModeSwitchProps {
  mode: LearnMode;
  labels: {
    ariaLabel: string;
    effects: string;
    exposure: string;
  };
  onChange: (mode: LearnMode) => void;
}

export function ModeSwitch({ mode, labels, onChange }: ModeSwitchProps) {
  return (
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
  );
}
