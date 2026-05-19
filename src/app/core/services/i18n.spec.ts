// src/app/core/services/i18n.spec.ts v3.3.1
import { describe, it, expect, beforeEach } from 'vitest';
import { i18nService, currentLang, toggleLang, t } from './i18n.service';

describe('I18n Service', () => {
  beforeEach(() => {
    i18nService.setLanguage('en');
  });

  describe('Translation integrity', () => {
    it('should return translation for existing key', () => {
      expect(t('nav.configurator')).toBe('Configurator');
    });

    it('should return key itself for missing translation', () => {
      expect(t('nonexistent.key')).toBe('nonexistent.key');
    });
  });

  describe('Language switching', () => {
    it('should start with English as default', () => {
      expect(currentLang()).toBe('en');
    });

    it('should toggle from English to Chinese', () => {
      toggleLang();
      expect(currentLang()).toBe('zh-CN');
    });

    it('should toggle back to English', () => {
      i18nService.setLanguage('zh-CN');
      toggleLang();
      expect(currentLang()).toBe('en');
    });

    it('should toggle multiple times correctly', () => {
      toggleLang();
      expect(currentLang()).toBe('zh-CN');

      toggleLang();
      expect(currentLang()).toBe('en');

      toggleLang();
      expect(currentLang()).toBe('zh-CN');
    });
  });

  describe('Translation keys', () => {
    it('should have navigation translations', () => {
      expect(t('nav.configurator')).toBe('Configurator');
      expect(t('nav.library')).toBe('Library');
      expect(t('nav.specs')).toBe('Specs');
      expect(t('nav.deployment')).toBe('Deployment');
      expect(t('nav.theme')).toBe('Theme');
      expect(t('nav.language')).toBe('Language');
    });

    it('should have sidebar translations', () => {
      expect(t('sidebar.road')).toBe('Road');
      expect(t('sidebar.mtb')).toBe('MTB');
      expect(t('sidebar.fold')).toBe('Fold');
    });

    it('should have Chinese translations', () => {
      i18nService.setLanguage('zh-CN');
      expect(t('sidebar.road')).toBe('公路车');
      expect(t('sidebar.mtb')).toBe('山地车');
      expect(t('sidebar.fold')).toBe('折叠车');
    });
  });

  describe('Computed properties', () => {
    it('should correctly report isEnglish', () => {
      i18nService.setLanguage('en');
      expect(i18nService.isEnglish()).toBe(true);
      expect(i18nService.isChinese()).toBe(false);
    });

    it('should correctly report isChinese', () => {
      i18nService.setLanguage('zh-CN');
      expect(i18nService.isEnglish()).toBe(false);
      expect(i18nService.isChinese()).toBe(true);
    });
  });
});
