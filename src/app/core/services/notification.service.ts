// src/app/core/services/notification.service.ts - 重构版本 v3.3.0
import { signal, computed } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration: number;
  timestamp: number;
}

class NotificationService {
  private _notifications = signal<Notification[]>([]);

  readonly notifications = computed(() => this._notifications());

  private generateId(): string {
    return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private addNotification(message: string, type: NotificationType, duration: number = 3000) {
    const notification: Notification = {
      id: this.generateId(),
      message,
      type,
      duration,
      timestamp: Date.now(),
    };

    this._notifications.update(list => [...list, notification]);

    setTimeout(() => this.remove(notification.id), notification.duration);
  }

  success(message: string, duration?: number) {
    this.addNotification(message, 'success', duration);
  }

  error(message: string, duration?: number) {
    this.addNotification(message, 'error', duration || 5000);
  }

  warning(message: string, duration?: number) {
    this.addNotification(message, 'warning', duration);
  }

  info(message: string, duration?: number) {
    this.addNotification(message, 'info', duration);
  }

  remove(id: string) {
    this._notifications.update(list => list.filter(n => n.id !== id));
  }

  clear() {
    this._notifications().forEach(n => this.remove(n.id));
  }
}

export const notificationService = new NotificationService();
