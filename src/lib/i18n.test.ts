import { describe, expect, it } from 'vitest';
import { LANGUAGES, getTranslation } from './i18n';

describe('i18n translations', () => {
  it('offers Chinese, Japanese, Korean, and English language choices', () => {
    expect(LANGUAGES.map((language) => language.code)).toEqual(['zh', 'ja', 'ko', 'en']);
  });

  it('uses Language as the selector label in every language', () => {
    expect(getTranslation('zh').languageLabel).toBe('Language');
    expect(getTranslation('ja').languageLabel).toBe('Language');
    expect(getTranslation('ko').languageLabel).toBe('Language');
    expect(getTranslation('en').languageLabel).toBe('Language');
  });

  it('localizes the core app title and mode labels', () => {
    expect(getTranslation('zh').appTitle).toBe('互动式摄影曝光学习工具');
    expect(getTranslation('ja').appTitle).toBe('写真を学ぼう');
    expect(getTranslation('ko').appTitle).toBe('사진 배우기');
    expect(getTranslation('en').appTitle).toBe(
      'Interactive Photography Exposure Learning Tool',
    );

    expect(getTranslation('ja').modes.effects).toBe('効果を学ぶ');
    expect(getTranslation('ko').modes.exposure).toBe('노출 배우기');
    expect(getTranslation('en').modes.effects).toBe('Learn Effects');
  });

  it('localizes exposure status labels', () => {
    expect(getTranslation('zh').exposureStatus.normal.label).toBe('正常曝光');
    expect(getTranslation('ja').exposureStatus.normal.label).toBe('適正露出');
    expect(getTranslation('ko').exposureStatus.normal.label).toBe('적정 노출');
    expect(getTranslation('en').exposureStatus.normal.label).toBe('Good Exposure');
  });

  it('localizes the canvas preview label for assistive technology', () => {
    expect(getTranslation('zh').canvasLabel).toBe('曝光三要素 Canvas 预览');
    expect(getTranslation('ja').canvasLabel).toBe('露出三要素のCanvasプレビュー');
    expect(getTranslation('ko').canvasLabel).toBe('노출 세 요소 Canvas 미리보기');
    expect(getTranslation('en').canvasLabel).toBe('Exposure triangle canvas preview');
  });
});
