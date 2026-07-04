import { useState } from 'react';
import { Card, Title } from 'animal-island-ui';
import { ControlPanel } from './components/ControlPanel';
import { ExposureCanvas } from './components/ExposureCanvas';
import { ModeSwitch } from './components/ModeSwitch';
import { LANGUAGES, getTranslation, type LanguageCode } from './lib/i18n';
import type { CameraSettings, LearnMode } from './types';

const DEFAULT_SETTINGS: CameraSettings = {
  aperture: 8,
  shutterSeconds: 1 / 500,
  iso: 100,
};

export default function App() {
  const [mode, setMode] = useState<LearnMode>('effects');
  const [settings, setSettings] = useState<CameraSettings>(DEFAULT_SETTINGS);
  const [language, setLanguage] = useState<LanguageCode>('zh');
  const t = getTranslation(language);

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <Title size="large" color="app-green">{t.appTitle}</Title>
          <p>{t.appSubtitle}</p>
        </div>
        <label className="language-select">
          <span>{t.languageLabel}</span>
          <select
            value={language}
            onChange={(event) => setLanguage(event.currentTarget.value as LanguageCode)}
          >
            {LANGUAGES.map((item) => (
              <option key={item.code} value={item.code}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </header>

      <section className="mode-row">
        <ModeSwitch mode={mode} labels={t.modes} onChange={setMode} />
      </section>

      <section className="workspace" aria-label={t.workspaceLabel}>
        <div className="preview-column">
          <ExposureCanvas mode={mode} settings={settings} />
          <Card className="parameter-card" type="dashed">
            <span>{t.currentParameters}</span>
            <strong>f/{settings.aperture}</strong>
            <strong>{settings.shutterSeconds >= 1 ? `${settings.shutterSeconds}s` : `1/${Math.round(1 / settings.shutterSeconds)}s`}</strong>
            <strong>ISO {settings.iso}</strong>
          </Card>
        </div>
        <ControlPanel settings={settings} mode={mode} translation={t} onChange={setSettings} />
      </section>

    </main>
  );
}
