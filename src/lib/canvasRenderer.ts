import type { CameraSettings, LearnMode, SceneAssets } from '../types';
import {
  calculateExposureEV,
  getApertureBlur,
  getIsoNoiseSettings,
  getShutterMotionBlurSettings,
} from './exposure';

export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 720;

export type ApertureBlurStrategy = 'none' | 'native' | 'portable';

export function getApertureBlurStrategy(
  canvasFilter: string | undefined,
  blur: number,
): ApertureBlurStrategy {
  if (blur <= 0) return 'none';
  return typeof canvasFilter === 'string' ? 'native' : 'portable';
}

export function getPortableBlurScale(blur: number) {
  if (blur <= 0) return 1;
  return Math.max(0.12, 1 / (1 + blur * 0.44));
}

export const SCENE_SUBJECT_LAYOUT = {
  standing: {
    box: {
      x: 264,
      y: 263,
      width: 268,
      height: 395,
    },
    visibleBottomBaseline: 0.945,
    shadowBaseline: 0.98,
  },
  cycling: {
    box: {
      x: 560,
      y: 286,
      width: 560,
      height: 544,
    },
    visibleBottomBaseline: 0.644,
    shadowBaseline: 0.673,
  },
} as const;

interface RenderOptions {
  assets: SceneAssets;
  mode: LearnMode;
  settings: CameraSettings;
}

export function renderExposureScene(ctx: CanvasRenderingContext2D, options: RenderOptions) {
  const { assets, mode, settings } = options;
  const backgroundBlur = getApertureBlur(settings.aperture) * 0.86;

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  drawUnifiedBackground(ctx, backgroundBlur, assets.background);
  drawStaticManbo(ctx, assets.boyStatic);
  drawCyclingManboWithMotionBlur(ctx, assets.girlBike, settings.shutterSeconds);
  drawNoise(ctx, settings.iso);
  drawExposureOverlay(ctx, settings, mode);
}

function drawUnifiedBackground(
  ctx: CanvasRenderingContext2D,
  blur: number,
  backgroundImage?: HTMLImageElement,
) {
  const background = document.createElement('canvas');
  background.width = CANVAS_WIDTH;
  background.height = CANVAS_HEIGHT;
  const bg = background.getContext('2d');
  if (!bg) return;

  if (backgroundImage) {
    drawCoverImage(bg, backgroundImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  } else {
    drawSky(bg);
    drawSun(bg, 150, 130, 58);
    drawCloud(bg, 348, 150, 0.98);
    drawCloud(bg, 700, 154, 0.95);
    drawCloud(bg, 1106, 165, 1.14);
    drawMountains(bg);
    drawHorizonAndGround(bg);
    drawDistantTreesAndBushes(bg);
    drawFlowersAndGrass(bg);
  }

  drawApertureBackground(ctx, background, blur);
}

function drawApertureBackground(
  ctx: CanvasRenderingContext2D,
  background: HTMLCanvasElement,
  blur: number,
) {
  const strategy = getApertureBlurStrategy(ctx.filter, blur);

  if (strategy === 'none') {
    ctx.drawImage(background, 0, 0);
    return;
  }

  if (strategy === 'native') {
    ctx.save();
    ctx.filter = `blur(${blur}px)`;
    ctx.drawImage(background, 0, 0);
    ctx.restore();
    return;
  }

  ctx.save();
  const scale = getPortableBlurScale(blur);
  const downscaled = document.createElement('canvas');
  downscaled.width = Math.max(1, Math.round(CANVAS_WIDTH * scale));
  downscaled.height = Math.max(1, Math.round(CANVAS_HEIGHT * scale));
  const downscaledContext = downscaled.getContext('2d');

  if (!downscaledContext) {
    ctx.drawImage(background, 0, 0);
    ctx.restore();
    return;
  }

  downscaledContext.imageSmoothingEnabled = true;
  downscaledContext.imageSmoothingQuality = 'high';
  downscaledContext.drawImage(background, 0, 0, downscaled.width, downscaled.height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(downscaled, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.restore();
}

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  const sourceRatio = sourceWidth / sourceHeight;
  const targetRatio = width / height;

  let cropWidth = sourceWidth;
  let cropHeight = sourceHeight;
  let cropX = 0;
  let cropY = 0;

  if (sourceRatio > targetRatio) {
    cropWidth = sourceHeight * targetRatio;
    cropX = (sourceWidth - cropWidth) / 2;
  } else {
    cropHeight = sourceWidth / targetRatio;
    cropY = (sourceHeight - cropHeight) / 2;
  }

  ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, x, y, width, height);
}

function drawContainedImage(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  const scale = Math.min(width / sourceWidth, height / sourceHeight);
  const drawWidth = sourceWidth * scale;
  const drawHeight = sourceHeight * scale;
  const drawX = x + (width - drawWidth) / 2;
  const drawY = y + (height - drawHeight) / 2;

  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
}

function drawCroppedContainedImage(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  source: { x: number; y: number; width: number; height: number },
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const scale = Math.min(width / source.width, height / source.height);
  const drawWidth = source.width * scale;
  const drawHeight = source.height * scale;
  const drawX = x + (width - drawWidth) / 2;
  const drawY = y + (height - drawHeight) / 2;

  ctx.drawImage(
    image,
    source.x,
    source.y,
    source.width,
    source.height,
    drawX,
    drawY,
    drawWidth,
    drawHeight,
  );
}

function drawSky(ctx: CanvasRenderingContext2D) {
  const sky = ctx.createLinearGradient(0, 0, 0, 500);
  sky.addColorStop(0, '#79d1f4');
  sky.addColorStop(0.58, '#b8eaff');
  sky.addColorStop(1, '#d9f6ff');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, CANVAS_WIDTH, 510);
}

function drawSun(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) {
  ctx.save();
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#ffc41f';
  ctx.lineWidth = 8;

  for (let i = 0; i < 12; i += 1) {
    const angle = (Math.PI * 2 * i) / 12;
    const start = radius + 18;
    const end = radius + 48;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(angle) * start, y + Math.sin(angle) * start);
    ctx.lineTo(x + Math.cos(angle) * end, y + Math.sin(angle) * end);
    ctx.stroke();
  }

  const sun = ctx.createRadialGradient(x - 18, y - 20, 4, x, y, radius);
  sun.addColorStop(0, '#ffe66a');
  sun.addColorStop(1, '#ffcb22');
  ctx.fillStyle = sun;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#75401e';
  ctx.beginPath();
  ctx.arc(x - 22, y - 8, 5, 0, Math.PI * 2);
  ctx.arc(x + 22, y - 8, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 137, 141, 0.5)';
  ctx.beginPath();
  ctx.ellipse(x - 37, y + 8, 11, 7, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 37, y + 8, 11, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#75401e';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x, y + 2, 17, 0.2, Math.PI - 0.2);
  ctx.stroke();
  ctx.restore();
}

function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) {
  ctx.save();
  ctx.shadowColor = 'rgba(92, 152, 181, 0.12)';
  ctx.shadowBlur = 12 * scale;
  ctx.shadowOffsetY = 5 * scale;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(x - 48 * scale, y + 16 * scale, 34 * scale, 25 * scale, 0, 0, Math.PI * 2);
  ctx.ellipse(x - 8 * scale, y, 45 * scale, 40 * scale, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 38 * scale, y + 15 * scale, 36 * scale, 28 * scale, 0, 0, Math.PI * 2);
  ctx.ellipse(x, y + 28 * scale, 82 * scale, 24 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawMountains(ctx: CanvasRenderingContext2D) {
  drawSoftHill(ctx, -95, 500, 420, 190, '#b9df8b', '#9fd17a');
  drawSoftHill(ctx, 238, 500, 560, 250, '#a8d86e', '#8fcf72');
  drawSoftHill(ctx, 605, 502, 470, 245, '#93d1af', '#7cc59e');
  drawSoftHill(ctx, 962, 501, 395, 200, '#b0db67', '#98cf66');
}

function drawSoftHill(
  ctx: CanvasRenderingContext2D,
  x: number,
  baseY: number,
  width: number,
  height: number,
  topColor: string,
  bottomColor: string,
) {
  const gradient = ctx.createLinearGradient(x, baseY - height, x, baseY);
  gradient.addColorStop(0, topColor);
  gradient.addColorStop(1, bottomColor);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(x, baseY);
  ctx.bezierCurveTo(
    x + width * 0.22,
    baseY - height * 0.94,
    x + width * 0.46,
    baseY - height * 1.08,
    x + width * 0.66,
    baseY - height * 0.8,
  );
  ctx.bezierCurveTo(x + width * 0.82, baseY - height * 0.55, x + width, baseY - 5, x + width, baseY);
  ctx.closePath();
  ctx.fill();
}

function drawHorizonAndGround(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#b7eafb';
  ctx.fillRect(0, 486, CANVAS_WIDTH, 14);

  const ground = ctx.createLinearGradient(0, 500, 0, CANVAS_HEIGHT);
  ground.addColorStop(0, '#fff4d6');
  ground.addColorStop(1, '#fff9eb');
  ctx.fillStyle = ground;
  ctx.fillRect(0, 500, CANVAS_WIDTH, CANVAS_HEIGHT - 500);
}

function drawDistantTreesAndBushes(ctx: CanvasRenderingContext2D) {
  drawTree(ctx, 58, 414, 0.86);
  drawTree(ctx, 690, 425, 0.72);
  drawTree(ctx, 1180, 430, 0.64);
  drawTree(ctx, 1230, 425, 0.76);

  drawBush(ctx, 112, 487, 1.15);
  drawBush(ctx, 525, 487, 0.78);
  drawBush(ctx, 963, 488, 1);
  drawBush(ctx, 1073, 489, 0.74);
}

function drawTree(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) {
  ctx.fillStyle = '#b88554';
  ctx.fillRect(x - 4 * scale, y + 48 * scale, 8 * scale, 35 * scale);
  const foliage = ctx.createLinearGradient(x, y, x, y + 76 * scale);
  foliage.addColorStop(0, '#69bf78');
  foliage.addColorStop(1, '#4aa36d');
  ctx.fillStyle = foliage;
  ctx.beginPath();
  ctx.ellipse(x, y + 32 * scale, 21 * scale, 47 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#bf8a5a';
  ctx.lineWidth = 3 * scale;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x, y + 64 * scale);
  ctx.lineTo(x - 8 * scale, y + 54 * scale);
  ctx.moveTo(x, y + 64 * scale);
  ctx.lineTo(x + 9 * scale, y + 52 * scale);
  ctx.stroke();
}

function drawBush(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) {
  const colors = ['#8bc96c', '#78bd62', '#9bd177'];
  for (let i = 0; i < 6; i += 1) {
    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.ellipse(x + i * 28 * scale, y + (i % 2) * 3 * scale, 28 * scale, 23 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawFlowersAndGrass(ctx: CanvasRenderingContext2D) {
  drawGrass(ctx, 78, 578, 0.8);
  drawGrass(ctx, 284, 657, 0.86);
  drawGrass(ctx, 1032, 678, 0.78);
  drawGrass(ctx, 1168, 575, 0.7);
  drawFlowerCluster(ctx, 112, 653, 1.05, '#ffd53c', '#f275aa');
  drawFlowerCluster(ctx, 1162, 664, 0.95, '#ffffff', '#ffd33f');
}

function drawGrass(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) {
  ctx.strokeStyle = '#91c84b';
  ctx.lineWidth = 7 * scale;
  ctx.lineCap = 'round';
  for (let i = -2; i <= 2; i += 1) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + i * 6 * scale, y - 10 * scale, x + i * 10 * scale, y - 23 * scale);
    ctx.stroke();
  }
}

function drawFlowerCluster(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  primary: string,
  secondary: string,
) {
  drawGrass(ctx, x - 24 * scale, y + 22 * scale, scale * 1.4);
  drawGrass(ctx, x + 18 * scale, y + 18 * scale, scale * 1.1);
  drawFlower(ctx, x, y, 13 * scale, primary);
  drawFlower(ctx, x + 40 * scale, y + 14 * scale, 9 * scale, secondary);
  ctx.fillStyle = 'rgba(219, 185, 105, 0.23)';
  ctx.beginPath();
  ctx.ellipse(x, y + 40 * scale, 58 * scale, 8 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawFlower(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string) {
  ctx.fillStyle = color;
  for (let i = 0; i < 6; i += 1) {
    const angle = (Math.PI * 2 * i) / 6;
    ctx.beginPath();
    ctx.ellipse(
      x + Math.cos(angle) * radius * 0.82,
      y + Math.sin(angle) * radius * 0.82,
      radius * 0.52,
      radius * 0.62,
      angle,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
  ctx.fillStyle = '#ffd950';
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.38, 0, Math.PI * 2);
  ctx.fill();
}

function drawStaticManbo(ctx: CanvasRenderingContext2D, image?: HTMLImageElement) {
  if (!image) {
    drawStandingBoy(ctx, 386, 326, 226, 322);
    return;
  }

  const { box, shadowBaseline } = SCENE_SUBJECT_LAYOUT.standing;

  drawSoftShadow(
    ctx,
    box.x + box.width * 0.5,
    box.y + box.height * shadowBaseline,
    box.width * 0.28,
    12,
  );
  drawContainedImage(ctx, image, box.x, box.y, box.width, box.height);
}

function drawCyclingManboWithMotionBlur(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement | undefined,
  shutterSeconds: number,
) {
  const { box, shadowBaseline } = SCENE_SUBJECT_LAYOUT.cycling;
  const source = image
    ? {
        x: 0,
        y: 128,
        width: image.naturalWidth || image.width,
        height: Math.min(1180, (image.naturalHeight || image.height) - 128),
      }
    : null;

  const drawSubject = (target: CanvasRenderingContext2D, x: number, y: number) => {
    if (!image) {
      drawCyclingGirl(target, x + 90, y + 202, 350, 256);
      return;
    }

    drawSoftShadow(
      target,
      x + box.width * 0.54,
      y + box.height * shadowBaseline,
      box.width * 0.3,
      13,
    );
    drawCroppedContainedImage(target, image, source!, x, y, box.width, box.height);
  };

  const blur = getShutterMotionBlurSettings(shutterSeconds);

  if (blur.blurDistance === 0) {
    drawSubject(ctx, box.x, box.y);
    return;
  }

  const padding = 96;
  const distance = blur.blurDistance;
  const localX = padding + distance / 2;
  const localY = padding;
  const layer = document.createElement('canvas');
  layer.width = Math.ceil(box.width + distance + padding * 2);
  layer.height = Math.ceil(box.height + padding * 2);
  const layerCtx = layer.getContext('2d');
  if (!layerCtx) return;

  drawSubject(layerCtx, localX, localY);

  ctx.save();
  ctx.filter = `blur(${Math.min(5.8, blur.dynamicBlur * 1.2)}px)`;
  for (let i = blur.trailCount; i >= 1; i -= 1) {
    const progress = i / Math.max(1, blur.trailCount);
    const offsetX = -distance * (0.3 + progress * 0.82);
    const offsetY = progress * 4;
    ctx.globalAlpha = blur.trailAlpha * (1 - progress * 0.52);
    ctx.drawImage(layer, box.x - localX + offsetX, box.y - localY + offsetY);
  }
  ctx.restore();

  const samples = Math.min(120, Math.max(44, blur.sampleCount * 4));
  const start = -distance * 0.9;
  const end = distance * 0.18;
  const step = (end - start) / Math.max(1, samples - 1);

  ctx.save();
  ctx.filter = `blur(${Math.min(4.8, blur.dynamicBlur)}px)`;
  for (let i = 0; i < samples; i += 1) {
    const t = samples === 1 ? 1 : i / (samples - 1);
    const weightedAlpha = blur.alpha * (0.45 + t * 0.75);
    ctx.globalAlpha = weightedAlpha / samples;
    ctx.drawImage(layer, box.x - localX + start + i * step, box.y - localY);
  }
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = Math.max(0.2, 0.62 - distance / 260);
  ctx.filter = `blur(${Math.min(2.8, blur.dynamicBlur * 0.72)}px)`;
  ctx.drawImage(layer, box.x - localX, box.y - localY);
  ctx.restore();
}

function drawStandingBoy(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  ctx.save();
  const cx = x + width / 2;
  drawSoftShadow(ctx, cx, y + height * 0.95, width * 0.34, 11);

  drawBoyLeg(ctx, x + width * 0.4, y + height * 0.68, height * 0.22);
  drawBoyLeg(ctx, x + width * 0.57, y + height * 0.68, height * 0.22);
  drawBoyShoe(ctx, x + width * 0.33, y + height * 0.9, '#1e88dc');
  drawBoyShoe(ctx, x + width * 0.54, y + height * 0.9, '#1e88dc');
  drawShorts(ctx, x + width * 0.36, y + height * 0.58, width * 0.3, height * 0.18);
  drawBoyShirt(ctx, x + width * 0.28, y + height * 0.4, width * 0.48, height * 0.28);
  drawArm(ctx, x + width * 0.3, y + height * 0.48, x + width * 0.14, y + height * 0.63, 14);
  drawArm(ctx, x + width * 0.74, y + height * 0.48, x + width * 0.91, y + height * 0.63, 14);
  drawBoyHead(ctx, cx, y + height * 0.27, width * 0.29);
  ctx.restore();
}

function drawBoyHead(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) {
  ctx.fillStyle = '#f8c795';
  ctx.beginPath();
  ctx.arc(cx - radius * 0.9, cy + radius * 0.1, radius * 0.18, 0, Math.PI * 2);
  ctx.arc(cx + radius * 0.9, cy + radius * 0.1, radius * 0.18, 0, Math.PI * 2);
  ctx.fill();

  const face = ctx.createRadialGradient(cx - radius * 0.2, cy - radius * 0.35, radius * 0.1, cx, cy, radius);
  face.addColorStop(0, '#ffe0bc');
  face.addColorStop(1, '#fac28d');
  ctx.fillStyle = face;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  drawBoyHair(ctx, cx, cy - radius * 0.55, radius);
  drawFace(ctx, cx, cy + radius * 0.03, radius, 1);
}

function drawBoyHair(ctx: CanvasRenderingContext2D, cx: number, y: number, radius: number) {
  ctx.fillStyle = '#5a2e19';
  ctx.beginPath();
  ctx.moveTo(cx - radius * 0.92, y + radius * 0.55);
  ctx.bezierCurveTo(
    cx - radius * 0.83,
    y - radius * 0.1,
    cx - radius * 0.22,
    y - radius * 0.32,
    cx + radius * 0.32,
    y - radius * 0.2,
  );
  ctx.bezierCurveTo(
    cx + radius * 0.9,
    y - radius * 0.04,
    cx + radius * 0.95,
    y + radius * 0.38,
    cx + radius * 0.72,
    y + radius * 0.7,
  );
  ctx.quadraticCurveTo(cx + radius * 0.18, y + radius * 0.48, cx - radius * 0.92, y + radius * 0.55);
  ctx.closePath();
  ctx.fill();

  const bangY = y + radius * 0.36;
  for (let i = -3; i <= 2; i += 1) {
    ctx.beginPath();
    ctx.ellipse(
      cx + i * radius * 0.17,
      bangY + Math.abs(i + 0.5) * radius * 0.012,
      radius * 0.13,
      radius * 0.18,
      i < 0 ? -0.55 : 0.45,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
  ctx.beginPath();
  ctx.ellipse(cx + radius * 0.58, y + radius * 0.55, radius * 0.16, radius * 0.2, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx - radius * 0.64, y - radius * 0.02, radius * 0.12, 0, Math.PI * 2);
  ctx.arc(cx - radius * 0.9, y + radius * 0.08, radius * 0.09, 0, Math.PI * 2);
  ctx.fill();
}

function drawFace(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, smileScale: number) {
  ctx.fillStyle = '#3f2418';
  ctx.beginPath();
  ctx.arc(cx - radius * 0.34, cy + radius * 0.02, radius * 0.083, 0, Math.PI * 2);
  ctx.arc(cx + radius * 0.34, cy + radius * 0.02, radius * 0.083, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 126, 112, 0.42)';
  ctx.beginPath();
  ctx.ellipse(cx - radius * 0.55, cy + radius * 0.22, radius * 0.16, radius * 0.12, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + radius * 0.55, cy + radius * 0.22, radius * 0.16, radius * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(195, 108, 78, 0.35)';
  ctx.lineWidth = Math.max(2, radius * 0.034);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx, cy + radius * 0.08);
  ctx.lineTo(cx - radius * 0.04, cy + radius * 0.14);
  ctx.stroke();

  ctx.strokeStyle = '#b55a3b';
  ctx.lineWidth = Math.max(3, radius * 0.055);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(cx, cy + radius * 0.16, radius * 0.22 * smileScale, 0.18, Math.PI - 0.18);
  ctx.stroke();
}

function drawBoyShirt(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
  const shirt = ctx.createLinearGradient(x, y, x, y + height);
  shirt.addColorStop(0, '#ffd845');
  shirt.addColorStop(1, '#ffb91f');
  ctx.fillStyle = shirt;
  ctx.beginPath();
  ctx.moveTo(x + width * 0.2, y + height * 0.1);
  ctx.quadraticCurveTo(x + width * 0.5, y - height * 0.16, x + width * 0.8, y + height * 0.1);
  ctx.lineTo(x + width, y + height * 0.42);
  ctx.lineTo(x + width * 0.75, y + height);
  ctx.lineTo(x + width * 0.25, y + height);
  ctx.lineTo(x, y + height * 0.42);
  ctx.closePath();
  ctx.fill();
}

function drawShorts(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
  ctx.fillStyle = '#2175bf';
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, 6);
  ctx.fill();
  ctx.fillRect(x + width * 0.45, y + height * 0.5, width * 0.1, height * 0.55);
}

function drawBoyLeg(ctx: CanvasRenderingContext2D, x: number, y: number, height: number) {
  ctx.fillStyle = '#ffd0a6';
  ctx.beginPath();
  ctx.roundRect(x, y, 18, height, 9);
  ctx.fill();
}

function drawBoyShoe(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y, 34, 16, 9);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x + 8, y + 3);
  ctx.lineTo(x + 17, y + 9);
  ctx.stroke();
}

function drawArm(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  width: number,
) {
  ctx.strokeStyle = '#ffd0a6';
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawCyclingGirl(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  ctx.save();
  drawSoftShadow(ctx, x + width * 0.5, y + height * 0.86, width * 0.42, 10);
  drawBicycle(ctx, x + width * 0.06, y + height * 0.43, width * 0.88, height * 0.47);
  drawGirlBody(ctx, x + width * 0.36, y + height * 0.32, width * 0.28, height * 0.3);
  drawGirlLegs(ctx, x, y, width, height);
  drawGirlArms(ctx, x, y, width, height);
  drawGirlHead(ctx, x + width * 0.48, y + height * 0.24, width * 0.13);
  ctx.restore();
}

function drawBicycle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const rear = { x: x + width * 0.17, y: y + height * 0.75 };
  const front = { x: x + width * 0.82, y: y + height * 0.75 };
  const pedal = { x: x + width * 0.48, y: y + height * 0.58 };
  const wheelRadius = height * 0.28;

  ctx.strokeStyle = '#1f4d7a';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(rear.x, rear.y, wheelRadius, 0, Math.PI * 2);
  ctx.arc(front.x, front.y, wheelRadius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#ff7169';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(rear.x, rear.y);
  ctx.lineTo(pedal.x, pedal.y);
  ctx.lineTo(front.x, front.y);
  ctx.moveTo(pedal.x, pedal.y);
  ctx.lineTo(x + width * 0.38, y + height * 0.3);
  ctx.lineTo(x + width * 0.64, y + height * 0.32);
  ctx.lineTo(front.x, front.y);
  ctx.moveTo(rear.x, rear.y);
  ctx.lineTo(x + width * 0.38, y + height * 0.3);
  ctx.stroke();

  ctx.strokeStyle = '#1f4d7a';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(x + width * 0.64, y + height * 0.32);
  ctx.lineTo(x + width * 0.73, y + height * 0.18);
  ctx.lineTo(x + width * 0.86, y + height * 0.22);
  ctx.moveTo(x + width * 0.38, y + height * 0.3);
  ctx.lineTo(x + width * 0.28, y + height * 0.22);
  ctx.stroke();

  ctx.fillStyle = '#244c78';
  ctx.beginPath();
  ctx.roundRect(x + width * 0.24, y + height * 0.18, width * 0.2, height * 0.08, 8);
  ctx.fill();
}

function drawGirlBody(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
  const shirt = ctx.createLinearGradient(x, y, x, y + height);
  shirt.addColorStop(0, '#ff7fba');
  shirt.addColorStop(1, '#f25d9c');
  ctx.fillStyle = shirt;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height * 0.82, 18);
  ctx.fill();

  ctx.fillStyle = '#1f72bd';
  ctx.beginPath();
  ctx.roundRect(x + width * 0.26, y + height * 0.66, width * 0.6, height * 0.28, 8);
  ctx.fill();
}

function drawGirlLegs(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
  ctx.strokeStyle = '#ffd0a6';
  ctx.lineWidth = 12;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x + width * 0.5, y + height * 0.57);
  ctx.lineTo(x + width * 0.41, y + height * 0.76);
  ctx.moveTo(x + width * 0.58, y + height * 0.56);
  ctx.lineTo(x + width * 0.68, y + height * 0.72);
  ctx.stroke();

  ctx.fillStyle = '#f2598e';
  ctx.beginPath();
  ctx.roundRect(x + width * 0.37, y + height * 0.72, 30, 14, 8);
  ctx.roundRect(x + width * 0.66, y + height * 0.7, 32, 14, 8);
  ctx.fill();
}

function drawGirlArms(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
  ctx.strokeStyle = '#ffd0a6';
  ctx.lineWidth = 11;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x + width * 0.39, y + height * 0.39);
  ctx.lineTo(x + width * 0.28, y + height * 0.51);
  ctx.moveTo(x + width * 0.56, y + height * 0.39);
  ctx.lineTo(x + width * 0.68, y + height * 0.47);
  ctx.stroke();
}

function drawGirlHead(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) {
  ctx.fillStyle = '#9b5a2a';
  ctx.beginPath();
  ctx.ellipse(cx - radius * 1.08, cy + radius * 0.31, radius * 0.5, radius * 0.62, -0.28, 0, Math.PI * 2);
  ctx.ellipse(cx + radius * 1.1, cy + radius * 0.33, radius * 0.5, radius * 0.62, 0.28, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffd0a6';
  ctx.beginPath();
  ctx.arc(cx - radius * 0.9, cy + radius * 0.12, radius * 0.17, 0, Math.PI * 2);
  ctx.arc(cx + radius * 0.9, cy + radius * 0.12, radius * 0.17, 0, Math.PI * 2);
  ctx.fill();

  const face = ctx.createRadialGradient(cx - radius * 0.18, cy - radius * 0.25, radius * 0.1, cx, cy, radius);
  face.addColorStop(0, '#ffe0bc');
  face.addColorStop(1, '#fac28d');
  ctx.fillStyle = face;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#9b5a2a';
  ctx.beginPath();
  ctx.moveTo(cx - radius * 0.86, cy - radius * 0.04);
  ctx.bezierCurveTo(
    cx - radius * 0.7,
    cy - radius * 0.78,
    cx - radius * 0.14,
    cy - radius * 0.94,
    cx + radius * 0.5,
    cy - radius * 0.7,
  );
  ctx.bezierCurveTo(
    cx + radius * 0.95,
    cy - radius * 0.5,
    cx + radius * 0.96,
    cy - radius * 0.02,
    cx + radius * 0.76,
    cy + radius * 0.18,
  );
  ctx.quadraticCurveTo(cx + radius * 0.15, cy - radius * 0.03, cx - radius * 0.86, cy - radius * 0.04);
  ctx.closePath();
  ctx.fill();
  for (let i = -2; i <= 1; i += 1) {
    ctx.beginPath();
    ctx.ellipse(
      cx + i * radius * 0.23,
      cy - radius * 0.31 + Math.abs(i) * radius * 0.03,
      radius * 0.16,
      radius * 0.19,
      -0.25,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }

  ctx.strokeStyle = '#ff6fa2';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx + radius * 0.33, cy - radius * 0.55);
  ctx.lineTo(cx + radius * 0.48, cy - radius * 0.68);
  ctx.stroke();
  drawFace(ctx, cx, cy, radius, 0.85);
}

function drawSoftShadow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radiusX: number,
  radiusY: number,
) {
  ctx.fillStyle = 'rgba(208, 169, 88, 0.22)';
  ctx.beginPath();
  ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawNoise(ctx: CanvasRenderingContext2D, iso: number) {
  const { alpha, density } = getIsoNoiseSettings(iso);
  const step = Math.max(2, Math.round(12 - density * 44));
  const noiseAlpha = Math.min(alpha, 0.26);

  ctx.save();
  ctx.globalCompositeOperation = 'overlay';
  for (let y = 0; y < CANVAS_HEIGHT; y += step) {
    for (let x = 0; x < CANVAS_WIDTH; x += step) {
      if (Math.random() > density) continue;
      const shade = Math.floor(80 + Math.random() * 150);
      ctx.fillStyle = `rgba(${shade}, ${shade}, ${shade}, ${noiseAlpha})`;
      ctx.fillRect(x, y, step, step);
    }
  }
  ctx.restore();
}

function drawExposureOverlay(
  ctx: CanvasRenderingContext2D,
  settings: CameraSettings,
  mode: LearnMode,
) {
  const ev = calculateExposureEV(settings.aperture, settings.shutterSeconds, settings.iso);
  const effectiveEV = mode === 'exposure' ? ev : Math.log2(settings.iso / 100) * 0.2;

  if (effectiveEV > 0.15) {
    ctx.fillStyle = `rgba(255, 246, 210, ${Math.min(0.52, effectiveEV / 7)})`;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  } else if (effectiveEV < -0.15) {
    ctx.fillStyle = `rgba(19, 35, 49, ${Math.min(0.56, Math.abs(effectiveEV) / 7)})`;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}
