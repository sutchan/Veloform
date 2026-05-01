// src/app/components/component-selector.ts v3.2.0 - Component selector modal for editing bike parts
import { ChangeDetectionStrategy, Component, input, output, signal, computed } from '@angular/core';
import { ConfigComponent, BikeType } from '../types';
import { CurrencyPipe } from '@angular/common';
import { TPipe } from '../services/i18n';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-component-selector',
  imports: [CurrencyPipe, TPipe],
  template: `
    <div class="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" 
         (click)="close.emit()">
      <div class="bg-[#0c0c0d] border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
           (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="p-6 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-medium text-white">{{ 'selector.title' | t }}</h2>
            <p class="text-xs text-zinc-500 mt-1">{{ 'selector.category' | t }}: {{ selectedCategory() }}</p>
          </div>
          <button (click)="close.emit()" 
                  class="p-2 hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
                  [attr.aria-label]="'selector.close' | t">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Filter Tabs -->
        <div class="flex gap-2 p-4 border-b border-zinc-800 overflow-x-auto">
          @for (category of availableCategories(); track category) {
            <button 
              (click)="selectedCategory.set(category)"
              class="px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer"
              [class.bg-zinc-800]="selectedCategory() === category"
              [class.text-white]="selectedCategory() === category"
              [class.text-zinc-500]="selectedCategory() !== category"
              [class.border-zinc-700]="selectedCategory() === category"
              [class.border]="selectedCategory() === category">
              {{ getCategoryLabel(category) }}
            </button>
          }
        </div>

        <!-- Component List -->
        <div class="flex-1 overflow-y-auto p-4">
          @if (filteredComponents().length === 0) {
            <div class="text-center text-zinc-500 py-12">
              <p>{{ 'selector.no_components' | t }}</p>
            </div>
          } @else {
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              @for (comp of filteredComponents(); track comp.id) {
                <div 
                  class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-600 transition-all cursor-pointer group"
                  [class.border-amber-500]="isCurrentComponent(comp.id)"
                  (click)="selectComponent(comp)"
                  (keydown.enter)="selectComponent(comp)"
                  tabindex="0">
                  
                  <div class="flex justify-between items-start mb-2">
                    <span class="text-[10px] uppercase text-zinc-500 font-bold tracking-wider">{{ comp.category }}</span>
                    @if (isCurrentComponent(comp.id)) {
                      <span class="text-[9px] text-amber-500 font-medium">{{ 'selector.current' | t }}</span>
                    }
                  </div>
                  
                  <h3 class="text-sm font-medium text-white group-hover:text-amber-500 transition-colors mb-2">
                    {{ comp.name }}
                  </h3>
                  
                  @if (comp.specs) {
                    <p class="text-[10px] text-zinc-500 mb-3">{{ comp.specs }}</p>
                  }
                  
                  <div class="flex justify-between items-center pt-2 border-t border-zinc-800">
                    <span class="text-xs text-zinc-400">{{ comp.weight }}g</span>
                    <span class="text-sm text-white font-mono">{{ comp.price | currency:'USD':'symbol':'1.0-0' }}</span>
                  </div>
                </div>
              }
            </div>
          }
        </div>

        <!-- Footer -->
        <div class="p-4 border-t border-zinc-800 bg-[#0c0c0d] rounded-b-2xl">
          <button 
            (click)="close.emit()"
            class="w-full py-3 bg-zinc-800 text-zinc-400 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-zinc-700 hover:text-white transition-colors cursor-pointer">
            {{ 'selector.cancel' | t }}
          </button>
        </div>
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
  
  getCategoryLabel(category: string): string {
    // Simple mapping - could be enhanced with i18n
    return category;
  }
}
