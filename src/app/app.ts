// src/app/app.ts - 重构版本 v3.3.0
import { ChangeDetectionStrategy, Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from './features/navbar/components/navbar.component';
import { DecimalPipe } from '@angular/common';
import { SidebarComponent } from './shared/components/sidebar.component';
import { PreviewComponent } from './features/configurator/components/preview.component';
import { BuildListComponent } from './features/configurator/components/build-list.component';
import { NotificationDisplayComponent } from './shared/components/notification-display.component';
import { ConfirmDialogComponent, confirmDialogService } from './shared/components/confirm-dialog.component';
import { ComponentSelectorComponent } from './features/configurator/components/component-selector.component';
import { ConfigComponent, Configuration } from './core/models/types';
import { auth } from './core/services/firebase.service';
import { TPipe, t } from './core/services/i18n.service';
import { configStore } from './core/stores/config.store';
import { configService } from './features/configurator/services/config.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [NavbarComponent, SidebarComponent, PreviewComponent, BuildListComponent, NotificationDisplayComponent, ConfirmDialogComponent, ComponentSelectorComponent, TPipe, DecimalPipe],
  styleUrl: './style.css',
  template: `
  <app-notification-display></app-notification-display>
  <app-confirm-dialog></app-confirm-dialog>

  @if (configStore.showComponentSelector()) {
    <app-component-selector
      [allComponents]="configStore.allDbComponents()"
      [currentComponentId]="configStore.editingComponentId()"
      [bikeType]="configStore.activeType()"
      (close)="configStore.setShowComponentSelector(false)"
      (select)="onComponentSelected($event)">
    </app-component-selector>
  }

  <div id="app-container" class="bg-[#0a0a0b] text-zinc-300 font-sans w-full h-screen overflow-hidden flex flex-col relative">
    <header id="header-container">
      <app-navbar id="app-navbar" (openLibrary)="onOpenLibrary()"></app-navbar>
    </header>

    <main id="main-content" class="flex flex-1 overflow-hidden flex-col lg:flex-row relative">
      <nav id="sidebar-nav" class="hidden lg:flex h-full" aria-label="Bike type selector">
        <app-sidebar class="hidden lg:flex h-full" [activeType]="configStore.activeType()" (typeSelected)="onTypeSelected($event)"></app-sidebar>
      </nav>

      <div id="mobile-bike-selector" class="lg:hidden w-full border-b border-zinc-800 bg-[#0c0c0d] p-3 gap-2 flex justify-center" role="tablist" aria-label="Select bike type">
        @for (type of bikeTypes; track type) {
          <button
            role="tab"
            [attr.aria-selected]="configStore.activeType() === type"
            (click)="onTypeSelected(type)"
            class="px-5 py-2.5 text-xs font-bold uppercase rounded-lg border transition-all duration-200 touch-target"
            [class.bg-amber-500]="configStore.activeType() === type"
            [class.border-amber-500]="configStore.activeType() === type"
            [class.text-black]="configStore.activeType() === type"
            [class.bg-transparent]="configStore.activeType() !== type"
            [class.border-zinc-700]="configStore.activeType() !== type"
            [class.text-zinc-400]="configStore.activeType() !== type">
            {{ type === 'Road' ? ('sidebar.road' | t) : type === 'MTB' ? ('sidebar.mtb' | t) : ('sidebar.fold' | t) }}
          </button>
        }
      </div>

      <div id="content-area" class="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
        <section id="preview-section" class="flex-1 h-[45vh] lg:h-full relative flex flex-col z-10 border-b lg:border-b-0 lg:border-r border-zinc-800 shadow-2xl" aria-label="Bike preview">
          <app-preview
            [name]="configStore.configName()"
            [type]="configStore.activeType()"
            [weight]="configStore.totalWeight()"
            [cost]="configStore.totalCost()">
          </app-preview>
        </section>

        <aside id="config-panel" class="h-[55vh] lg:h-full lg:w-96 shrink-0 relative z-10 bg-[#0a0a0b]" aria-label="Configuration panel">
          <app-build-list
            [components]="configStore.components()"
            [isSaving]="configStore.isSaving()"
            (sync)="onSync()"
            (deploy)="onDeploy()"
            (edit)="onEditComponent($event)">
          </app-build-list>
        </aside>

        @if (configStore.showLibrary()) {
          <div id="library-modal" class="absolute inset-0 z-50 bg-[#0a0a0b]/90 backdrop-blur-xl p-4 sm:p-6 lg:p-10 flex flex-col pt-12 lg:pt-10" role="dialog" aria-modal="true" aria-labelledby="library-title">
            <div id="library-header" class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 lg:mb-10 w-full mx-auto max-w-7xl">
              <h2 id="library-title" class="text-2xl sm:text-3xl font-light text-white">{{ 'library.title' | t }}</h2>
              <button id="library-close-btn" (click)="onCloseLibrary()" class="p-3 hover:bg-zinc-800 rounded-full cursor-pointer transition-colors touch-target" [attr.aria-label]="'library.close' | t">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="stroke-white" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <div id="library-content" class="w-full mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 overflow-y-auto flex-1">
              @if (!configStore.isLoggedIn()) {
                <div id="library-login-prompt" class="col-span-full text-center text-zinc-500 py-12 sm:py-20">
                  <p class="text-sm sm:text-base">{{ 'library.login_required' | t }}</p>
                </div>
              } @else if (configStore.myConfigs().length === 0) {
                <div id="library-empty-state" class="col-span-full text-center text-zinc-500 py-12 sm:py-20">
                  <p class="text-sm sm:text-base">{{ 'library.no_builds' | t }}</p>
                </div>
              } @else {
                @for (cfg of configStore.myConfigs(); track cfg.id) {
                  <article id="config-card-{{ cfg.id }}" class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6 hover:border-zinc-600 transition-all cursor-pointer group" (click)="loadConfig(cfg)" (keydown.enter)="loadConfig(cfg)" tabindex="0" role="button">
                    <div id="card-header-{{ cfg.id }}" class="flex justify-between items-start mb-4">
                      <div>
                        <div id="card-type-{{ cfg.id }}" class="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">{{ ('bike_type.' + cfg.bikeType.toLowerCase()) | t }}</div>
                        <h3 id="card-name-{{ cfg.id }}" class="text-base sm:text-xl font-medium text-white group-hover:text-amber-500 transition-colors">{{ cfg.name }}</h3>
                      </div>
                      <button id="delete-btn-{{ cfg.id }}" (click)="removeConfig(cfg.id, $event)" class="text-zinc-600 hover:text-red-500 p-2 cursor-pointer bg-transparent border-none touch-target" [attr.aria-label]="'library.delete' | t">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    </div>
                    <div id="card-stats-{{ cfg.id }}" class="flex justify-between items-baseline mt-4 sm:mt-6 pt-4 border-t border-zinc-800">
                      <div id="card-weight-{{ cfg.id }}" class="text-xs sm:text-sm text-zinc-400">{{ cfg.estimatedWeight | number:'1.2-2' }} kg</div>
                      <div id="card-cost-{{ cfg.id }}" class="text-base sm:text-lg text-white font-mono">\${{ cfg.totalCost | number:'1.0-0' }}</div>
                    </div>
                  </article>
                }
              }
            </div>
          </div>
        }
      </div>
    </main>
  </div>
  `
})
export class App implements OnInit {
  bikeTypes = ['Road', 'MTB', 'Fold'] as const;
  configStore = configStore;

  constructor(private router: Router) {
    effect(() => {
      const loggedIn = configStore.isLoggedIn();
      if (loggedIn && configStore.showLibrary()) {
        configService.refreshMyConfigs();
      }
    });
  }

  async ngOnInit() {
    await configService.initializeApp();
  }

  onTypeSelected(type: 'Road' | 'MTB' | 'Fold') {
    configService.onTypeSelected(type);
  }

  onOpenLibrary() {
    configService.toggleLibrary(true);
  }

  onCloseLibrary() {
    configService.toggleLibrary(false);
  }

  loadConfig(cfg: Configuration) {
    configService.loadConfiguration(cfg);
    if (cfg.id) {
      this.router.navigate(['/config', cfg.id]);
    }
  }

  async removeConfig(id: string | undefined, event: Event) {
    event.stopPropagation();
    if (!id) return;

    const confirmed = await confirmDialogService.confirm({
      title: 'library.confirm_delete_title',
      message: 'library.confirm_delete_message',
      confirmText: 'library.delete',
      cancelText: 'library.cancel'
    });

    if (!confirmed) return;
    await configService.removeConfig(id);
  }

  async onSync() {
    const newId = await configService.saveCurrentConfig();
    if (newId) {
      this.router.navigate(['/config', newId]);
    }
  }

  onDeploy() {
    configService.onDeploy();
  }

  onEditComponent(component: ConfigComponent) {
    configService.openComponentEditor(component);
  }

  onComponentSelected(newComponent: ConfigComponent) {
    configService.updateComponent(newComponent);
  }
}
