// src/app/components/confirm-dialog.ts
import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';

export interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

class ConfirmDialogService {
  private isOpen = signal(false);
  private options = signal<ConfirmDialogOptions | null>(null);
  private resolveCallback: ((value: boolean) => void) | null = null;

  readonly isOpen$ = this.isOpen.asReadonly();
  readonly options$ = this.options.asReadonly();

  /**
   * Open confirmation dialog
   */
  confirm(options: ConfirmDialogOptions): Promise<boolean> {
    return new Promise((resolve) => {
      this.options.set(options);
      this.isOpen.set(true);
      this.resolveCallback = resolve;
    });
  }

  /**
   * Confirm action (OK)
   */
  confirmAction() {
    this.resolveCallback?.(true);
    this.close();
  }

  /**
   * Cancel action
   */
  cancelAction() {
    this.resolveCallback?.(false);
    this.close();
  }

  /**
   * Close dialog
   */
  private close() {
    this.isOpen.set(false);
    this.options.set(null);
    this.resolveCallback = null;
  }
}

// Singleton instance
export const confirmDialogService = new ConfirmDialogService();

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-confirm-dialog',
  imports: [],
  template: `
  @if (confirmDialogService.isOpen$()) {
    <div class="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm" id="confirm-dialog-overlay">
      <div class="bg-[#1a1a1b] border border-zinc-700 rounded-lg shadow-2xl max-w-sm mx-4 animate-in fade-in zoom-in-95" role="alertdialog">
        <div class="p-6">
          <h2 class="text-lg font-semibold text-white mb-2">
            {{ confirmDialogService.options$()?.title }}
          </h2>
          <p class="text-zinc-400 text-sm leading-relaxed">
            {{ confirmDialogService.options$()?.message }}
          </p>
        </div>
        
        <div class="flex gap-3 px-6 pb-6">
          <button 
            (click)="confirmDialogService.cancelAction()"
            class="flex-1 px-4 py-2 bg-zinc-800 text-zinc-300 text-sm font-medium rounded hover:bg-zinc-700 transition-colors cursor-pointer">
            {{ confirmDialogService.options$()?.cancelText || 'Cancel' }}
          </button>
          <button 
            (click)="confirmDialogService.confirmAction()"
            class="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors cursor-pointer">
            {{ confirmDialogService.options$()?.confirmText || 'Confirm' }}
          </button>
        </div>
      </div>
    </div>
  }
  `,
  styles: [`
    @keyframes zoom-in-95 {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    
    .zoom-in-95 {
      animation: zoom-in-95 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
  `]
})
export class ConfirmDialogComponent {
  confirmDialogService = confirmDialogService;
}
