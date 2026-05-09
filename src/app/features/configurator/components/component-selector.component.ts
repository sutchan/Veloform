// src/app/features/configurator/components/component-selector.component.ts - 重构版本 v3.3.0
import { ChangeDetectionStrategy, Component, input, output, signal, computed } from '@angular/core';
import { ConfigComponent, BikeType } from '../../../core/models/types';
import { CurrencyPipe } from '@angular/common';
import { TPipe } from '../../../core/services/i18n.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-component-selector',
  imports: [CurrencyPipe, TPipe],
  template: `
    <div id="component-selector-overlay" class="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" 
         (click)="close.emit()" role="dialog" aria-modal="true" aria-labelledby="selector-title">
      <div id="component-selector-modal" class="bg-[#0c0c0d] border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[85vh] sm:max-h-[80vh] flex flex-col overflow-hidden"
           (click)="$event.stopPropagation()">
        
        <header id="selector-header" class="p-4 sm:p-6 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div id="selector-title-group">
            <h2 id="selector-title" class="text-lg sm:text-xl font-medium text-white">{{ 'selector.title' | t }}</h2>
            <p id="selector-category" class="text-xs text-zinc-500 mt-1">{{ 'selector.category' | t }}: {{ selectedCategory() }}</p>
          </div>
          <button id="selector-close-btn" (click)="close.emit()" 
                  class="p-2 hover:bg-zinc-800 rounded-full transition-colors cursor-pointer touch-target"
                  [attr.aria-label]="'selector.close' | t">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </header>

        <nav id="filter-tabs" class="flex gap-2 p-3 sm:p-4 border-b border-zinc-800 overflow-x-auto hide-scrollbar shrink-0" role="tablist" aria-label="Filter by category">
          @for (category of availableCategories(); track category) {
            <button 
              id="filter-tab-{{ category.toLowerCase() }}"
              role="tab"
              [attr.aria-selected]="selectedCategory() === category"
              (click)="selectedCategory.set(category)"
              class="px-3 sm:px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer touch-target"
              [class.bg-zinc-800]="selectedCategory() === category"
              [class.text-white]="selectedCategory() === category"
              [class.text-zinc-500]="selectedCategory() !== category"
              [class.border-zinc-700]="selectedCategory() === category"
              [class.border]="selectedCategory() === category">
              {{ category }}
            </button>
          }
        </nav>

        <main id="selector-content" class="flex-1 overflow-y-auto p-3 sm:p-4">
          @if (filteredComponents().length === 0) {
            <div id="selector-empty" class="text-center text-zinc-500 py-8 sm:py-12">
              <p class="text-sm sm:text-base">{{ 'selector.no_components' | t }}</p>
            </div>
          } @else {
            <div id="components-grid" class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              @for (comp of filteredComponents(); track comp.id) {
                <article id="selector-card-{{ comp.id }}" 
                  class="bg-zinc-900 border border-zinc-800 rounded-xl p-3 sm:p-4 hover:border-zinc-600 transition-all cursor-pointer group"
                  [class.border-amber-500]="isCurrentComponent(comp.id)"
                  (click)="selectComponent(comp)"
                  (keydown.enter)="selectComponent(comp)"
                  tabindex="0"
                  role="button">
                  
                  <div id="card-header-{{ comp.id }}" class="flex justify-between items-start mb-2">
                    <span id="card-category-{{ comp.id }}" class="text-[10px] uppercase text-zinc-500 font-bold tracking-wider">{{ comp.category }}</span>
                    @if (isCurrentComponent(comp.id)) {
                      <span id="card-current-badge-{{ comp.id }}" class="text-[9px] text-amber-500 font-medium">{{ 'selector.current' | t }}</span>
                    }
                  </div>
                  
                  <h3 id="card-name-{{ comp.id }}" class="text-sm font-medium text-white group-hover:text-amber-500 transition-colors mb-2">
                    {{ comp.name }}
                  </h3>
                  
                  @if (comp.specs) {
                    <p id="card-specs-{{ comp.id }}" class="text-[10px] text-zinc-500 mb-2 sm:mb-3">{{ comp.specs }}</p>
                  }
                  
                  <div id="card-footer-{{ comp.id }}" class="flex justify-between items-center pt-2 border-t border-zinc-800">
                    <span id="card-weight-{{ comp.id }}" class="text-xs text-zinc-400">{{ comp.weight }}g</span>
                    <span id="card-price-{{ comp.id }}" class="text-sm text-white font-mono">{{ comp.price | currency:'USD':'symbol':'1.0-0' }}</span>
                  </div>
                </article>
              }
            </div>
          }
        </main>

        <footer id="selector-footer" class="p-3 sm:p-4 border-t border-zinc-800 bg-[#0c0c0d] shrink-0">
          <button 
            id="cancel-btn"
            (click)="close.emit()"
            class="w-full py-3 bg-zinc-800 text-zinc-400 text-xs sm:text-sm font-bold uppercase tracking-widest rounded-lg hover:bg-zinc-700 hover:text-white transition-colors cursor-pointer touch-target">
            {{ 'selector.cancel' | t }}
          </button>
        </footer>
      </div>
    </div>
  `
})
export class ComponentSelectorComponent {
  allComponents = input<ConfigComponent[]>([]);
  currentComponentId = input<string>('');
  bikeType = input<BikeType>('Road');
  
  close = output<void>();
  select = output<ConfigComponent>();
  
  selectedCategory = signal<string>('All');
  
  availableCategories = computed(() => {
    const categories = new Set(this.allComponents()
      .filter(c => c.bikeType === this.bikeType())
      .map(c => c.category));
    return ['All', ...Array.from(categories).sort()];
  });
  
  filteredComponents = computed(() => {
    const components = this.allComponents().filter(c => c.bikeType === this.bikeType());
    if (this.selectedCategory() === 'All') {
      return components;
    }
    return components.filter(c => c.category === this.selectedCategory());
  });
  
  isCurrentComponent(id: string): boolean {
    return this.currentComponentId() === id;
  }
  
  selectComponent(component: ConfigComponent) {
    this.select.emit(component);
  }
}
