import { useEffect, useRef, useState } from 'react';
import type { CameraSettings, LearnMode, SceneAssets } from '../types';
import { CANVAS_HEIGHT, CANVAS_WIDTH, renderExposureScene } from '../lib/canvasRenderer';
import { loadSceneAssets } from '../lib/assetLoader';

interface ExposureCanvasProps {
  canvasLabel: string;
  mode: LearnMode;
  settings: CameraSettings;
}

export function ExposureCanvas({ canvasLabel, mode, settings }: ExposureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [assets, setAssets] = useState<SceneAssets | null>(null);

  useEffect(() => {
    let isMounted = true;

    loadSceneAssets().then((loadedAssets) => {
      if (isMounted) {
        setAssets(loadedAssets);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context || !shouldRenderExposureScene(assets)) return;

    renderExposureScene(context, { assets, mode, settings });
  }, [assets, mode, settings]);

  return (
    <div className="canvas-wrap" aria-label={canvasLabel}>
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
    </div>
  );
}

export function shouldRenderExposureScene(assets: SceneAssets | null): assets is SceneAssets {
  return assets !== null;
}
