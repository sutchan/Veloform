// src/app/features/configurator/services/config.service.ts - 重构版本 v3.3.0
import { onAuthStateChanged } from 'firebase/auth';
import { Configuration, ConfigComponent } from '../../../core/models/types';
import { configStore } from '../../../core/stores/config.store';
import { firebaseService } from '../../../core/services/firebase.service';
import { configRepository } from '../../../core/services/config.repository';
import { notificationService } from '../../../core/services/notification.service';
import { t } from '../../../core/services/i18n.service';

class ConfigService {
  private authInitialized = false;

  initAuthListener() {
    if (this.authInitialized) return;
    this.authInitialized = true;

    onAuthStateChanged(firebaseService.auth, (user) => {
      configStore.setIsLoggedIn(!!user);
    });
  }

  async initializeApp() {
    this.initAuthListener();
    const { getComponentsFromDB } = await import('../../../core/services/component.repository');
    const components = await getComponentsFromDB();
    configStore.setAllDbComponents(components);
  }

  async saveCurrentConfig(): Promise<string | null> {
    if (!configStore.isLoggedIn()) {
      notificationService.error(t('auth.login_required'));
      return null;
    }

    configStore.setIsSaving(true);

    const config: Configuration = {
      id: configStore.configId() || undefined,
      bikeType: configStore.activeType(),
      name: configStore.configName(),
      components: configStore.components(),
      totalCost: configStore.totalCost(),
      estimatedWeight: configStore.totalWeight(),
    };

    try {
      const newId = await configRepository.save(config);
      configStore.setConfigId(newId);
      await this.refreshMyConfigs();
      return newId;
    } catch (error) {
      console.error('Failed to save configuration:', error);
      return null;
    } finally {
      configStore.setIsSaving(false);
    }
  }

  async refreshMyConfigs() {
    const configs = await configRepository.getUserConfigs();
    configStore.setMyConfigs(configs);
  }

  async removeConfig(id: string): Promise<boolean> {
    try {
      await configRepository.delete(id);
      await this.refreshMyConfigs();
      
      if (configStore.configId() === id) {
        configStore.resetToDefaults();
      }
      return true;
    } catch (error) {
      console.error('Failed to delete configuration:', error);
      return false;
    }
  }

  updateComponent(newComponent: ConfigComponent) {
    const oldComponentId = configStore.editingComponentId();
    configStore.replaceComponent(oldComponentId, newComponent);
    configStore.setShowComponentSelector(false);
    notificationService.success(`${newComponent.name}`, 2000);
  }

  openComponentEditor(component: ConfigComponent) {
    configStore.setEditingComponentId(component.id);
    configStore.setShowComponentSelector(true);
  }

  onTypeSelected(type: 'Road' | 'MTB' | 'Fold') {
    configStore.setActiveType(type);
  }

  loadConfiguration(cfg: Configuration) {
    configStore.loadConfiguration(cfg);
  }

  toggleLibrary(show?: boolean) {
    configStore.setShowLibrary(show ?? !configStore.showLibrary());
    if (configStore.showLibrary() && configStore.isLoggedIn()) {
      this.refreshMyConfigs();
    }
  }

  onDeploy() {
    notificationService.info('Deployment initiated to Vercel (Mock). Production build triggered.', 4000);
  }
}

export const configService = new ConfigService();
