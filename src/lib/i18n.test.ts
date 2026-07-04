import { describe, expect, it } from 'vitest';
import { LANGUAGES, getTranslation } from './i18n';

describe('i18n translations', () => {
  it('offers Chinese, Japanese, and Korean language choices', () => {
    expect(LANGUAGES.map((language) => language.code)).toEqual(['zh', 'ja', 'ko']);
  });

  it('localizes the core app title and mode labels', () => {
    expect(getTranslation('zh').appTitle).toBe('摄影大学习');
    expect(getTranslation('ja').appTitle).toBe('写真を学ぼう');
    expect(getTranslation('ko').appTitle).toBe('사진 배우기');

    expect(getTranslation('ja').modes.effects).toBe('効果を学ぶ');
    expect(getTranslation('ko').modes.exposure).toBe('노출 배우기');
  });

  it('localizes exposure status labels', () => {
    expect(getTranslation('zh').exposureStatus.normal.label).toBe('正常曝光');
    expect(getTranslation('ja').exposureStatus.normal.label).toBe('適正露出');
    expect(getTranslation('ko').exposureStatus.normal.label).toBe('적정 노출');
  });
});
