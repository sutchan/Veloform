// src/app/components/navbar.ts v3.2.0
import { ChangeDetectionStrategy, Component, signal, output } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { User } from 'firebase/auth';
import { auth, loginWithGoogle } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { TPipe, toggleLang, currentLang } from '../services/i18n';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-navbar',
  imports: [UpperCasePipe, TPipe],
  template: `
  <nav class="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-[#0a0a0b]" id="main-nav">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 bg-zinc-100 rounded flex items-center justify-center">
        <div class="w-4 h-4 border-2 border-[#0a0a0b] rotate-45"></div>
      </div>
      <span class="text-white font-bold tracking-widest text-xl uppercase">Veloform</span>
    </div>
    <div class="flex gap-8 text-xs font-medium uppercase tracking-widest hidden md:flex">
      <a href="#" class="text-white border-b border-white pb-1">{{ 'nav.configurator' | t }}</a>
      <a href="#" (click)="$event.preventDefault(); openLibrary.emit()" class="hover:text-white text-zinc-500 transition-colors">{{ 'nav.library' | t }}</a>
      <a href="#" class="hover:text-white text-zinc-500 transition-colors">{{ 'nav.specs' | t }}</a>
      <a href="#" class="hover:text-white text-zinc-500 transition-colors">{{ 'nav.deployment' | t }}</a>
    </div>
    <div class="flex items-center gap-4">
      <div class="text-right hidden sm:block">
        <div class="text-[10px] text-zinc-500 uppercase tracking-tighter leading-none">{{ 'nav.theme' | t }}</div>
        <button (click)="toggleTheme()" class="text-xs font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer">{{ isDark() ? 'Dark' : 'Light' }}</button>
      </div>
      <div class="text-right hidden sm:block">
        <div class="text-[10px] text-zinc-500 uppercase tracking-tighter leading-none">{{ 'nav.language' | t }}</div>
        <button (click)="switchLang()" class="text-xs font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer">{{ lang() === 'en' ? 'English' : '中文' }}</button>
      </div>
      <div class="text-right hidden sm:block" id="user-profile-container">
        <div class="text-[10px] text-zinc-500 uppercase tracking-tighter leading-none">{{ 'nav.project_id' | t }}</div>
        <div class="text-xs font-mono text-zinc-300">VF-992-ROAD</div>
      </div>
      @if (user()) {
        <div class="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white text-xs overflow-hidden">
          @if (user()?.photoURL) {
            <img [src]="user()?.photoURL" alt="User Avatar" class="w-full h-full object-cover" referrerpolicy="no-referrer" />
          } @else {
            {{ user()?.email?.charAt(0) | uppercase }}
          }
        </div>
      } @else {
        <button (click)="login()" class="px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-widest rounded hover:bg-zinc-200 transition-colors cursor-pointer">{{ 'nav.login' | t }}</button>
      }
    </div>
  </nav>
  `
})
export class NavbarComponent {
  user = signal<User | null>(null);
  isDark = signal(true);
  lang = currentLang;
  openLibrary = output<void>();

  constructor() {
    onAuthStateChanged(auth, (u) => {
      this.user.set(u);
    });
    
    // Initialize theme based on current DOM if available
    if (typeof document !== 'undefined') {
      this.isDark.set(document.documentElement.classList.contains('dark'));
    }
  }

  toggleTheme() {
    this.isDark.update(d => !d);
    if (typeof document !== 'undefined') {
      if (this.isDark()) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }

  switchLang() {
    toggleLang();
  }

  async login() {
    await loginWithGoogle();
  }
}
