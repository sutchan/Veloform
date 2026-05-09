// src/app/shared/components/sidebar.component.ts - 重构版本 v3.3.0
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TPipe } from '../../core/services/i18n.service';
import { BikeType } from '../../core/models/types';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-sidebar',
  imports: [TPipe],
  template: `
  <aside id="bike-type-selector" class="w-16 lg:w-20 border-r border-zinc-800 flex flex-col items-center py-6 lg:py-8 bg-[#0c0c0d]" role="navigation" aria-label="Bike type selection">
    <div id="sidebar-label" class="text-[9px] lg:text-[10px] uppercase tracking-widest text-zinc-500 mb-6 lg:mb-8">{{ 'sidebar.road' | t }}</div>
    <nav id="bike-type-buttons" class="flex flex-col gap-3 lg:gap-4" role="tablist" aria-label="Bike types">
      @for (type of bikeTypes; track type) {
        <button 
          id="bike-type-btn-{{ type.toLowerCase() }}"
          role="tab"
          [attr.aria-selected]="activeType() === type"
          (click)="typeSelected.emit(type)"
          class="w-12 h-12 lg:w-14 lg:h-14 rounded-xl border transition-all duration-200 flex items-center justify-center group touch-target"
          [class.border-amber-500]="activeType() === type"
          [class.bg-zinc-900]="activeType() === type"
          [class.border-zinc-800]="activeType() !== type"
          [class.hover:border-zinc-600]="activeType() !== type">
          <span id="bike-type-label-{{ type.toLowerCase() }}"
                class="text-[10px] lg:text-[11px] uppercase tracking-wider font-bold transition-colors"
                [class.text-amber-500]="activeType() === type"
                [class.text-zinc-500]="activeType() !== type"
                [class.group-hover:text-zinc-300]="activeType() !== type">
            {{ getTypeLabel(type) }}
          </span>
        </button>
      }
    </nav>
  </aside>
  `
})
export class SidebarComponent {
  activeType = input<BikeType>('Road');
  typeSelected = output<BikeType>();

  bikeTypes: BikeType[] = ['Road', 'MTB', 'Fold'];

  getTypeLabel(type: BikeType): string {
    const labels: Record<BikeType, string> = {
      'Road': 'R',
      'MTB': 'M',
      'Fold': 'F'
    };
    return labels[type];
  }
}
