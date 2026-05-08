// src/app/app.ts v3.2.0 - Refactored with ConfigStore and ConfigService
import { ChangeDetectionStrategy, Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from './components/navbar';
import { DecimalPipe } from '@angular/common';
import { SidebarComponent } from './components/sidebar';
import { PreviewComponent } from './components/preview';
import { BuildListComponent } from './components/build-list';
import { NotificationDisplayComponent } from './components/notification-display';
import { ConfirmDialogComponent, confirmDialogService } from './components/confirm-dialog';
import { ComponentSelectorComponent } from './components/component-selector';
import { ConfigComponent, Configuration } from './types';
import { auth } from './services/firebase';
import { TPipe, t } from './services/i18n';
import { configStore } from './services/config.store';
import { configService } from './services/config.service';

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

  <div class="bg-[#0a0a0b] text-zinc-300 font-sans w-full h-screen overflow-hidden flex flex-col relative">
    <app-navbar (openLibrary)="onOpenLibrary()"></app-navbar>

    <main class="flex flex-1 overflow-hidden flex-col md:flex-row relative">
      <app-sidebar class="hidden md:flex h-full" [activeType]="configStore.activeType()" (typeSelected)="onTypeSelected($event)"></app-sidebar>

      <div class="flex md:hidden w-full border-b border-zinc-800 bg-[#0c0c0d] p-2 gap-2 justify-center">
        @for (type of bikeTypes; track type) {
          <button
            (click)="onTypeSelected(type)"
            class="px-4 py-2 text-xs font-bold uppercase rounded-lg border border-zinc-800"
            [class.bg-zinc-800]="configStore.activeType() === type"
            [class.text-white]="configStore.activeType() === type"
            [class.text-zinc-500]="configStore.activeType() !== type">
            {{ type === 'Road' ? ('sidebar.road' | t) : type === 'MTB' ? ('sidebar.mtb' | t) : ('sidebar.fold' | t) }}
          </button>
        }
      </div>

      <div class="flex flex-col md:flex-row flex-1 overflow-hidden relative">
        <app-preview
          class="flex-1 h-[50vh] md:h-full relative flex flex-col z-10 border-b md:border-b-0 md:border-r border-zinc-800 shadow-2xl"
          [name]="configStore.configName()"
          [type]="configStore.activeType()"
          [weight]="configStore.totalWeight()"
          [cost]="configStore.totalCost()">
        </app-preview>

        <app-build-list
          class="h-[50vh] md:h-full shrink-0 relative z-10 bg-[#0a0a0b]"
          [components]="configStore.components()"
          [isSaving]="configStore.isSaving()"
          (sync)="onSync()"
          (deploy)="onDeploy()"
          (edit)="onEditComponent($event)">
        </app-build-list>

        @if (configStore.showLibrary()) {
          <div class="absolute inset-0 z-50 bg-[#0a0a0b]/90 backdrop-blur-xl p-10 flex flex-col pt-10" id="library-modal">
            <div class="flex justify-between items-center mb-10 w-full mx-auto">
              <h2 class="text-3xl font-light text-white">{{ 'library.title' | t }}</h2>
              <button (click)="onCloseLibrary()" class="p-2 hover:bg-zinc-800 rounded-full cursor-pointer" [attr.aria-label]="'library.close' | t">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="stroke-white" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <div class="w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto">
              @if (!configStore.isLoggedIn()) {
                <div class="col-span-full text-center text-zinc-500 py-20">{{ 'library.login_required' | t }}</div>
              } @else if (configStore.myConfigs().length === 0) {
                <div class="col-span-full text-center text-zinc-500 py-20">{{ 'library.no_builds' | t }}</div>
              } @else {
                @for (cfg of configStore.myConfigs(); track cfg.id) {
                  <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-600 transition-colors cursor-pointer group" (click)="loadConfig(cfg)" (keydown.enter)="loadConfig(cfg)" tabindex="0">
                    <div class="flex justify-between items-start mb-4">
                      <div>
                        <div class="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">{{ ('bike_type.' + cfg.bikeType.toLowerCase()) | t }}</div>
                        <h3 class="text-xl font-medium text-white group-hover:text-amber-500 transition-colors">{{ cfg.name }}</h3>
                      </div>
                      <button (click)="removeConfig(cfg.id, $event)" class="text-zinc-600 hover:text-red-500 p-1 cursor-pointer bg-transparent border-none" [attr.aria-label]="'library.delete' | t">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    </div>
                    <div class="flex justify-between items-baseline mt-6 pt-4 border-t border-zinc-800">
                      <div class="text-sm text-zinc-400">{{ cfg.estimatedWeight | number:'1.2-2' }} kg</div>
                      <div class="text-lg text-white font-mono">\${{ cfg.totalCost | number:'1.0-0' }}</div>
                    </div>
                  </div>
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
