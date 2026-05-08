// src/app/components/sidebar.ts v3.2.0
import { ChangeDetectionStrategy, Component, output, input } from '@angular/core';
import { TPipe } from '../services/i18n';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-sidebar',
  imports: [TPipe],
  template: `
  <aside class="w-20 border-r border-zinc-800 flex flex-col items-center py-8 gap-10 bg-[#0c0c0d]" id="category-sidebar">
    <div (click)="selectType('Road')" (keydown.enter)="selectType('Road')" tabindex="0" class="group cursor-pointer flex flex-col items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl" [class.opacity-40]="activeType() !== 'Road'">
      <div class="p-3 rounded-xl transition-all group-hover:bg-zinc-700" [class.bg-zinc-800]="activeType() === 'Road'" [class.text-white]="activeType() === 'Road'" [class.bg-transparent]="activeType() !== 'Road'" [class.text-zinc-400]="activeType() !== 'Road'">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </div>
      <span class="text-[9px] uppercase tracking-tighter" [class.text-white]="activeType() === 'Road'" [class.text-zinc-500]="activeType() !== 'Road'">{{ 'sidebar.road' | t }}</span>
    </div>
    
    <div (click)="selectType('MTB')" (keydown.enter)="selectType('MTB')" tabindex="0" class="group cursor-pointer flex flex-col items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl" [class.opacity-40]="activeType() !== 'MTB'">
      <div class="p-3 rounded-xl transition-all group-hover:bg-zinc-700" [class.bg-zinc-800]="activeType() === 'MTB'" [class.text-white]="activeType() === 'MTB'" [class.bg-transparent]="activeType() !== 'MTB'" [class.text-zinc-400]="activeType() !== 'MTB'">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="m16 10-4 4-4-4"/></svg>
      </div>
      <span class="text-[9px] uppercase tracking-tighter" [class.text-white]="activeType() === 'MTB'" [class.text-zinc-500]="activeType() !== 'MTB'">{{ 'sidebar.mtb' | t }}</span>
    </div>
    
    <div (click)="selectType('Fold')" (keydown.enter)="selectType('Fold')" tabindex="0" class="group cursor-pointer flex flex-col items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl" [class.opacity-40]="activeType() !== 'Fold'">
      <div class="p-3 rounded-xl transition-all group-hover:bg-zinc-700" [class.bg-zinc-800]="activeType() === 'Fold'" [class.text-white]="activeType() === 'Fold'" [class.bg-transparent]="activeType() !== 'Fold'" [class.text-zinc-400]="activeType() !== 'Fold'">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 7h-9m3 3-3-3 3-3M4 17h9m-3 3 3-3-3-3"/></svg>
      </div>
      <span class="text-[9px] uppercase tracking-tighter" [class.text-white]="activeType() === 'Fold'" [class.text-zinc-500]="activeType() !== 'Fold'">{{ 'sidebar.fold' | t }}</span>
    </div>
  </aside>
  `
})
export class SidebarComponent {
  activeType = input<'Road' | 'MTB' | 'Fold'>('Road');
  typeSelected = output<'Road' | 'MTB' | 'Fold'>();

  selectType(type: 'Road' | 'MTB' | 'Fold') {
    this.typeSelected.emit(type);
  }
}
