# 摄影大学习

用 Vite + React + TypeScript + animal-island-ui 做的曝光三要素可视化工具。拖动光圈、快门速度、ISO，可以在 Canvas 中看到背景虚化、曼波骑车运动模糊、亮度和噪点变化。

## 运行

```bash
npm install
npm run dev
```

浏览器打开终端给出的本地地址，通常是 `http://localhost:5173/`。

## 自测

```bash
npm test
npm run build
```

`npm test` 覆盖 `src/lib/exposure.ts` 的 EV 计算、曝光状态、光圈虚化、快门运动模糊、ISO 噪点映射和主画面素材路径。

## 素材替换

当前版本的主画面优先加载 `public/assets/` 中的正式素材：背景、静止曼波、骑车曼波。参考图仍保留在下面路径，方便回溯早期需求：

- `assets/cat_reference.jpg`
- `public/assets/cat_reference.jpg`

运行素材文件：

- `background.png`
- `manbo.png`
- `manbo_bike_2.png`

素材缺失不会阻塞运行；页面会继续使用 Canvas 绘制的备用场景和人物。

## 主要文件

- `src/App.tsx`：页面布局、模式切换和全局状态。
- `src/components/ExposureCanvas.tsx`：加载素材并驱动 Canvas。
- `src/components/ControlPanel.tsx`：三参数滑块、动态说明。
- `src/components/ExposureMeter.tsx`：EV、曝光状态和曝光条。
- `src/lib/canvasRenderer.ts`：素材绘制、统一背景虚化、运动模糊、噪点、亮度叠加。
- `src/lib/exposure.ts`：曝光计算和视觉效果映射。
- `src/lib/assetLoader.ts`：素材路径与缺失容错。
