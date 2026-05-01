// src/app/components/build-list.ts v3.2.0
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ConfigComponent } from '../types';
import { CurrencyPipe } from '@angular/common';
import { TPipe } from '../services/i18n';
import { LoadingIndicatorComponent } from './loading-indicator';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-build-list',
  imports: [CurrencyPipe, TPipe, LoadingIndicatorComponent],
  template: `
  <aside class="w-full md:w-80 border-l border-zinc-800 flex flex-col bg-[#0a0a0b] h-full" id="config-panel">
    <div class="p-6 border-b border-zinc-800 flex items-center justify-between">
      <h2 class="text-xs font-semibold uppercase tracking-widest text-zinc-400">{{ 'build.title' | t }}</h2>
      <span class="px-2 py-0.5 bg-zinc-800 rounded text-[9px] text-zinc-400">{{ components().length }}{{ 'build.components' | t }}</span>
    </div>
    
    <div class="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
      @for (comp of components(); track comp.id) {
        <div class="flex flex-col gap-1" [id]="'item-' + comp.id">
          <div class="flex justify-between items-center">
            <span class="text-[9px] uppercase text-zinc-500 font-bold tracking-widest">{{ comp.category }}</span>
            <span class="text-[9px] text-zinc-600">{{ comp.weight }}g</span>
          </div>
          <div class="flex justify-between items-start gap-2">
            <div class="text-xs text-white max-w-[150px] break-words">{{ comp.name }}</div>
            <div class="flex items-center gap-2">
              <button 
                (click)="edit.emit(comp)"
                class="text-[9px] text-zinc-500 hover:text-amber-500 transition-colors cursor-pointer bg-transparent border-none px-1 py-0.5 rounded hover:bg-zinc-800"
                [attr.aria-label]="'build.edit_component' | t">
                {{ 'build.edit_component' | t }}
              </button>
              <div class="text-[10px] text-zinc-500">{{ comp.price | currency:'USD':'symbol':'1.0-0' }}</div>
            </div>
          </div>
          <div class="h-px w-full bg-zinc-900 mt-2"></div>
        </div>
      }
    </div>
    
    <!-- Action Buttons -->
    <div class="p-6 flex flex-col gap-3 border-t border-zinc-800 bg-[#0a0a0b]">
      <button 
        (click)="sync.emit()"
        [disabled]="isSaving()"
        class="w-full py-3 bg-white text-black text-xs font-bold uppercase tracking-widest rounded hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2" 
        id="btn-sync-firebase">
        <app-loading-indicator [isLoading]="isSaving()" message="" wrapperClass="text-black"></app-loading-indicator>
        @if (!isSaving()) {
          {{ 'build.sync' | t }}
        } @else {
          {{ 'build.saving' | t }}
        }
      </button>
      <button 
        (click)="deploy.emit()"
        class="w-full py-3 bg-zinc-900 text-zinc-400 text-xs font-bold uppercase tracking-widest rounded border border-zinc-800 hover:text-white transition-colors cursor-pointer" 
        id="btn-deploy">
        {{ 'build.deploy' | t }}
      </button>
      <div class="mt-4 flex items-center justify-center gap-2">
        <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        <span class="text-[10px] text-zinc-500 font-mono">{{ 'build.edge_ready' | t }}</span>
      </div>
    </div>
  </aside>
  `
})
export class BuildListComponent {
  components = input<ConfigComponent[]>([]);
  isSaving = input<boolean>(false);
  
  sync = output<void>();
  deploy = output<void>();
  edit = output<ConfigComponent>();
}
