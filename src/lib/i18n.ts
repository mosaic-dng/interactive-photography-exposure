import type { ExposureStatusLevel } from './exposure';

export type LanguageCode = 'zh' | 'ja' | 'ko' | 'en';

interface Translation {
  languageLabel: string;
  appTitle: string;
  appSubtitle: string;
  workspaceLabel: string;
  currentParameters: string;
  modes: {
    ariaLabel: string;
    effects: string;
    exposure: string;
  };
  controls: {
    apertureLabel: string;
    apertureDescription: string;
    shutterLabel: string;
    shutterDescription: string;
    isoLabel: string;
    isoDescription: string;
    stepDown: string;
    stepUp: string;
  };
  meter: {
    ariaLabel: string;
    title: string;
    under: string;
    normal: string;
    over: string;
  };
  lessons: {
    exposureMode: string;
    wideAperture: string;
    slowShutter: string;
    highIso: string;
    default: string;
  };
  exposureStatus: Record<ExposureStatusLevel, {
    label: string;
    hint: string;
  }>;
}

export const LANGUAGES: Array<{ code: LanguageCode; label: string }> = [
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
];

const TRANSLATIONS: Record<LanguageCode, Translation> = {
  zh: {
    languageLabel: 'Language',
    appTitle: '摄影大学习',
    appSubtitle: '拖动光圈、快门、ISO，看懂曝光三要素',
    workspaceLabel: '摄影曝光可视化工具',
    currentParameters: '当前参数',
    modes: {
      ariaLabel: '学习模式切换',
      effects: '学习效果',
      exposure: '学习曝光',
    },
    controls: {
      apertureLabel: '光圈 Aperture',
      apertureDescription: '大光圈让背景更虚，小光圈让远近都更清楚。',
      shutterLabel: '快门 Shutter',
      shutterDescription: '快门越慢，骑车的曼波本身越容易被拉成运动模糊。',
      isoLabel: 'ISO',
      isoDescription: 'ISO 越高画面越亮，但噪点也越多。',
      stepDown: '减少一档',
      stepUp: '增加一档',
    },
    meter: {
      ariaLabel: '曝光状态',
      title: '曝光指示',
      under: '欠曝',
      normal: '正常',
      over: '过曝',
    },
    lessons: {
      exposureMode: '学习曝光模式会把光圈、快门和 ISO 一起计入亮度，观察曝光条如何随着三者联动移动。',
      wideAperture: '当前大光圈让背景明显虚化，静止的曼波会更突出。',
      slowShutter: '当前快门偏慢，骑车的曼波会出现横向运动模糊。',
      highIso: '当前 ISO 偏高，画面更亮，同时能看到更明显的噪点。',
      default: '拖动三个参数，分别观察背景虚化、人物运动模糊和噪点变化。',
    },
    exposureStatus: {
      'severe-under': {
        label: '严重欠曝',
        hint: '画面会明显发暗，细节容易沉下去。',
      },
      under: {
        label: '欠曝',
        hint: '画面偏暗，可以放慢快门、开大光圈或提高 ISO。',
      },
      normal: {
        label: '正常曝光',
        hint: '整体亮度比较舒服，适合观察三要素的平衡。',
      },
      over: {
        label: '过曝',
        hint: '画面偏亮，可以收小光圈、加快快门或降低 ISO。',
      },
      'severe-over': {
        label: '严重过曝',
        hint: '画面会明显泛白，高光细节容易丢失。',
      },
    },
  },
  ja: {
    languageLabel: 'Language',
    appTitle: '写真を学ぼう',
    appSubtitle: '絞り、シャッター速度、ISOを動かして露出の三要素を理解しよう',
    workspaceLabel: '写真露出ビジュアライザー',
    currentParameters: '現在の設定',
    modes: {
      ariaLabel: '学習モード切替',
      effects: '効果を学ぶ',
      exposure: '露出を学ぶ',
    },
    controls: {
      apertureLabel: '絞り Aperture',
      apertureDescription: '絞りを開くと背景が大きくぼけ、絞ると全体がくっきりします。',
      shutterLabel: 'シャッター Shutter',
      shutterDescription: 'シャッターが遅いほど、走るマンボに動きのぶれが出ます。',
      isoLabel: 'ISO',
      isoDescription: 'ISOを上げると明るくなりますが、ノイズも増えます。',
      stepDown: '1段下げる',
      stepUp: '1段上げる',
    },
    meter: {
      ariaLabel: '露出状態',
      title: '露出メーター',
      under: '暗い',
      normal: '適正',
      over: '明るい',
    },
    lessons: {
      exposureMode: '露出学習モードでは、絞り、シャッター速度、ISOを明るさに反映し、メーターの動きを観察できます。',
      wideAperture: '現在は絞りが大きく開いているため、背景が大きくぼけて静止したマンボが目立ちます。',
      slowShutter: '現在はシャッターが遅めなので、走るマンボに横方向の動きのぶれが出ます。',
      highIso: '現在はISOが高めなので、画面は明るくなり、ノイズも見えやすくなります。',
      default: '3つの設定を動かして、背景ぼけ、動きのぶれ、ノイズの変化を見比べましょう。',
    },
    exposureStatus: {
      'severe-under': {
        label: '大きく露出不足',
        hint: '画面がかなり暗くなり、細部が沈みやすくなります。',
      },
      under: {
        label: '露出不足',
        hint: '少し暗めです。シャッターを遅くする、絞りを開く、ISOを上げる方法があります。',
      },
      normal: {
        label: '適正露出',
        hint: '明るさのバランスがよく、三要素の関係を観察しやすい状態です。',
      },
      over: {
        label: '露出オーバー',
        hint: '少し明るめです。絞る、シャッターを速くする、ISOを下げる方法があります。',
      },
      'severe-over': {
        label: '大きく露出オーバー',
        hint: '画面が白っぽくなり、明るい部分の細部が失われやすくなります。',
      },
    },
  },
  ko: {
    languageLabel: 'Language',
    appTitle: '사진 배우기',
    appSubtitle: '조리개, 셔터 속도, ISO를 움직이며 노출의 세 요소를 익혀 보세요',
    workspaceLabel: '사진 노출 시각화 도구',
    currentParameters: '현재 설정',
    modes: {
      ariaLabel: '학습 모드 전환',
      effects: '효과 배우기',
      exposure: '노출 배우기',
    },
    controls: {
      apertureLabel: '조리개 Aperture',
      apertureDescription: '조리개를 크게 열면 배경이 더 흐려지고, 조이면 앞뒤가 더 선명해집니다.',
      shutterLabel: '셔터 Shutter',
      shutterDescription: '셔터가 느릴수록 달리는 만보에 움직임 흐림이 더 생깁니다.',
      isoLabel: 'ISO',
      isoDescription: 'ISO가 높을수록 화면은 밝아지지만 노이즈도 늘어납니다.',
      stepDown: '한 스톱 낮추기',
      stepUp: '한 스톱 높이기',
    },
    meter: {
      ariaLabel: '노출 상태',
      title: '노출 표시',
      under: '부족',
      normal: '적정',
      over: '과다',
    },
    lessons: {
      exposureMode: '노출 학습 모드에서는 조리개, 셔터 속도, ISO가 함께 밝기에 반영되며 노출 막대의 움직임을 볼 수 있습니다.',
      wideAperture: '현재 조리개가 크게 열려 배경이 뚜렷하게 흐려지고, 멈춰 있는 만보가 더 돋보입니다.',
      slowShutter: '현재 셔터가 느려 달리는 만보에 가로 방향 움직임 흐림이 나타납니다.',
      highIso: '현재 ISO가 높아 화면이 더 밝고, 노이즈도 더 잘 보입니다.',
      default: '세 설정을 움직여 배경 흐림, 움직임 흐림, 노이즈 변화를 각각 관찰해 보세요.',
    },
    exposureStatus: {
      'severe-under': {
        label: '심한 노출 부족',
        hint: '화면이 매우 어두워지고 세부가 묻히기 쉽습니다.',
      },
      under: {
        label: '노출 부족',
        hint: '화면이 어둡습니다. 셔터를 늦추거나 조리개를 열거나 ISO를 올릴 수 있습니다.',
      },
      normal: {
        label: '적정 노출',
        hint: '전체 밝기가 편안해 세 요소의 균형을 관찰하기 좋습니다.',
      },
      over: {
        label: '노출 과다',
        hint: '화면이 밝습니다. 조리개를 조이거나 셔터를 빠르게 하거나 ISO를 낮출 수 있습니다.',
      },
      'severe-over': {
        label: '심한 노출 과다',
        hint: '화면이 하얗게 뜨고 밝은 부분의 세부가 사라지기 쉽습니다.',
      },
    },
  },
  en: {
    languageLabel: 'Language',
    appTitle: 'Learn Photography',
    appSubtitle: 'Move aperture, shutter speed, and ISO to understand the exposure triangle',
    workspaceLabel: 'Photography exposure visualizer',
    currentParameters: 'Current Settings',
    modes: {
      ariaLabel: 'Learning mode switch',
      effects: 'Learn Effects',
      exposure: 'Learn Exposure',
    },
    controls: {
      apertureLabel: 'Aperture',
      apertureDescription: 'A wider aperture makes the background blurrier. A smaller aperture keeps more of the scene sharp.',
      shutterLabel: 'Shutter',
      shutterDescription: 'A slower shutter makes the cycling Manbo stretch into motion blur.',
      isoLabel: 'ISO',
      isoDescription: 'Higher ISO makes the image brighter, but it also adds more noise.',
      stepDown: 'decrease one stop',
      stepUp: 'increase one stop',
    },
    meter: {
      ariaLabel: 'Exposure status',
      title: 'Exposure Meter',
      under: 'Under',
      normal: 'Good',
      over: 'Over',
    },
    lessons: {
      exposureMode: 'Learn Exposure mode combines aperture, shutter speed, and ISO into brightness, so you can watch the meter move as the three settings interact.',
      wideAperture: 'The current wide aperture makes the background blur strongly, helping the still Manbo stand out.',
      slowShutter: 'The current shutter is slow, so the cycling Manbo shows horizontal motion blur.',
      highIso: 'The current ISO is high, making the image brighter while adding more visible noise.',
      default: 'Move the three settings to compare background blur, subject motion blur, and noise.',
    },
    exposureStatus: {
      'severe-under': {
        label: 'Severely Underexposed',
        hint: 'The image will look very dark, and details can sink into the shadows.',
      },
      under: {
        label: 'Underexposed',
        hint: 'The image is dark. Try slowing the shutter, opening the aperture, or raising ISO.',
      },
      normal: {
        label: 'Good Exposure',
        hint: 'The overall brightness is comfortable, making it easier to study the balance between the three settings.',
      },
      over: {
        label: 'Overexposed',
        hint: 'The image is bright. Try stopping down, using a faster shutter, or lowering ISO.',
      },
      'severe-over': {
        label: 'Severely Overexposed',
        hint: 'The image will look washed out, and highlight detail can disappear.',
      },
    },
  },
};

export function getTranslation(language: LanguageCode) {
  return TRANSLATIONS[language];
}
