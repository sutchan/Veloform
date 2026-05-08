// src/app/core/services/i18n.service.ts - 重构版本 v3.3.0
import { Pipe, PipeTransform, signal, computed } from '@angular/core';

export type SupportedLang = 'en' | 'zh-CN';

type TranslationKey = string;
type TranslationMap = Record<TranslationKey, string>;

const translations: Record<SupportedLang, TranslationMap> = {
  'en': {
    'nav.configurator': 'Configurator',
    'nav.library': 'Library',
    'nav.specs': 'Specs',
    'nav.deployment': 'Deployment',
    'nav.theme': 'Theme',
    'nav.language': 'Language',
    'nav.project_id': 'Project ID',
    'nav.login': 'Login',
    'sidebar.road': 'Road',
    'sidebar.mtb': 'MTB',
    'sidebar.fold': 'Fold',
    'preview.v_custom': 'Custom Configuration',
    'preview.est_weight': 'Estimated Weight',
    'preview.aero_drag': 'Aerodynamic Drag',
    'preview.total_cost': 'Total Build Cost',
    'build.title': 'Build List',
    'build.components': ' components',
    'build.sync': 'Sync to Firebase',
    'build.saving': 'Saving...',
    'build.deploy': 'Deploy to Vercel',
    'build.edge_ready': 'EdgeOne: Ready',
    'library.title': 'Your Garage',
    'library.close': 'Close',
    'library.login_required': 'Please log in to view your garage.',
    'library.no_builds': 'No saved builds yet. Make something cool!',
    'library.delete': 'Delete',
    'library.confirm_delete_title': 'Delete Build',
    'library.confirm_delete_message': 'Are you sure you want to delete this build? This action cannot be undone.',
    'library.cancel': 'Cancel',
    'bike_type.road': 'Road',
    'bike_type.mtb': 'MTB',
    'bike_type.fold': 'Fold',
    'bike.name.road': 'S-Works Tarmac SL8',
    'bike.name.mtb': 'Epic World Cup',
    'bike.name.fold': 'Brompton T Line',
    'selector.title': 'Select Component',
    'selector.category': 'Category',
    'selector.close': 'Close',
    'selector.current': 'Current',
    'selector.no_components': 'No components available for this category.',
    'selector.cancel': 'Cancel',
    'build.edit_component': 'Edit',
    'auth.login_required': 'Please log in to save configurations.'
  },
  'zh-CN': {
    'nav.configurator': '装车配置',
    'nav.library': '方案库',
    'nav.specs': '规格',
    'nav.deployment': '部署',
    'nav.theme': '主题',
    'nav.language': '语言',
    'nav.project_id': '项目 ID',
    'nav.login': '登录',
    'sidebar.road': '公路车',
    'sidebar.mtb': '山地车',
    'sidebar.fold': '折叠车',
    'preview.v_custom': '自定义配置',
    'preview.est_weight': '预估重量',
    'preview.aero_drag': '风阻系数',
    'preview.total_cost': '整车造价',
    'build.title': '配置清单',
    'build.components': '个组件',
    'build.sync': '同步到 Firebase',
    'build.saving': '保存中...',
    'build.deploy': '部署至 Vercel',
    'build.edge_ready': 'EdgeOne: 就绪',
    'library.title': '我的车库',
    'library.close': '关闭',
    'library.login_required': '请登录以查看您的车库。',
    'library.no_builds': '暂无保存的配置。开始创建吧！',
    'library.delete': '删除',
    'library.confirm_delete_title': '删除配置',
    'library.confirm_delete_message': '确定要删除此配置吗？此操作无法撤销。',
    'library.cancel': '取消',
    'bike_type.road': '公路车',
    'bike_type.mtb': '山地车',
    'bike_type.fold': '折叠车',
    'bike.name.road': 'S-Works Tarmac SL8',
    'bike.name.mtb': 'Epic World Cup',
    'bike.name.fold': 'Brompton T Line',
    'selector.title': '选择组件',
    'selector.category': '类别',
    'selector.close': '关闭',
    'selector.current': '当前',
    'selector.no_components': '此类别下没有可用组件。',
    'selector.cancel': '取消',
    'build.edit_component': '编辑',
    'auth.login_required': '请登录以保存配置。'
  }
};

class I18nService {
  private _currentLang = signal<SupportedLang>('en');

  readonly currentLang = computed(() => this._currentLang());
  readonly isEnglish = computed(() => this._currentLang() === 'en');
  readonly isChinese = computed(() => this._currentLang() === 'zh-CN');

  toggle() {
    this._currentLang.update(lang => lang === 'en' ? 'zh-CN' : 'en');
  }

  setLanguage(lang: SupportedLang) {
    this._currentLang.set(lang);
  }

  translate(key: string): string {
    return translations[this._currentLang()][key] || key;
  }

  getAvailableKeys(): TranslationKey[] {
    return Object.keys(translations['en']);
  }
}

export const i18nService = new I18nService();

export function t(key: string): string {
  return i18nService.translate(key);
}

export const currentLang = i18nService.currentLang;

export function toggleLang() {
  i18nService.toggle();
}

@Pipe({
  name: 't',
  pure: false
})
export class TPipe implements PipeTransform {
  transform(key: string): string {
    return i18nService.translate(key);
  }
}
