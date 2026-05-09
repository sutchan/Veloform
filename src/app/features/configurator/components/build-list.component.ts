// src/app/features/configurator/components/build-list.component.ts - 重构版本 v3.3.0
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ConfigComponent } from '../../../core/models/types';
import { CurrencyPipe } from '@angular/common';
import { TPipe } from '../../../core/services/i18n.service';
import { LoadingIndicatorComponent } from '../../../shared/components/loading-indicator.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-build-list',
  imports: [CurrencyPipe, TPipe, LoadingIndicatorComponent],
  template: `
  <div id="build-list-container" class="w-full md:w-80 lg:w-96 h-full flex flex-col bg-[#0a0a0b]">
    <div id="build-list-header" class="p-4 sm:p-6 border-b border-zinc-800 flex items-center justify-between">
      <h2 id="build-list-title" class="text-xs font-semibold uppercase tracking-widest text-zinc-400">{{ 'build.title' | t }}</h2>
      <span id="build-list-count" class="px-2 py-0.5 bg-zinc-800 rounded text-[9px] text-zinc-400">{{ components().length }}{{ 'build.components' | t }}</span>
    </div>
    
    <div id="components-list" class="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4 sm:gap-5" role="list" aria-label="Bike components">
      @for (comp of components(); track comp.id) {
        <article id="component-item-{{ comp.id }}" class="flex flex-col gap-1" role="listitem">
          <div id="component-header-{{ comp.id }}" class="flex justify-between items-center">
            <span id="component-category-{{ comp.id }}" class="text-[9px] uppercase text-zinc-500 font-bold tracking-widest">{{ comp.category }}</span>
            <span id="component-weight-{{ comp.id }}" class="text-[9px] text-zinc-600">{{ comp.weight }}g</span>
          </div>
          <div id="component-content-{{ comp.id }}" class="flex justify-between items-start gap-2">
            <div id="component-name-{{ comp.id }}" class="text-xs text-white max-w-[120px] sm:max-w-[150px] break-words">{{ comp.name }}</div>
            <div id="component-actions-{{ comp.id }}" class="flex items-center gap-2">
              <button 
                id="edit-btn-{{ comp.id }}"
                (click)="edit.emit(comp)"
                class="text-[9px] text-zinc-500 hover:text-amber-500 transition-colors cursor-pointer bg-transparent border-none px-1 py-0.5 rounded hover:bg-zinc-800 touch-target"
                [attr.aria-label]="'build.edit_component' | t">
                {{ 'build.edit_component' | t }}
              </button>
              <div id="component-price-{{ comp.id }}" class="text-[10px] text-zinc-500">{{ comp.price | currency:'USD':'symbol':'1.0-0' }}</div>
            </div>
          </div>
          <div id="component-divider-{{ comp.id }}" class="h-px w-full bg-zinc-900 mt-2"></div>
        </article>
      }
    </div>
    
    <div id="action-buttons" class="p-4 sm:p-6 flex flex-col gap-3 border-t border-zinc-800 bg-[#0a0a0b]">
      <button 
        id="btn-sync"
        (click)="sync.emit()"
        [disabled]="isSaving()"
        class="w-full py-3 bg-white text-black text-xs font-bold uppercase tracking-widest rounded hover:bg-zinc-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 touch-target" 
        aria-label="Sync configuration to cloud">
        <app-loading-indicator [isLoading]="isSaving()" message="" wrapperClass="text-black"></app-loading-indicator>
        @if (!isSaving()) {
          <span id="sync-text">{{ 'build.sync' | t }}</span>
        } @else {
          <span id="saving-text">{{ 'build.saving' | t }}</span>
        }
      </button>
      <button 
        id="btn-deploy"
        (click)="deploy.emit()"
        class="w-full py-3 bg-zinc-900 text-zinc-400 text-xs font-bold uppercase tracking-widest rounded border border-zinc-800 hover:text-white hover:border-zinc-600 transition-all duration-200 cursor-pointer touch-target" 
        aria-label="Deploy configuration">
        <span id="deploy-text">{{ 'build.deploy' | t }}</span>
      </button>
      <div id="status-indicator" class="mt-3 sm:mt-4 flex items-center justify-center gap-2">
        <span id="status-dot" class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        <span id="status-text" class="text-[10px] text-zinc-500 font-mono">{{ 'build.edge_ready' | t }}</span>
      </div>
    </div>
  </div>
  `
})
export class BuildListComponent {
  components = input<ConfigComponent[]>([]);
  isSaving = input<boolean>(false);
  
  sync = output<void>();
  deploy = output<void>();
  edit = output<ConfigComponent>();
}
