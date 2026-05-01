// src/app/services/i18n.ts v3.1.0
import { Pipe, PipeTransform, signal } from '@angular/core';

export type SupportedLang = 'en' | 'zh-CN';

const translations: Record<SupportedLang, Record<string, string>> = {
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
    'build.components': 'COMPONENTS',
    'build.sync': 'Sync to Firebase',
    'build.saving': 'Saving...',
    'build.deploy': 'Deploy to Vercel',
    'build.edge_ready': 'EdgeOne: Ready'
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
    'build.edge_ready': 'EdgeOne: 就绪'
  }
};

export const currentLang = signal<SupportedLang>('en');

export function toggleLang() {
  currentLang.update(l => l === 'en' ? 'zh-CN' : 'en');
}

@Pipe({
  name: 't',
  pure: false
})
export class TPipe implements PipeTransform {
  transform(key: string): string {
    return translations[currentLang()][key] || key;
  }
}
