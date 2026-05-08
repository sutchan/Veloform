// src/app/core/stores/config.store.ts - 重构版本 v3.3.0
import { computed, signal } from '@angular/core';
import { ConfigComponent, Configuration, BikeType, ConfigState } from '../models/types';
import { ROAD_DEFAULTS, MTB_DEFAULTS, FOLD_DEFAULTS } from '../constants/app.constants';
import { i18nService } from '../services/i18n.service';

/**
 * 默认状态配置
 */
const DEFAULT_STATE: ConfigState = {
  activeType: 'Road',
  components: [...ROAD_DEFAULTS],
  configId: null,
  manualConfigName: null,
  allDbComponents: [],
  showLibrary: false,
  myConfigs: [],
  isLoggedIn: false,
  isSaving: false,
  showComponentSelector: false,
  editingComponentId: '',
};

/**
 * 配置状态存储
 * 使用 Angular Signals 管理应用状态
 */
class ConfigStore {
  private state = signal<ConfigState>({ ...DEFAULT_STATE });

  // 公开的只读信号
  readonly activeType = computed(() => this.state().activeType);
  readonly components = computed(() => this.state().components);
  readonly configId = computed(() => this.state().configId);
  readonly manualConfigName = computed(() => this.state().manualConfigName);
  readonly allDbComponents = computed(() => this.state().allDbComponents);
  readonly showLibrary = computed(() => this.state().showLibrary);
  readonly myConfigs = computed(() => this.state().myConfigs);
  readonly isLoggedIn = computed(() => this.state().isLoggedIn);
  readonly isSaving = computed(() => this.state().isSaving);
  readonly showComponentSelector = computed(() => this.state().showComponentSelector);
  readonly editingComponentId = computed(() => this.state().editingComponentId);

  // 计算属性
  readonly configName = computed(() => {
    const manual = this.state().manualConfigName;
    if (manual) return manual;
    
    const typeKey = this.state().activeType === 'Road' ? 'bike.name.road' : 
                   this.state().activeType === 'MTB' ? 'bike.name.mtb' : 'bike.name.fold';
    return i18nService.translate(typeKey);
  });

  readonly totalCost = computed(() =>
    this.state().components.reduce((acc: number, c: ConfigComponent) => acc + c.price, 0)
  );

  readonly totalWeight = computed(() => {
    const compWeight = this.state().components.reduce((acc: number, c: ConfigComponent) => acc + c.weight, 0);
    const baseWeight = this.state().activeType === 'Road' ? 900 : 
                       this.state().activeType === 'MTB' ? 1800 : 2000;
    return (baseWeight + compWeight) / 1000;
  });

  // 私有辅助方法
  private getDefaultsForType(type: BikeType): ConfigComponent[] {
    switch (type) {
      case 'Road': return [...ROAD_DEFAULTS];
      case 'MTB': return [...MTB_DEFAULTS];
      case 'Fold': return [...FOLD_DEFAULTS];
    }
  }

  // 状态更新方法
  setActiveType(type: BikeType) {
    const dbFiltered = this.state().allDbComponents.filter((c: ConfigComponent) => c.bikeType === type);
    
    this.state.update(s => ({
      ...s,
      activeType: type,
      configId: null,
      manualConfigName: null,
      components: dbFiltered.length > 0 ? dbFiltered : this.getDefaultsForType(type),
    }));
  }

  setComponents(components: ConfigComponent[]) {
    this.state.update(s => ({ ...s, components }));
  }

  setConfigId(id: string | null) {
    this.state.update(s => ({ ...s, configId: id }));
  }

  setManualConfigName(name: string | null) {
    this.state.update(s => ({ ...s, manualConfigName: name }));
  }

  setAllDbComponents(components: ConfigComponent[]) {
    this.state.update(s => ({ ...s, allDbComponents: components }));
  }

  setShowLibrary(show: boolean) {
    this.state.update(s => ({ ...s, showLibrary: show }));
  }

  setMyConfigs(configs: Configuration[]) {
    this.state.update(s => ({ ...s, myConfigs: configs }));
  }

  setIsLoggedIn(loggedIn: boolean) {
    this.state.update(s => ({ ...s, isLoggedIn: loggedIn }));
  }

  setIsSaving(saving: boolean) {
    this.state.update(s => ({ ...s, isSaving: saving }));
  }

  setShowComponentSelector(show: boolean) {
    this.state.update(s => ({ ...s, showComponentSelector: show }));
  }

  setEditingComponentId(id: string) {
    this.state.update(s => ({ ...s, editingComponentId: id }));
  }

  replaceComponent(oldId: string, newComponent: ConfigComponent) {
    this.state.update(s => ({
      ...s,
      components: s.components.map(c => c.id === oldId ? newComponent : c),
    }));
  }

  loadConfiguration(cfg: Configuration) {
    this.state.update(s => ({
      ...s,
      activeType: cfg.bikeType as BikeType,
      manualConfigName: cfg.name,
      components: cfg.components,
      configId: cfg.id || null,
      showLibrary: false,
    }));
  }

  resetToDefaults() {
    const type = this.state().activeType;
    this.state.update(s => ({
      ...s,
      components: this.getDefaultsForType(type),
      configId: null,
      manualConfigName: null,
    }));
  }

  getState(): ConfigState {
    return this.state();
  }
}

/**
 * 配置存储单例
 */
export const configStore = new ConfigStore();
