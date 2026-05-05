// src/app/services/notification.ts v3.1.1
import { signal } from '@angular/core';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number; // milliseconds, 0 = forever
}

class NotificationService {
  private notifications = signal<Notification[]>([]);
  private notificationIdCounter = signal(0);

  readonly notifications$ = this.notifications.asReadonly();

  /**
   * Show a success notification
   */
  success(message: string, duration = 3000) {
    this.addNotification({ type: 'success', message, duration });
  }

  /**
   * Show an error notification
   */
  error(message: string, duration = 4000) {
    this.addNotification({ type: 'error', message, duration });
  }

  /**
   * Show a warning notification
   */
  warning(message: string, duration = 3500) {
    this.addNotification({ type: 'warning', message, duration });
  }

  /**
   * Show an info notification
   */
  info(message: string, duration = 3000) {
    this.addNotification({ type: 'info', message, duration });
  }

  /**
   * Add a custom notification
   */
  addNotification(notification: Omit<Notification, 'id'>) {
    const currentId = this.notificationIdCounter();
    this.notificationIdCounter.set(currentId + 1);
    const id = `notif-${currentId}`;
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? 3000,
    };

    this.notifications.update((notifs: Notification[]) => [...notifs, newNotification]);

    // Auto-remove after duration (unless duration is 0)
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => this.removeNotification(id), newNotification.duration);
    }
  }

  /**
   * Remove a notification by ID
   */
  removeNotification(id: string) {
    this.notifications.update((notifs: Notification[]) => notifs.filter((n) => n.id !== id));
  }

  /**
   * Clear all notifications
   */
  clearAll() {
    this.notifications.set([]);
  }
}

// Singleton instance
export const notificationService = new NotificationService();
