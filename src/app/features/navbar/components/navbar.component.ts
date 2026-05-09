// src/app/features/navbar/components/navbar.component.ts - 重构版本 v3.3.0
import { ChangeDetectionStrategy, Component, signal, output } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { User } from 'firebase/auth';
import { auth, firebaseService } from '../../../core/services/firebase.service';
import { onAuthStateChanged } from 'firebase/auth';
import { TPipe, i18nService } from '../../../core/services/i18n.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-navbar',
  imports: [UpperCasePipe, TPipe],
  template: `
  <nav id="main-nav" class="h-14 sm:h-16 border-b border-zinc-800 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-[#0a0a0b]" role="navigation" aria-label="Main navigation">
    <a id="logo-link" href="/" class="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity" aria-label="Veloform Home">
      <img id="logo-image" src="/logo.svg" alt="Veloform Logo" class="w-7 h-7 sm:w-8 sm:h-8" width="32" height="32" />
      <span id="logo-text" class="text-white font-bold tracking-wider sm:tracking-widest text-base sm:text-xl uppercase">Veloform</span>
    </a>
    
    <div id="desktop-nav-links" class="hidden md:flex gap-6 lg:gap-8 text-xs font-medium uppercase tracking-widest">
      <a id="nav-configurator" href="#" class="text-white border-b border-white pb-1">{{ 'nav.configurator' | t }}</a>
      <a id="nav-library" href="#" (click)="$event.preventDefault(); openLibrary.emit()" class="hover:text-white text-zinc-500 transition-colors">{{ 'nav.library' | t }}</a>
      <a id="nav-specs" href="#" class="hover:text-white text-zinc-500 transition-colors">{{ 'nav.specs' | t }}</a>
      <a id="nav-deployment" href="#" class="hover:text-white text-zinc-500 transition-colors">{{ 'nav.deployment' | t }}</a>
    </div>

    <div id="controls-container" class="flex items-center gap-2 sm:gap-4">
      <div id="theme-control" class="text-right hidden xs:block">
        <div id="theme-label" class="text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-tighter leading-none">{{ 'nav.theme' | t }}</div>
        <button id="theme-toggle" (click)="toggleTheme()" class="text-xs font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer">{{ isDark() ? 'Dark' : 'Light' }}</button>
      </div>
      
      <div id="language-control" class="text-right hidden xs:block">
        <div id="language-label" class="text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-tighter leading-none">{{ 'nav.language' | t }}</div>
        <button id="language-toggle" (click)="switchLang()" class="text-xs font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer">{{ i18nService.isEnglish() ? 'English' : '中文' }}</button>
      </div>
      
      <div id="project-id-control" class="text-right hidden sm:block">
        <div id="project-id-label" class="text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-tighter leading-none">{{ 'nav.project_id' | t }}</div>
        <div id="project-id-value" class="text-xs font-mono text-zinc-300">VF-992-ROAD</div>
      </div>

      @if (user()) {
        <div id="user-avatar-container" class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white text-xs overflow-hidden">
          @if (user()?.photoURL) {
            <img id="user-avatar" [src]="user()?.photoURL" alt="User Avatar" class="w-full h-full object-cover" referrerpolicy="no-referrer" />
          } @else {
            <span id="user-initial">{{ user()?.email?.charAt(0) | uppercase }}</span>
          }
        </div>
      } @else {
        <button id="login-btn" (click)="login()" class="px-3 sm:px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-wider rounded hover:bg-zinc-200 transition-colors cursor-pointer touch-target">{{ 'nav.login' | t }}</button>
      }
    </div>
  </nav>
  `
})
export class NavbarComponent {
  user = signal<User | null>(null);
  isDark = signal(true);
  i18nService = i18nService;
  openLibrary = output<void>();

  constructor() {
    onAuthStateChanged(auth, (u) => {
      this.user.set(u);
    });
    
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
    i18nService.toggle();
  }

  async login() {
    await firebaseService.loginWithGoogle();
  }
}
