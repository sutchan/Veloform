// src/app/shared/components/confirm-dialog.component.ts - 重构版本 v3.3.0
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

export interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

class ConfirmDialogService {
  private _isOpen = signal(false);
  private _options = signal<ConfirmDialogOptions | null>(null);
  private resolveCallback: ((value: boolean) => void) | null = null;

  readonly isOpen = this._isOpen.asReadonly();
  readonly options = this._options.asReadonly();

  confirm(options: ConfirmDialogOptions): Promise<boolean> {
    return new Promise((resolve) => {
      this._options.set(options);
      this._isOpen.set(true);
      this.resolveCallback = resolve;
    });
  }

  confirmAction() {
    this.resolveCallback?.(true);
    this.close();
  }

  cancelAction() {
    this.resolveCallback?.(false);
    this.close();
  }

  private close() {
    this._isOpen.set(false);
    this._options.set(null);
    this.resolveCallback = null;
  }
}

export const confirmDialogService = new ConfirmDialogService();

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-confirm-dialog',
  imports: [],
  template: `
  @if (confirmDialogService.isOpen()) {
    <div id="confirm-dialog-overlay" class="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" role="presentation">
      <div id="confirm-dialog-modal" class="bg-[#1a1a1b] border border-zinc-700 rounded-lg shadow-2xl max-w-sm w-full mx-4 animate-in fade-in zoom-in-95" role="alertdialog" aria-modal="true" aria-labelledby="dialog-title" aria-describedby="dialog-message">
        <div id="dialog-content" class="p-5 sm:p-6">
          <h2 id="dialog-title" class="text-base sm:text-lg font-semibold text-white mb-2">
            {{ confirmDialogService.options()?.title }}
          </h2>
          <p id="dialog-message" class="text-zinc-400 text-sm leading-relaxed">
            {{ confirmDialogService.options()?.message }}
          </p>
        </div>
        
        <div id="dialog-actions" class="flex gap-2 sm:gap-3 px-5 sm:px-6 pb-5 sm:pb-6">
          <button 
            id="dialog-cancel-btn"
            (click)="confirmDialogService.cancelAction()"
            class="flex-1 px-4 py-2.5 sm:py-2 bg-zinc-800 text-zinc-300 text-sm font-medium rounded hover:bg-zinc-700 transition-colors cursor-pointer touch-target">
            {{ confirmDialogService.options()?.cancelText || 'Cancel' }}
          </button>
          <button 
            id="dialog-confirm-btn"
            (click)="confirmDialogService.confirmAction()"
            class="flex-1 px-4 py-2.5 sm:py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors cursor-pointer touch-target">
            {{ confirmDialogService.options()?.confirmText || 'Confirm' }}
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
