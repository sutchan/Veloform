// src/app/app.ts v3.0.0
import { ChangeDetectionStrategy, Component, computed, signal, OnInit, effect } from '@angular/core';
import { NavbarComponent } from './components/navbar';
import { DecimalPipe } from '@angular/common';
import { SidebarComponent } from './components/sidebar';
import { PreviewComponent } from './components/preview';
import { BuildListComponent } from './components/build-list';
import { Configuration, ConfigComponent } from './types';
import { saveConfiguration, auth, getUserConfigurations, deleteConfiguration, getComponentsFromDB } from './services/firebase';
import { TPipe } from './services/i18n';
import { onAuthStateChanged } from 'firebase/auth';

const ROAD_DEFAULTS: ConfigComponent[] = [
  { id: '1', category: 'Drivetrain', name: 'Shimano Dura-Ace Di2 R9200', price: 4200, weight: 2430 },
  { id: '2', category: 'Wheelset', name: 'Roval Rapide CLX II', price: 2800, weight: 1520 },
  { id: '3', category: 'Cockpit', name: 'Roval Rapide Cockpit', price: 600, weight: 310 },
  { id: '4', category: 'Tires', name: 'Turbo Cotton 28mm', price: 180, weight: 480 },
];

const MTB_DEFAULTS: ConfigComponent[] = [
  { id: '5', category: 'Drivetrain', name: 'SRAM XX1 Eagle AXS', price: 2500, weight: 1515 },
  { id: '6', category: 'Suspension', name: 'Fox 34 Float Factory', price: 1050, weight: 1738 },
  { id: '7', category: 'Wheelset', name: 'Reserve 30|SL', price: 1800, weight: 1650 },
  { id: '8', category: 'Tires', name: 'Maxxis Rekon 2.4', price: 160, weight: 1600 },
];

const FOLD_DEFAULTS: ConfigComponent[] = [
  { id: '9', category: 'Drivetrain', name: 'Brompton 6-Speed', price: 400, weight: 1200 },
  { id: '10', category: 'Frame', name: 'Titanium Main Frame', price: 2100, weight: 1800 },
  { id: '11', category: 'Wheelset', name: 'Brompton Superlight', price: 800, weight: 1100 },
];

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [NavbarComponent, SidebarComponent, PreviewComponent, BuildListComponent, TPipe, DecimalPipe],
  styleUrl: './style.css',
  template: `
  <div class="bg-[#0a0a0b] text-zinc-300 font-sans w-full h-screen overflow-hidden flex flex-col relative">
    <app-navbar (openLibrary)="showLibrary.set(true)"></app-navbar>

    <main class="flex flex-1 overflow-hidden flex-col md:flex-row relative">
      <!-- Hidden on small screens, can implement a mobile drawer if needed -->
      <app-sidebar class="hidden md:flex h-full" [activeType]="activeType()" (typeSelected)="onTypeSelected($event)"></app-sidebar>
      
      <!-- Mobile Category Selector -->
      <div class="flex md:hidden w-full border-b border-zinc-800 bg-[#0c0c0d] p-2 gap-2 justify-center">
        @for (type of bikeTypes; track type) {
          <button 
            (click)="onTypeSelected(type)" 
            class="px-4 py-2 text-xs font-bold uppercase rounded-lg border border-zinc-800"
            [class.bg-zinc-800]="activeType() === type"
            [class.text-white]="activeType() === type"
            [class.text-zinc-500]="activeType() !== type">
            {{ type === 'Road' ? ('sidebar.road' | t) : type === 'MTB' ? ('sidebar.mtb' | t) : ('sidebar.fold' | t) }}
          </button>
        }
      </div>

      <div class="flex flex-col md:flex-row flex-1 overflow-hidden relative">
        <app-preview 
          class="flex-1 h-[50vh] md:h-full relative flex flex-col z-10 border-b md:border-b-0 md:border-r border-zinc-800 shadow-2xl"
          [name]="configName()" 
          [type]="activeType()"
          [weight]="totalWeight()" 
          [cost]="totalCost()">
        </app-preview>
        
        <app-build-list 
          class="h-[50vh] md:h-full shrink-0 relative z-10 bg-[#0a0a0b]"
          [components]="components()" 
          [isSaving]="isSaving()"
          (sync)="onSync()" 
          (deploy)="onDeploy()">
        </app-build-list>

        @if (showLibrary()) {
          <div class="absolute inset-0 z-50 bg-[#0a0a0b]/90 backdrop-blur-xl p-10 flex flex-col pt-10" id="library-modal">
            <div class="flex justify-between items-center mb-10 w-full mx-auto">
              <h2 class="text-3xl font-light text-white">Your Garage</h2>
              <button (click)="showLibrary.set(false)" class="p-2 hover:bg-zinc-800 rounded-full cursor-pointer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="stroke-white" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
            
            <div class="w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto">
              @if (!isLoggedIn()) {
                <div class="col-span-full text-center text-zinc-500 py-20">Please log in to view your garage.</div>
              } @else if (myConfigs().length === 0) {
                <div class="col-span-full text-center text-zinc-500 py-20">No saved builds yet. Make something cool!</div>
              } @else {
                @for (cfg of myConfigs(); track cfg.id) {
                  <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-600 transition-colors cursor-pointer group" (click)="loadConfig(cfg)" (keydown.enter)="loadConfig(cfg)" tabindex="0">
                    <div class="flex justify-between items-start mb-4">
                      <div>
                        <div class="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">{{ cfg.bikeType }}</div>
                        <h3 class="text-xl font-medium text-white group-hover:text-amber-500 transition-colors">{{ cfg.name }}</h3>
                      </div>
                      <button (click)="removeConfig(cfg.id, $event)" class="text-zinc-600 hover:text-red-500 p-1 cursor-pointer bg-transparent border-none">
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
  activeType = signal<'Road' | 'MTB' | 'Fold'>('Road');
  components = signal<ConfigComponent[]>(ROAD_DEFAULTS);
  isSaving = signal(false);
  configId = signal<string | null>(null);
  manualConfigName = signal<string | null>(null);

  allDbComponents = signal<ConfigComponent[]>([]);

  showLibrary = signal(false);
  myConfigs = signal<Configuration[]>([]);
  isLoggedIn = signal(false);

  configName = computed(() => {
    if (this.manualConfigName()) return this.manualConfigName()!;
    switch(this.activeType()) {
      case 'Road': return 'S-Works Tarmac SL8';
      case 'MTB': return 'Epic World Cup';
      case 'Fold': return 'Brompton T Line';
    }
  });

  constructor() {
    onAuthStateChanged(auth, (u) => {
      this.isLoggedIn.set(!!u);
      if (u && this.showLibrary()) {
        this.fetchMyConfigs();
      }
    });

    effect(() => {
      // Refresh configs when library opens
      if (this.showLibrary() && this.isLoggedIn()) {
         this.fetchMyConfigs();
      }
    });
  }

  async ngOnInit() {
    this.allDbComponents.set(await getComponentsFromDB());
    // Auto-populate based on DB if we want, but defaults are fine too
  }

  async fetchMyConfigs() {
    this.myConfigs.set(await getUserConfigurations());
  }

  totalCost = computed(() => this.components().reduce((acc, c) => acc + c.price, 0));
  
  baseWeight = computed(() => {
    switch(this.activeType()) {
      case 'Road': return 900;
      case 'MTB': return 1800;
      case 'Fold': return 2000;
    }
  });

  totalWeight = computed(() => {
    const compWeight = this.components().reduce((acc, c) => acc + c.weight, 0);
    return (this.baseWeight() + compWeight) / 1000; // in kg
  });

  onTypeSelected(type: 'Road' | 'MTB' | 'Fold') {
    this.activeType.set(type);
    this.configId.set(null);
    this.manualConfigName.set(null);
    
    // Attempt to pull from DB if downloaded
    const dbFiltered = this.allDbComponents().filter(c => c.bikeType === type);
    
    if (dbFiltered.length > 0) {
      this.components.set(dbFiltered);
    } else {
      switch(type) {
        case 'Road': this.components.set(ROAD_DEFAULTS); break;
        case 'MTB': this.components.set(MTB_DEFAULTS); break;
        case 'Fold': this.components.set(FOLD_DEFAULTS); break;
      }
    }
  }

  loadConfig(cfg: Configuration) {
    this.activeType.set(cfg.bikeType as 'Road'|'MTB'|'Fold');
    this.manualConfigName.set(cfg.name);
    this.components.set(cfg.components);
    this.configId.set(cfg.id || null);
    this.showLibrary.set(false);
  }

  async removeConfig(id: string | undefined, event: Event) {
    event.stopPropagation();
    if (!id) return;
    if (confirm('Delete this build?')) {
      await deleteConfiguration(id);
      await this.fetchMyConfigs();
      if (this.configId() === id) {
        this.configId.set(null); 
        this.onTypeSelected(this.activeType()); // Reset to defaults
      }
    }
  }

  async onSync() {
    if (!auth.currentUser) {
      alert('Please login first to sync configuration.');
      return;
    }
    
    this.isSaving.set(true);
    
    const config: Configuration = {
      id: this.configId() || undefined,
      bikeType: this.activeType(),
      name: this.configName(),
      components: this.components(),
      totalCost: this.totalCost(),
      estimatedWeight: this.totalWeight(),
    };

    try {
      const newId = await saveConfiguration(config);
      this.configId.set(newId);
      console.log('Saved configuration successfully!');
    } catch (e) {
      console.error('Failed to sync', e);
    } finally {
      this.isSaving.set(false);
    }
  }

  onDeploy() {
    console.log('Mock: Deploying to Vercel...');
    alert('Deployment initiated to Vercel (Mock). Production build triggered.');
  }
}
