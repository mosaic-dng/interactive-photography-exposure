# 互动式摄影曝光学习工具

一个通过网页交互帮助摄影初学者理解光圈、快门速度与 ISO 关系的可视化学习项目。

## 在线体验

Vercel Demo：待添加

## 项目预览

> 暂未添加截图，后续可在 `docs/preview.png` 中放置项目截图。

## 项目简介

这是一个面向摄影初学者的互动式网页学习工具。用户可以通过调节光圈、快门速度和 ISO，观察画面亮度、背景虚化、运动模糊和噪点的变化，从而更直观地理解曝光三要素之间的关系。

## 核心功能

- 光圈调节：观察背景虚化程度变化。
- 快门速度调节：观察骑车主体的拖影和运动模糊。
- ISO 调节：观察画面亮度和噪点变化。
- 曝光指示：通过 EV 数值和曝光条展示欠曝、正常曝光、过曝状态。
- 双学习模式：支持观察视觉效果，也支持观察三参数共同影响曝光。
- 多语言界面：支持中文、日文、韩文、英文切换。
- Canvas 场景渲染：使用本地素材展示互动式摄影场景。

## 技术栈

- Vite
- React
- TypeScript
- animal-island-ui
- Canvas 2D
- Vitest

## 本地运行

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

## Vercel 部署

当前项目是 Vite 前端项目，适合部署到 Vercel。部署时可使用：

```text
Install Command: npm install
Build Command: npm run build
Output Directory: dist
```

## 项目结构

```text
public/assets/                    运行时使用的图片素材
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
    i18n.ts                       中日韩英界面文案
  styles.css                      页面样式和响应式布局
docs/                             README 截图预留目录
```

## 素材说明

当前运行素材位于 `public/assets/`：

- `background.png`：主场景背景
- `manbo.png`：静止主体
- `manbo_bike_2.png`：骑车主体

原始生成素材仍保留在项目根目录，方便继续迭代或重新导出：

- `background-source.png`
- `generated-scene-2026-07-04-184109.png`
- `manbo-static-source.png`
- `manbo-bike-source.png`
- `manbo-bike-alt-source.png`

运行时如果主素材缺失，Canvas 会使用备用绘制方案，避免页面直接空白。

## 测试覆盖

当前测试覆盖：

- EV 计算
- 曝光状态判断
- 光圈虚化强度映射
- 快门拖影和动感模糊参数映射
- ISO 噪点映射
- 主画面素材路径
- 中日韩英核心界面文案

运行：

```bash
npm test
```

## 构建

```bash
npm run build
```

构建产物输出到 `dist/`，该目录不会提交到 Git。

## 后续计划

- 增加更多摄影知识模块
- 优化移动端体验
- 增加更清晰的教学引导
- 增加更多互动练习

---

# Interactive Photography Exposure Learning Tool

A visual and interactive web project that helps photography beginners understand the relationship between aperture, shutter speed, and ISO.

## Live Demo

Vercel Demo: To be added

## Preview

> No preview image yet. A screenshot can be added later at `docs/preview.png`.

## Overview

This is an interactive web-based learning tool for photography beginners. Users can adjust aperture, shutter speed, and ISO to observe changes in brightness, background blur, motion blur, and image noise. The goal is to make the exposure triangle easier to understand through direct visual interaction.

## Core Features

- Aperture adjustment: observe changes in background blur.
- Shutter speed adjustment: observe subject trails and motion blur.
- ISO adjustment: observe changes in brightness and image noise.
- Exposure meter: show underexposure, normal exposure, and overexposure with EV feedback.
- Two learning modes: compare visual effects or study combined exposure changes.
- Multilingual interface: Chinese, Japanese, Korean, and English.
- Canvas scene rendering: use local assets for the interactive photography scene.

## Tech Stack

- Vite
- React
- TypeScript
- animal-island-ui
- Canvas 2D
- Vitest

## Local Development

```bash
npm install
npm run dev
```

Then open the local URL printed in the terminal, usually:

```text
http://localhost:5173/
```

## Common Commands

```bash
npm run dev       # Start local development
npm test          # Run tests
npm run build     # Build for production
npm run preview   # Preview the production build
```

## Vercel Deployment

This is a Vite frontend project and can be deployed to Vercel with:

```text
Install Command: npm install
Build Command: npm run build
Output Directory: dist
```

## Project Structure

```text
public/assets/                    Runtime image assets
src/
  App.tsx                         Page layout and global state
  components/
    ControlPanel.tsx              Aperture, shutter speed, and ISO controls
    ExposureCanvas.tsx            Canvas mount and asset loading
    ExposureMeter.tsx             EV and exposure status display
    ModeSwitch.tsx                Learning mode switch
  lib/
    assetLoader.ts                Asset paths and loading fallback
    canvasRenderer.ts             Canvas scene rendering and visual effects
    exposure.ts                   Exposure calculations and effect mapping
    i18n.ts                       Chinese, Japanese, Korean, and English copy
  styles.css                      Page styles and responsive layout
docs/                             Placeholder directory for README screenshots
```

## Assets

Runtime assets are stored in `public/assets/`:

- `background.png`: main scene background
- `manbo.png`: still subject
- `manbo_bike_2.png`: cycling subject

Source assets are kept in the project root for future iteration or export:

- `background-source.png`
- `generated-scene-2026-07-04-184109.png`
- `manbo-static-source.png`
- `manbo-bike-source.png`
- `manbo-bike-alt-source.png`

If the main assets are missing at runtime, the Canvas renderer falls back to a drawn scene so the page does not become blank.

## Test Coverage

Current tests cover:

- EV calculation
- Exposure status classification
- Aperture blur mapping
- Shutter trail and motion blur mapping
- ISO noise mapping
- Main scene asset paths
- Core multilingual interface copy

Run:

```bash
npm test
```

## Build

```bash
npm run build
```

The production build is generated in `dist/`, which is not committed to Git.

## Roadmap

- Add more photography learning modules
- Improve mobile experience
- Add clearer learning guidance
- Add more interactive exercises
