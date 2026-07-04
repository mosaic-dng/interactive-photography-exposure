# 摄影大学习

一个面向摄影初学者的曝光三要素可视化互动工具。拖动光圈、快门和 ISO，画面会同步展示背景虚化、主体运动模糊、亮度变化和噪点变化，让抽象参数变成一眼能看懂的画面反馈。

## 项目亮点

- 光圈模拟：大光圈会让背景虚化更明显，小光圈会让画面更清晰。
- 快门模拟：慢快门会让骑车的曼波出现拖影和动感模糊。
- ISO 模拟：高 ISO 会提高画面亮度，同时增加噪点。
- 曝光指示：通过 EV 数值和曝光条展示欠曝、正常曝光、过曝状态。
- 双学习模式：支持观察视觉效果，也支持观察三参数共同影响曝光。
- 素材化场景：背景、静止曼波、骑车曼波都从 `public/assets/` 加载，方便后续替换。

## 技术栈

- Vite
- React
- TypeScript
- animal-island-ui
- Canvas 2D
- Vitest

## 快速开始

```bash
npm install
npm run dev
```

启动后打开终端提示的本地地址，通常是：

```text
http://localhost:5173/
```

## 常用命令

```bash
npm run dev       # 本地开发
npm test          # 运行测试
npm run build     # 生产构建
npm run preview   # 预览生产构建
```

## 素材说明

当前运行素材位于 `public/assets/`：

- `background.png`：主场景背景
- `manbo.png`：静止主体
- `manbo_bike_2.png`：骑车主体

原始生成素材仍保留在项目根目录，方便继续迭代或重新导出。运行时如果主素材缺失，Canvas 会使用备用绘制方案，避免页面直接空白。

## 目录结构

```text
src/
  App.tsx                         页面布局和全局状态
  components/
    ControlPanel.tsx              光圈、快门、ISO 控制面板
    ExposureCanvas.tsx            Canvas 挂载和素材加载
    ExposureMeter.tsx             EV 与曝光状态展示
    ModeSwitch.tsx                学习模式切换
  lib/
    assetLoader.ts                素材路径与加载容错
    canvasRenderer.ts             Canvas 场景绘制和视觉效果
    exposure.ts                   曝光计算与效果参数映射
```

## 测试覆盖

当前测试覆盖：

- EV 计算
- 曝光状态判断
- 光圈虚化强度映射
- 快门拖影和动感模糊参数映射
- ISO 噪点映射
- 主画面素材路径

运行：

```bash
npm test
```

## 构建

```bash
npm run build
```

构建产物输出到 `dist/`，该目录不会提交到 Git。

## GitHub

仓库地址：

[https://github.com/mosaic-dng/photography-learning](https://github.com/mosaic-dng/photography-learning)
