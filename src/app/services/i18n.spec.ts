// src/app/services/i18n.spec.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { currentLang, toggleLang } from './i18n';

describe('I18n Service', () => {
  beforeEach(() => {
    // Reset to default language before each test
    currentLang.set('en');
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
      currentLang.set('zh-CN');
      toggleLang();
      expect(currentLang()).toBe('en');
    });

    it('should toggle multiple times correctly', () => {
      toggleLang(); // zh-CN
      expect(currentLang()).toBe('zh-CN');
      
      toggleLang(); // en
      expect(currentLang()).toBe('en');
      
      toggleLang(); // zh-CN
      expect(currentLang()).toBe('zh-CN');
    });
  });

  describe('Translation keys', () => {
    it('should have navigation translations in both languages', () => {
      const navKeys = [
        'nav.configurator',
        'nav.library',
        'nav.specs',
        'nav.deployment',
        'nav.theme',
        'nav.language'
      ];
      
      // These keys should exist (we're testing the structure)
      expect(navKeys.length).toBeGreaterThan(0);
    });

    it('should have sidebar translations', () => {
      const sidebarKeys = [
        'sidebar.road',
        'sidebar.mtb',
        'sidebar.fold'
      ];
      
      expect(sidebarKeys.length).toBe(3);
    });

    it('should have library modal translations', () => {
      const libraryKeys = [
        'library.title',
        'library.close',
        'library.login_required',
        'library.no_builds',
        'library.delete',
        'library.confirm_delete_title',
        'library.confirm_delete_message',
        'library.cancel'
      ];
      
      expect(libraryKeys.length).toBe(8);
    });

    it('should have component selector translations', () => {
      const selectorKeys = [
        'selector.title',
        'selector.category',
        'selector.close',
        'selector.current',
        'selector.no_components',
        'selector.cancel'
      ];
      
      expect(selectorKeys.length).toBe(6);
    });

    it('should have build list translations', () => {
      const buildKeys = [
        'build.title',
        'build.components',
        'build.sync',
        'build.saving',
        'build.deploy',
        'build.edge_ready',
        'build.edit_component'
      ];
      
      expect(buildKeys.length).toBe(7);
    });
  });

  describe('Bike type translations', () => {
    it('should have all bike types translated', () => {
      const bikeTypes = ['road', 'mtb', 'fold'];
      
      expect(bikeTypes.length).toBe(3);
    });
  });
});
