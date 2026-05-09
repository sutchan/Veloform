// src/app/shared/components/notification-display.component.ts - 重构版本 v3.3.0
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { notificationService } from '../../core/services/notification.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-notification-display',
  imports: [],
  template: `
  <div id="notification-container" class="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] flex flex-col gap-2 sm:gap-3 pointer-events-none" role="region" aria-label="Notifications">
    @for (notif of notificationService.notifications(); track notif.id) {
      <div 
        id="notification-{{ notif.id }}"
        class="px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-2xl text-sm font-medium animate-in fade-in slide-in-from-right-4 pointer-events-auto transition-all"
        [class]="getNotificationClasses(notif.type)"
        role="alert"
        [attr.aria-live]="notif.type === 'error' ? 'assertive' : 'polite'"
        [attr.aria-atomic]="true">
        <div id="notification-content-{{ notif.id }}" class="flex items-start gap-2 sm:gap-3">
          <span id="notification-icon-{{ notif.id }}" class="flex-shrink-0">{{ getIcon(notif.type) }}</span>
          <p id="notification-message-{{ notif.id }}" class="leading-relaxed">{{ notif.message }}</p>
          <button 
            id="notification-close-{{ notif.id }}"
            (click)="notificationService.remove(notif.id)"
            class="ml-1 sm:ml-2 opacity-70 hover:opacity-100 transition-opacity flex-shrink-0 p-1 touch-target"
            [attr.aria-label]="'Close notification'">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    }
  </div>
  `,
  styles: [`
    @keyframes slide-in-from-right {
      from {
        transform: translateX(400px);
      }
      to {
        transform: translateX(0);
      }
    }
    
    .slide-in-from-right-4 {
      animation: slide-in-from-right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
  `]
})
export class NotificationDisplayComponent {
  notificationService = notificationService;

  getNotificationClasses(type: string): string {
    const baseClasses = 'max-w-xs sm:max-w-md';
    switch (type) {
      case 'success':
        return `${baseClasses} bg-green-900/80 text-green-100 border border-green-700`;
      case 'error':
        return `${baseClasses} bg-red-900/80 text-red-100 border border-red-700`;
      case 'warning':
        return `${baseClasses} bg-yellow-900/80 text-yellow-100 border border-yellow-700`;
      case 'info':
        return `${baseClasses} bg-blue-900/80 text-blue-100 border border-blue-700`;
      default:
        return `${baseClasses} bg-zinc-800 text-zinc-100 border border-zinc-700`;
    }
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '•';
    }
  }
}
