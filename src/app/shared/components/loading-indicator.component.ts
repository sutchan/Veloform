// src/app/shared/components/loading-indicator.component.ts - 重构版本 v3.3.0
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-loading-indicator',
  imports: [],
  template: `
  @if (isLoading()) {
    <div class="flex items-center justify-center gap-2" [class]="wrapperClass()">
      <div class="inline-flex items-center justify-center">
        <div class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
      </div>
      @if (message()) {
        <span class="text-sm font-medium">{{ message() }}</span>
      }
    </div>
  }
  `,
  styles: [`
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    
    .animate-spin {
      animation: spin 1s linear infinite;
    }
  `]
})
export class LoadingIndicatorComponent {
  isLoading = input<boolean>(false);
  message = input<string>('');
  wrapperClass = input<string>('text-zinc-400');
}
