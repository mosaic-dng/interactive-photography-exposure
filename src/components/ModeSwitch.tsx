import { Button } from 'animal-island-ui';
import type { LearnMode } from '../types';

interface ModeSwitchProps {
  mode: LearnMode;
  onChange: (mode: LearnMode) => void;
}

export function ModeSwitch({ mode, onChange }: ModeSwitchProps) {
  return (
    <div className="mode-switch" aria-label="学习模式切换">
      <Button
        type={mode === 'effects' ? 'primary' : 'default'}
        size="middle"
        onClick={() => onChange('effects')}
      >
        学习效果
      </Button>
      <Button
        type={mode === 'exposure' ? 'primary' : 'default'}
        size="middle"
        onClick={() => onChange('exposure')}
      >
        学习曝光
      </Button>
    </div>
  );
}
