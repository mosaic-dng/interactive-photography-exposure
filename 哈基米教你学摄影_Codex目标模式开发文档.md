# 哈基米教你学摄影 - Codex 目标模式开发文档

## 0. 使用方式

把这份文档提交给 Codex，并使用“目标模式”一次性完成项目。目标不是只做半成品原型，而是直接做出一个本地可运行、结构清楚、素材可替换、交互完整的第一版网页工具。

本单文件交接版面向在 Mac 上继续开发：你只需要把这一份 Markdown 文件发到 Mac。哈基米参考图已内嵌在文档中；开目标模式后，先让 Codex 按附录 B 的说明从内嵌 base64 还原出 `assets/cat_reference.jpg` 和 `public/assets/cat_reference.jpg`。

项目正式名称：**哈基米教你学摄影**

项目定位：用一只“哈基米猫猫”带用户学习摄影曝光三要素：光圈、快门速度、ISO。

哈基米参考图预览：

![哈基米参考图](data:image/jpeg;base64,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)

当前 UI 方向：使用 [`guokaigdg/animal-island-ui`](https://github.com/guokaigdg/animal-island-ui) 作为 React 组件库和视觉基座，整体做成“动森感”的温暖小岛教学工具，但不要复制任天堂官方素材、角色、Logo、音效或受保护界面。

第一版不要求最终美术全部完成，但必须把以下内容完整跑通：

- Vite + React 单页网页界面。
- `animal-island-ui` 风格化 UI。
- Canvas 分层合成。
- 光圈虚化效果。
- 快门运动拖影效果。
- ISO 亮度与噪点效果。
- 曝光计算与曝光指示条。
- 学习效果 / 学习曝光两种模式。
- 素材缺失时的占位与容错。
- README 运行说明。

如果正式素材暂时没有准备好，先用占位图、纯色图层或简单矢量占位元素实现完整功能接口。等运行素材放进 `public/assets/` 文件夹后，可以直接替换。

---

## 1. 项目目标

制作一个交互式网页工具 **《哈基米教你学摄影》**，帮助摄影初学者直观理解光圈、快门速度、ISO 三者的关系。

这个工具不是专业相机模拟器，而是教学型可视化工具。用户通过拖动三个滑块，实时看到画面变化，从而理解：

- 光圈影响景深和进光量。
- 快门速度影响运动凝固 / 运动拖影和进光时间。
- ISO 影响画面亮度和噪点。
- 三者共同决定曝光结果。

页面主标题使用：

```text
哈基米教你学摄影
```

副标题可使用：

```text
拖动光圈、快门、ISO，看懂曝光三要素
```

---

## 2. Codex 目标模式总要求

请把本文件视为唯一需求文档，按目标模式一次性完成第一版。不要只给方案，不要停在伪代码，不要只搭页面外壳。

执行要求：

1. 先快速阅读并理解本需求。
2. 直接建立项目文件结构。
3. 直接实现可运行版本。
4. 对缺失素材做容错，不因为素材不存在而报错。
5. 代码完成后自行检查：页面是否能打开、滑块是否生效、Canvas 是否正常刷新。
6. 最后补充 README，说明如何运行、如何替换素材。
7. 第一版使用 Vite + React + TypeScript + `animal-island-ui`，Canvas 仍然使用原生 Canvas API。
8. 不要等待用户补充素材，先用占位方案跑通功能。
9. 不要把 `animal-island-ui` 当成 Canvas 渲染引擎，它只负责页面 UI、卡片、按钮、模式切换、提示信息等界面层。

优先交付标准：

```text
能打开、能拖动、能看到变化、能替换素材、代码清楚。
```

---

## 3. 核心场景设定

使用一个固定 16:9 横版场景进行演示。

场景内容：

- 远景：蓝天、白云、山。
- 中景：树木、草丛或灌木，可选。
- 前景 / 地面：草地、空地、一条道路。
- 静态主体：一只站立不动的“哈基米猫猫”。
- 动态主体：一只骑电瓶车从左向右运动的“哈基米猫猫”。

视觉分工：

| 元素 | 教学作用 | 受哪个参数影响 |
|---|---|---|
| 天空、远山、中景树木 | 演示景深虚化 | 光圈 |
| 站立猫 | 演示清晰对焦主体 | 始终保持清晰 |
| 骑电瓶车猫 | 演示运动凝固 / 拖影 | 快门速度 |
| 整体画面 | 演示亮度和噪点 | ISO + 曝光计算 |

---

## 4. 视觉风格

整体采用：

- 轻插画风。
- 半 3D 卡通质感。
- 清爽、干净、教学演示感。
- 温暖小岛、森林、草地、手作木牌、圆润按钮等“动森感”氛围。
- 不要写实摄影风。
- 不要复杂杂乱细节。
- 轮廓要清楚，方便观察参数变化。
- 色彩自然明亮，晴天户外氛围。
- 不要直接复制《动物森友会》的角色、UI、Logo、图标、音效或专有素材。

页面 UI 风格：

- 以 `animal-island-ui` 为主组件库，优先使用它提供的 `Button`、`Card`、`Title`、`Modal` 等组件。
- 控制区可以像岛民手册、木牌或小岛告示板，但信息层级必须清楚。
- 页面背景可以使用柔和天空、草地、小路、木质纹理或纸张质感。
- 按钮和卡片可以圆润可爱，但不要做成幼儿游戏界面。
- 不要过度花哨，不要用太多装饰影响参数阅读。
- 控制面板信息清楚，便于初学者理解。
- 如果 `animal-island-ui` 没有提供滑块组件，可以使用原生 `input[type="range"]` 并用 CSS 做成同风格控件。

---

## 5. 哈基米猫猫角色设定：必须严格参考用户猫图

猫的视觉参考必须严格按照用户提供的猫图，不要自由发挥成其他猫，不要变成普通橘猫，不要变成拟人化大改版角色。

参考图核心特征：

- 浅橘色短毛猫。
- 圆脸。
- 头部偏圆，脸部肉感明显。
- 大眼睛，眼神呆萌、无辜。
- 小鼻子。
- 嘴巴微微收紧。
- 表情一本正经，但有点好笑。
- 整体气质憨憨、可爱、略带喜感。
- 不要凶，不要酷，不要精明，不要过度拟人。

严格要求：

1. `cat_static.png` 和 `cat_bike.png` 必须看起来像同一只猫。
2. 猫脸比例、眼神、嘴部表情要贴近参考图。
3. 可以做轻插画 / 半 3D 卡通化，但不能丢失参考图的“哈基米表情”。
4. 不要把猫画成普通二次元猫娘。
5. 不要把猫画成人类身体。
6. 不要添加衣服、帽子、墨镜、复杂装饰。
7. 不要改变浅橘色短毛猫的主体设定。
8. 如果使用 AI 生成素材，必须上传用户猫图作为视觉参考。
9. 建议把用户猫图保存为：

```text
assets/cat_reference.jpg
```

本单文件版已经把参考图内嵌在文档顶部，并在附录 B 提供 base64 原文。迁移到 Mac 时只需要携带这一份 Markdown。正式开工后，请先让 Codex 从附录 B 还原出：

```text
assets/cat_reference.jpg
public/assets/cat_reference.jpg
```

如果 Markdown 预览器不显示内嵌图片，也不影响目标模式执行；Codex 仍可根据附录 B 的 base64 数据还原参考图文件。

---

## 6. 第一版 MVP 范围

第一版必须完成以下功能：

1. Vite + React 单页网页结构。
2. Canvas 画面预览。
3. 分层素材合成。
4. 三个滑块：光圈、快门、ISO。
5. 光圈控制背景分层虚化。
6. 快门控制骑车猫运动残影。
7. ISO 控制整体亮度和噪点。
8. 当前参数显示。
9. 曝光指示条。
10. 学习效果 / 学习曝光两种模式切换。
11. `animal-island-ui` 风格化控制面板。
12. README 说明。
13. 素材缺失时页面不崩溃。
14. 移动端基本可用。

第一版不强制实现，但代码结构要方便以后扩展：

- 锁定参数。
- 等效曝光联动。
- 挑战模式。
- 多场景切换。
- 参数动画过渡。

---

## 7. 交互模式

### 7.1 学习效果模式 Learn Effects

目的：让用户单独理解每个参数对画面的影响。

逻辑：

- 拖动光圈：重点展示背景虚化变化。
- 拖动快门：重点展示骑车猫拖影变化。
- 拖动 ISO：重点展示整体亮度和噪点变化。
- 在这个模式下，亮度变化可以弱化，避免初学者混乱。
- 视觉重点放在“每个参数各自造成什么效果”。

### 7.2 学习曝光模式 Learn Exposure

目的：让用户理解三者如何共同影响曝光。

逻辑：

- 光圈、快门、ISO 共同影响整体亮度。
- 同时保留各自视觉效果：背景虚化、运动拖影、噪点。
- 显示 EV 曝光偏差。
- 显示曝光状态：严重欠曝、欠曝、正常曝光、过曝、严重过曝。

---

## 8. 参数范围

### 8.1 光圈 Aperture

使用离散档位：

```text
f/1.4, f/2, f/2.8, f/4, f/5.6, f/8, f/11, f/16, f/22
```

### 8.2 快门 Shutter Speed

使用离散档位：

```text
1/4000s, 1/2000s, 1/1000s, 1/500s, 1/250s, 1/125s, 1/60s, 1/30s, 1/15s, 1/8s, 1s
```

### 8.3 ISO

使用离散档位：

```text
100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600
```

---

## 9. 页面布局

页面结构：

1. 顶部标题：哈基米教你学摄影。
2. 副标题：拖动光圈、快门、ISO，看懂曝光三要素。
3. 模式切换：学习效果 / 学习曝光。
4. Canvas 预览区。
5. 参数控制区：光圈、快门、ISO 三个滑块。
6. 当前参数显示。
7. 曝光状态显示：EV + 曝光条。
8. 当前效果说明文字。

推荐布局：

```text
桌面端：左侧 Canvas 预览，右侧控制面板。
移动端：上方 Canvas 预览，下方控制面板。
```

Canvas 推荐比例：

```text
16:9
```

推荐基础尺寸：

```text
1280 × 720
```

---

## 10. Canvas 图层绘制顺序

请按以下顺序合成画面：

```text
1. bg_sky.png
2. bg_mountain.png
3. bg_mid_trees.png，可选
4. bg_ground_road.png
5. cat_static.png
6. cat_bike.png
7. ISO 噪点层，代码动态生成
8. 亮度 / 曝光调整层，代码动态生成
9. UI 辅助信息，可选
```

如果 `bg_mid_trees.png` 不存在，请跳过该层，不要报错。

如果必需素材不存在，请使用占位图形：

- 天空：蓝色渐变矩形。
- 山：远处简洁山形。
- 地面：绿色草地 + 简单道路。
- 站立猫：浅橘色猫形占位。
- 骑车猫：浅橘色猫 + 简单电瓶车占位。

占位图只用于保证功能跑通。后续正式素材放入 `assets/` 后，应自动替换。

---

## 11. 光圈效果实现要求

光圈影响背景虚化。不要把整张画面统一模糊。

根据光圈值计算 blur 强度。大光圈强虚化，小光圈弱虚化：

- f/1.4：背景强虚化。
- f/2.8：背景明显虚化。
- f/5.6：轻微虚化。
- f/11：基本清晰。
- f/16 - f/22：清晰。

不同背景层虚化强度不同：

| 图层 | 虚化强度 |
|---|---|
| bg_sky | 轻微虚化 |
| bg_mountain | 最明显虚化 |
| bg_mid_trees | 中等虚化 |
| bg_ground_road | 轻微或基本不虚 |
| cat_static | 始终清晰 |
| cat_bike | 主要由快门控制 |

实现方式可以使用 Canvas filter：

```javascript
ctx.filter = `blur(${blur}px)`;
```

绘制完该层后记得重置：

```javascript
ctx.filter = 'none';
```

建议建立函数：

```javascript
function getApertureBlur(aperture) {
  // 返回基础 blur 数值
}
```

---

## 12. 快门拖影实现要求

快门速度影响骑电瓶车猫的运动残影。

运动方向：猫从左向右运动，因此残影向左拖出。

不要只用普通 blur，优先使用多层半透明残影：

- 高速快门：只绘制清晰主体。
- 中速快门：绘制 2-3 层轻微偏移残影。
- 慢速快门：绘制 4-8 层明显偏移残影。

示意逻辑：

```javascript
for (let i = ghostCount; i >= 1; i--) {
  ctx.globalAlpha = ghostAlpha * (1 - i / (ghostCount + 1));
  ctx.drawImage(catBike, bikeX - i * offset, bikeY, bikeW, bikeH);
}
ctx.globalAlpha = 1;
ctx.drawImage(catBike, bikeX, bikeY, bikeW, bikeH);
```

快门越慢：

- ghostCount 越多。
- offset 越大。
- alpha 可适当降低。

建议建立函数：

```javascript
function getShutterGhostSettings(shutterSpeed) {
  // 返回 ghostCount、offset、alpha
}
```

---

## 13. ISO 效果实现要求

ISO 同时影响画面亮度和噪点。

逻辑：

- ISO 100：干净，几乎无噪点。
- ISO 800：轻微噪点。
- ISO 3200：明显噪点。
- ISO 12800 以上：噪点强，画面变脏。

噪点可以用 Canvas 随机生成：

```javascript
const imageData = ctx.createImageData(width, height);
// 根据 ISO 生成 alpha 和随机灰度噪点
```

实现建议：

1. 生成一层随机灰度点。
2. 根据 ISO 控制噪点透明度。
3. ISO 越高，噪点密度和透明度越高。
4. 不要让噪点完全盖住画面。
5. 拖动滑块时噪点可以刷新，但不要闪烁过于刺眼。

亮度可以用叠加层或 filter 实现。第一版可以使用半透明白色 / 黑色覆盖层模拟过曝 / 欠曝。

---

## 14. 曝光计算要求

不要求专业测光级精度，但逻辑必须正确。

建议设定基准曝光：

```text
f/16, 1/125s, ISO 100 = 0EV，标准曝光
```

根据当前光圈、快门、ISO 计算与基准的曝光偏差。

简化逻辑：

- 光圈变大：EV 增加，画面变亮。
- 快门变慢：EV 增加，画面变亮。
- ISO 变高：EV 增加，画面变亮。
- 光圈变小、快门变快、ISO 变低：EV 减少，画面变暗。

显示状态：

| EV 偏差 | 状态 |
|---|---|
| <= -3 | 严重欠曝 |
| -3 到 -1 | 欠曝 |
| -1 到 1 | 正常曝光 |
| 1 到 3 | 过曝 |
| >= 3 | 严重过曝 |

建议建立函数：

```javascript
function calculateExposureEV(aperture, shutterSpeed, iso) {
  // 返回相对基准的 EV 偏差
}
```

---

## 15. 动态说明文字

根据参数生成简短说明。一两句话即可，不要写长篇教程。

示例：

- 当前使用大光圈，背景虚化明显，适合突出哈基米主体。
- 当前使用小光圈，背景和主体都较清晰。
- 当前快门较快，骑车哈基米被凝固。
- 当前快门较慢，骑车哈基米出现明显运动拖影。
- 当前 ISO 较高，画面更亮，但噪点增加。
- 当前整体曝光正常。
- 当前画面略微过曝。
- 当前画面欠曝，需要增加进光量或提高 ISO。

说明文字要和当前模式匹配：

- 学习效果模式：优先解释当前参数造成的视觉效果。
- 学习曝光模式：优先解释整体曝光是否正常。

---

## 16. 素材文件清单

本 Markdown 已经内嵌 `cat_reference.jpg`。在 Mac 上启动目标模式后，请先从附录 B 还原参考图，再按以下运行路径读取素材：

```text
public/assets/bg_sky.png
public/assets/bg_mountain.png
public/assets/bg_ground_road.png
public/assets/bg_mid_trees.png
public/assets/cat_static.png
public/assets/cat_bike.png
public/assets/scene_preview.jpg
public/assets/cat_reference.jpg
public/assets/noise_texture.png
```

在 Mac 上新建项目时，请先从附录 B 还原出：

```text
public/assets/cat_reference.jpg
```

运行必需素材：

```text
bg_sky.png
bg_mountain.png
bg_ground_road.png
cat_static.png
cat_bike.png
```

开发交接必需素材：

```text
cat_reference.jpg
```

可选素材：

```text
bg_mid_trees.png
scene_preview.jpg
noise_texture.png
```

容错要求：

- 必需素材缺失时，页面不能崩溃。
- 缺失素材使用代码绘制占位层。
- 控制台可以给出 warning，但不要阻塞页面。
- 所有素材路径要集中管理，方便后期修改。
- `cat_reference.jpg` 不参与 Canvas 主渲染也可以，但必须出现在 README 或素材说明里，方便后续重新生成猫素材。
- `noise_texture.png` 可不提供，第一版优先使用 Canvas 动态噪点。

---

## 17. 项目文件结构

建议在 Mac 上使用 Vite + React + TypeScript。结构如下：

```text
project/
├── README.md
├── package.json
├── vite.config.ts
├── index.html
├── assets/
│   └── cat_reference.jpg
├── public/
│   └── assets/
│       ├── bg_sky.png
│       ├── bg_mountain.png
│       ├── bg_ground_road.png
│       ├── bg_mid_trees.png
│       ├── cat_static.png
│       ├── cat_bike.png
│       ├── scene_preview.jpg
│       ├── cat_reference.jpg
│       └── noise_texture.png
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── styles.css
    ├── components/
    │   ├── ExposureCanvas.tsx
    │   ├── ControlPanel.tsx
    │   ├── ExposureMeter.tsx
    │   └── ModeSwitch.tsx
    ├── lib/
    │   ├── exposure.ts
    │   ├── assetLoader.ts
    │   └── canvasRenderer.ts
    └── types.ts
```

文件职责：

- `App.tsx`：页面布局、状态管理、模式切换。
- `ExposureCanvas.tsx`：持有 `<canvas>`，在参数变化时调用渲染函数。
- `ControlPanel.tsx`：三个参数滑块和当前参数展示。
- `ExposureMeter.tsx`：EV 数值、曝光状态、曝光条。
- `ModeSwitch.tsx`：学习效果 / 学习曝光切换。
- `canvasRenderer.ts`：只负责 Canvas 分层绘制、虚化、拖影、噪点、亮度叠加。
- `exposure.ts`：曝光计算和状态判断，必须有单元测试。
- `assetLoader.ts`：集中管理素材路径、加载成功/失败、占位回退。

不要把所有逻辑塞进 `App.tsx`。Canvas 渲染、曝光计算、UI 组件要分开，方便后续让 Codex 在 Mac 上继续维护。

---

## 18. 技术栈要求

优先使用：

```text
Vite + React + TypeScript + Canvas API + animal-island-ui
```

要求：

- 使用 Node.js 18+。
- 使用 Vite 作为本地开发服务器和构建工具。
- UI 组件使用 `animal-island-ui`。
- Canvas 预览仍使用原生 Canvas API，不要用 DOM 堆叠假装 Canvas。
- 代码结构清楚。
- 素材路径集中管理。
- 参数配置化，方便后期调整。
- 注释少而清楚，重点解释曝光计算、Canvas 分层和缺失素材回退。
- 不要引入 Next.js，第一版没有服务端需求。
- 不要为了 UI 组件库重写曝光逻辑，`animal-island-ui` 只负责界面观感。

Mac 初始化建议命令：

```bash
npm create vite@latest hakimi-photo-exposure-tool -- --template react-ts
cd hakimi-photo-exposure-tool
npm install
npm install animal-island-ui classnames
npm run dev
```

在入口文件中引入组件库样式：

```tsx
import 'animal-island-ui/style';
```

组件导入示例：

```tsx
import { Button, Card, Title, Modal } from 'animal-island-ui';
```

注意：`animal-island-ui` 仓库许可证为 CC BY-NC 4.0，优先按个人学习、非商业展示项目处理。如果以后要商业化，先确认许可证或替换 UI 资产。

---

## 19. UI 细节建议

### 19.1 顶部区域

内容：

```text
哈基米教你学摄影
拖动光圈、快门、ISO，看懂曝光三要素
```

顶部区域使用 `Title` 或同等标题组件。标题要像小岛欢迎牌一样温暖，但不要遮挡主体工具。

### 19.2 控制面板

每个参数控制块包含：

- 参数名称。
- 当前值。
- 滑块。
- 简短解释。

示例：

```text
光圈 Aperture：f/2.8
大光圈 = 背景更虚，主体更突出
```

控制面板建议使用 `Card` 承载，每个参数控制块可以使用小型内嵌区域，但不要做多层卡片套卡片。滑块如果用原生 `input[type="range"]`，需要通过 CSS 做成圆润、木牌/草地配色，并保证移动端手指可拖动。

### 19.3 曝光条

曝光条建议从左到右：

```text
欠曝  ——  正常  ——  过曝
```

中间为 0EV，指针根据 EV 偏差移动。

曝光条可做成小岛路牌或刻度木尺风格，但刻度必须清楚。欠曝、正常、过曝三段颜色要易识别，不要只靠颜色传达状态，旁边要显示文字状态。

### 19.4 模式切换

按钮文案：

```text
学习效果
学习曝光
```

当前模式要有明显选中状态。

模式切换优先使用 `Button` 或分段按钮样式。选中态可以使用更深的绿色、木牌高亮、轻微阴影或图标，但不要出现大幅跳动。

### 19.5 参考图和素材说明

可以放一个“素材说明”或“关于哈基米”的小入口，使用 `Modal` 展示：

- 当前哈基米参考图来自 `assets/cat_reference.jpg`。
- 正式素材可替换 `public/assets/` 中的同名文件。
- 素材缺失时页面会使用占位图继续运行。

这个说明入口不要干扰主流程，放在页面角落或 README 中也可以。

---

## 20. 验收标准

第一版完成后，需要满足：

1. `npm install` 和 `npm run dev` 可以正常运行。
2. 页面标题为“哈基米教你学摄影”。
3. 页面 UI 使用 `animal-island-ui` 的组件和样式，并呈现温暖小岛 / 动森感。
4. Canvas 可以显示完整合成场景。
5. 拖动光圈滑块，背景虚化变化明显。
6. 拖动快门滑块，骑车猫拖影变化明显。
7. 拖动 ISO 滑块，亮度和噪点变化明显。
8. 参数数值实时更新。
9. 曝光条状态实时更新。
10. 学习效果 / 学习曝光两种模式可切换。
11. 素材缺失时页面不崩溃。
12. README 说明如何运行、如何替换素材、如何保留参考图。
13. `assets/cat_reference.jpg` 能在 Markdown 中显示，`public/assets/cat_reference.jpg` 能被项目读取。
14. 站立猫和骑车猫都明确是同一只“哈基米猫猫”。
15. 猫的视觉特征必须贴近用户参考图，不得变成普通橘猫或其他卡通猫。
16. 移动端布局可用：Canvas 不溢出，滑块可拖动，按钮不挤压文字。
17. `exposure.ts` 至少覆盖 EV 计算和曝光状态判断的单元测试。

---

## 21. 给 Codex 的一次性执行顺序

请按以下顺序直接执行：

1. 阅读并理解本需求文档。
2. 用 Vite 创建 React + TypeScript 项目。
3. 安装并引入 `animal-island-ui` 和样式文件。
4. 建立 `src/components/`、`src/lib/`、`public/assets/` 等项目结构。
5. 复制或保留 `cat_reference.jpg`：Markdown 用 `assets/cat_reference.jpg`，运行项目用 `public/assets/cat_reference.jpg`。
6. 实现基础 React 页面布局。
7. 用 `animal-island-ui` 实现标题、卡片、按钮、模式切换和说明弹层。
8. 用 CSS 补齐滑块、曝光条和整体动森感视觉。
9. 实现 Canvas 初始化。
10. 实现素材加载与缺失占位。
11. 实现分层绘制。
12. 实现光圈虚化。
13. 实现快门残影。
14. 实现 ISO 亮度和噪点。
15. 实现曝光计算和曝光条。
16. 实现三参数滑块。
17. 实现模式切换。
18. 实现动态说明文字。
19. 为曝光计算补单元测试。
20. 补充 README。
21. 本地测试：`npm run dev`、浏览器交互、移动端窄屏、素材缺失回退。
22. 修复报错。
23. 输出完成说明，包括如何启动项目、如何替换素材、哪些文件最重要。

不要只输出计划。目标是完成可运行版本。

---

# 附录 A：GPT Image 素材生成提示词

以下提示词用于生成项目素材。猫相关素材生成时，必须同时上传用户提供的猫图作为视觉参考。猫的脸型、眼神、嘴部表情、浅橘色短毛特征，要严格贴近参考图。

---

## A1. 天空层 bg_sky.png

```text
请生成一张用于《哈基米教你学摄影》的背景分层素材：天空层。画面内容只有晴朗白天的蓝天和少量柔和白云，天空通透干净，氛围轻松自然，云朵简洁柔和，不要出现山、地面、树木、动物、人物、建筑、车辆。整体风格请统一为轻插画风、半3D卡通质感，干净清爽，适合做摄影教学可视化工具素材。色彩自然明亮，构图简洁，不要写实摄影风，不要复杂杂乱细节，不要文字，不要水印。请输出单独的天空层素材，16:9横版。
```

## A2. 远山层 bg_mountain.png

```text
请生成一张用于《哈基米教你学摄影》的背景分层素材：远山层。画面内容为中远处的山体轮廓，层次简洁清晰，山体连绵但不要过于复杂，适合后续表现“景深虚化”效果。不要出现天空以外的大面积云层，不要出现地面前景，不要出现树木细节过多的近景，不要人物、动物、建筑、车辆。整体风格请统一为轻插画风、半3D卡通质感，干净清爽，适合做摄影教学可视化工具素材。色彩自然明亮，白天户外氛围，构图简洁，不要写实摄影风，不要复杂杂乱细节，不要文字，不要水印。请输出单独的远山层素材，16:9横版。
```

## A3. 地面 / 道路层 bg_ground_road.png

```text
请生成一张用于《哈基米教你学摄影》的背景分层素材：地面与道路层。画面内容为户外自然场景中的草地、空地和一条简洁的小路或道路，适合后续放置一只站立的猫和一只骑电瓶车的猫。构图要简洁清楚，地面要有明确的落脚区域和道路方向。不要出现山体主体，不要出现大面积天空，不要人物、动物、建筑、车辆。整体风格请统一为轻插画风、半3D卡通质感，干净清爽，适合做摄影教学可视化工具素材。色彩自然明亮，白天户外氛围，构图简洁，不要写实摄影风，不要复杂杂乱细节，不要文字，不要水印。请输出单独的地面/道路层素材，16:9横版。
```

## A4. 中景树木 / 草丛层 bg_mid_trees.png

```text
请生成一张用于《哈基米教你学摄影》的背景分层素材：中景树木/草丛层。画面内容为少量中景树木、灌木或草丛，用来增加场景层次，但不要过于复杂，不要遮挡主要主体区域。请保持元素简洁、轮廓清楚，适合后续做景深虚化效果。不要出现人物、动物、建筑、车辆，不要大面积天空，不要突出远山主体。整体风格请统一为轻插画风、半3D卡通质感，干净清爽，适合做摄影教学可视化工具素材。色彩自然明亮，白天户外氛围，构图简洁，不要写实摄影风，不要复杂杂乱细节，不要文字，不要水印。请输出单独的中景层素材，16:9横版。
```

## A5. 站立猫 cat_static.png

```text
请以我上传的参考图中的猫为严格视觉原型，生成一只“哈基米猫猫”角色素材。

必须严格保留参考图中的核心特征：浅橘色短毛猫、圆脸、大眼睛、小鼻子、嘴巴微微收紧、表情呆萌无辜、一本正经但有点好笑、憨憨可爱。猫脸比例、眼神和嘴部表情要尽量贴近参考图，不要改成普通橘猫，不要改成猫娘，不要改成过度拟人角色，不要添加衣服帽子或复杂装饰。

猫咪单独站立，姿态稳定自然，面向镜头略带3/4角度，四肢完整，身体完整可见，形象清晰，适合作为摄影教学场景中的静态主体，并具有明显“对焦主体”感觉。请让猫咪有较强主体感，居中构图，轮廓清楚，方便后续合成到背景中。

整体风格统一为轻插画风、半3D卡通质感，轮廓明确，毛发适度简化但保留可爱质感，色彩干净清爽。请输出单独主体，透明背景效果，不要场景，不要道具，不要文字，不要水印，不要其他角色。
```

## A6. 骑电瓶车猫 cat_bike.png

```text
请以我上传的参考图中的猫为严格视觉原型，生成一只“哈基米猫猫”版本的动态角色素材。

必须严格保留参考图中的核心特征：浅橘色短毛猫、圆脸、大眼睛、小鼻子、嘴巴微微收紧、表情呆萌无辜、一本正经但有点好笑、憨憨可爱。猫脸比例、眼神和嘴部表情要尽量贴近参考图，不要改成普通橘猫，不要改成猫娘，不要改成过度拟人角色，不要添加衣服帽子或复杂装饰。

猫咪正在骑一辆小巧简洁的电瓶车，采用侧面视角，车头朝右，呈现从左向右运动的状态。猫咪坐姿自然，双爪扶着车把，整体轮廓清晰，动作明确，适合后续在摄影教学中表现“快门速度与运动模糊”。请保证主体边缘清晰，运动方向明确，方便后续制作动态残影和运动模糊效果。

整体风格与其他素材统一：轻插画风、半3D卡通质感、干净简洁、教学演示风格。电瓶车造型简洁易识别，不要复杂花纹，不要品牌标志，不要过多装饰。请输出单独主体，透明背景效果，不要场景，不要文字，不要水印，不要其他角色。
```

## A7. 完整场景参考图 scene_preview.jpg

```text
请生成一张用于《哈基米教你学摄影》的完整场景参考图，整体为16:9横版，适合摄影教学演示。画面为晴朗白天的户外场景，远处有蓝天、白云和山体，中景或前景有草地、空地与一条简洁的小路。画面中有两只同风格的“哈基米猫猫”角色：一只浅橘色短毛猫站立不动，作为静态主体，位置偏中间或中左区域；另一只同样风格的浅橘色短毛猫骑着小巧简洁的电瓶车，侧面视角，从左向右运动，位置在道路上，作为动态主体。

猫咪必须严格参考我上传的猫图：浅橘色短毛、圆脸、大眼睛、小鼻子、嘴巴微微收紧、表情呆萌无辜、一本正经但有点好笑。两只猫必须像同一只猫，不要变成普通橘猫，不要变成猫娘，不要过度拟人化。

请让整个画面结构清晰，远景、中景、前景层次明确，适合后续演示曝光三要素：背景可用于表现光圈带来的景深虚化，站立猫可作为清晰对焦主体，骑车猫可用于表现快门速度带来的运动模糊，整体亮度变化可用于表现 ISO 感光度。

整体风格统一为轻插画风、半3D卡通质感、干净清爽、教学可视化风格。色彩自然明亮，不要写实摄影风，不要复杂杂乱细节，不要文字，不要水印。
```

---

# 附录 B：Mac 单文件交接清单

这份文档就是完整交接物。去 Mac 上继续做时，只需要带走这一份文件：

```text
哈基米教你学摄影_Codex目标模式开发文档.md
```

不要再依赖当前 Windows 电脑里的 `assets/`、`src/`、`tests/` 或旧静态版文件。准备在 Mac 上开目标模式时，把这份 Markdown 放进一个空项目目录，然后把下面这句话发给 Codex：

```text
请严格按《哈基米教你学摄影_Codex目标模式开发文档.md》目标模式实现项目。UI 使用 guokaigdg/animal-island-ui，整体做温暖小岛/动森感；Canvas 负责曝光三要素可视化；哈基米参考图已经内嵌在文档附录 B，请先还原为 assets/cat_reference.jpg 和 public/assets/cat_reference.jpg。
```

Mac 上建议流程：

```bash
mkdir hakimi-photo-exposure-tool
cd hakimi-photo-exposure-tool
# 把这份 Markdown 文件放到当前目录
npm create vite@latest . -- --template react-ts
npm install
npm install animal-island-ui classnames
mkdir -p assets public/assets
# 让 Codex 从本文档附录 B 的 base64 块还原 cat_reference.jpg
npm run dev
```

开始实现前请让 Codex 重点检查：

1. 是否已经从本文档附录 B 还原 `assets/cat_reference.jpg` 和 `public/assets/cat_reference.jpg`。
2. `animal-island-ui` 是否成功安装，样式是否通过 `import 'animal-island-ui/style'` 引入。
3. Canvas 是否有素材缺失占位，不因为图片没齐而空白或报错。
4. 移动端布局是否能拖动滑块，按钮文字是否不挤压。
5. README 是否说明素材替换方式和参考图来源。

## B1. 内嵌哈基米参考图 base64

如果 Markdown 预览不支持顶部的内嵌图片，请让 Codex 把下面 base64 保存为 JPEG 文件：

```text
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
```

还原后的目标路径：

```text
assets/cat_reference.jpg
public/assets/cat_reference.jpg
```

