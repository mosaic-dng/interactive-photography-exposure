import { useState } from 'react';
import { Card, Title } from 'animal-island-ui';
import { ControlPanel } from './components/ControlPanel';
import { ExposureCanvas } from './components/ExposureCanvas';
import { ModeSwitch } from './components/ModeSwitch';
import type { CameraSettings, LearnMode } from './types';

const DEFAULT_SETTINGS: CameraSettings = {
  aperture: 8,
  shutterSeconds: 1 / 500,
  iso: 100,
};

export default function App() {
  const [mode, setMode] = useState<LearnMode>('effects');
  const [settings, setSettings] = useState<CameraSettings>(DEFAULT_SETTINGS);

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <Title size="large" color="app-green">摄影大学习</Title>
          <p>拖动光圈、快门、ISO，看懂曝光三要素</p>
        </div>
      </header>

      <section className="mode-row">
        <ModeSwitch mode={mode} onChange={setMode} />
      </section>

      <section className="workspace" aria-label="摄影曝光可视化工具">
        <div className="preview-column">
          <ExposureCanvas mode={mode} settings={settings} />
          <Card className="parameter-card" type="dashed">
            <span>当前参数</span>
            <strong>f/{settings.aperture}</strong>
            <strong>{settings.shutterSeconds >= 1 ? `${settings.shutterSeconds}s` : `1/${Math.round(1 / settings.shutterSeconds)}s`}</strong>
            <strong>ISO {settings.iso}</strong>
          </Card>
        </div>
        <ControlPanel settings={settings} mode={mode} onChange={setSettings} />
      </section>

    </main>
  );
}
