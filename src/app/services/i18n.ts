// src/app/services/i18n.ts v3.1.1 - Internationalization service
/**
 * Supported languages for the application
 */
import { Pipe, PipeTransform, signal } from '@angular/core';

export type SupportedLang = 'en' | 'zh-CN';

export const translations: Record<SupportedLang, Record<string, string>> = {
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
    'selector.all': 'All',
    'selector.category.frame': 'Frame',
    'selector.category.drivetrain': 'Drivetrain',
    'selector.category.wheelset': 'Wheelset',
    'selector.category.suspension': 'Suspension',
    'selector.category.cockpit': 'Cockpit',
    'selector.category.tires': 'Tires',
    'build.edit_component': 'Edit',
    'auth.login_required': 'Please log in to save configurations.',
    'confirm.ok': 'OK',
    'confirm.cancel': 'Cancel',
    'confirm.yes': 'Yes',
    'confirm.no': 'No'
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
    'selector.all': '全部',
    'selector.category.frame': '车架',
    'selector.category.drivetrain': '传动系统',
    'selector.category.wheelset': '轮组',
    'selector.category.suspension': '悬挂',
    'selector.category.cockpit': '操控组件',
    'selector.category.tires': '轮胎',
    'build.edit_component': '编辑',
    'auth.login_required': '请登录以保存配置。',
    'confirm.ok': '确定',
    'confirm.cancel': '取消',
    'confirm.yes': '是',
    'confirm.no': '否'
  }
};

export const currentLang = signal<SupportedLang>('en');

export function toggleLang() {
  currentLang.update(l => l === 'en' ? 'zh-CN' : 'en');
}

export function t(key: string): string {
  return translations[currentLang()][key] || key;
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
