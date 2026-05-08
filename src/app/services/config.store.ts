// src/app/services/config.store.ts v3.2.0 - Signal-based configuration state management
import { computed, signal } from '@angular/core';
import { ConfigComponent, Configuration, BikeType } from '../types';
import { ROAD_DEFAULTS, MTB_DEFAULTS, FOLD_DEFAULTS } from '../app.constants';
import { currentLang, translations } from './i18n';

export interface ConfigState {
  activeType: BikeType;
  components: ConfigComponent[];
  configId: string | null;
  manualConfigName: string | null;
  allDbComponents: ConfigComponent[];
  showLibrary: boolean;
  myConfigs: Configuration[];
  isLoggedIn: boolean;
  isSaving: boolean;
  showComponentSelector: boolean;
  editingComponentId: string;
}

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

export class ConfigStore {
  private state = signal<ConfigState>({ ...DEFAULT_STATE });

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

  readonly configName = computed(() => {
    const manual = this.state().manualConfigName;
    if (manual) return manual;
    const lang = currentLang();
    const key = this.state().activeType === 'Road' ? 'bike.name.road' : 
                this.state().activeType === 'MTB' ? 'bike.name.mtb' : 'bike.name.fold';
    return translations[lang][key] || key;
  });

  readonly totalCost = computed(() =>
    this.state().components.reduce((acc: number, c: ConfigComponent) => acc + c.price, 0)
  );

  readonly baseWeight = computed(() => {
    switch (this.state().activeType) {
      case 'Road': return 900;
      case 'MTB': return 1800;
      case 'Fold': return 2000;
      default: return 900;
    }
  });

  readonly totalWeight = computed(() => {
    const compWeight = this.state().components.reduce((acc: number, c: ConfigComponent) => acc + c.weight, 0);
    return (this.baseWeight() + compWeight) / 1000;
  });

  private getDefaultsForType(type: BikeType): ConfigComponent[] {
    switch (type) {
      case 'Road': return [...ROAD_DEFAULTS];
      case 'MTB': return [...MTB_DEFAULTS];
      case 'Fold': return [...FOLD_DEFAULTS];
    }
  }

  setActiveType(type: BikeType) {
    this.state.update(s => ({
      ...s,
      activeType: type,
      configId: null,
      manualConfigName: null,
    }));
    const dbFiltered = this.state().allDbComponents.filter((c: ConfigComponent) => c.bikeType === type);
    this.state.update(s => ({
      ...s,
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

export const configStore = new ConfigStore();
