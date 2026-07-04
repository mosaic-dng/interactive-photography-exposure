import { useEffect, useRef, useState } from 'react';
import type { CameraSettings, LearnMode, SceneAssets } from '../types';
import { CANVAS_HEIGHT, CANVAS_WIDTH, renderExposureScene } from '../lib/canvasRenderer';
import { loadSceneAssets } from '../lib/assetLoader';

interface ExposureCanvasProps {
  mode: LearnMode;
  settings: CameraSettings;
}

export function ExposureCanvas({ mode, settings }: ExposureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [assets, setAssets] = useState<SceneAssets>({});

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
    if (!canvas || !context) return;

    renderExposureScene(context, { assets, mode, settings });
  }, [assets, mode, settings]);

  return (
    <div className="canvas-wrap" aria-label="曝光三要素 Canvas 预览">
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
    </div>
  );
}
