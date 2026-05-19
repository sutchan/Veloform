// src/app/core/services/firebase.spec.ts v3.3.1
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { notificationService } from './notification.service';

describe('NotificationService', () => {
  beforeEach(() => {
    notificationService.clear();
  });

  afterEach(() => {
    notificationService.clear();
  });

  it('should add notification with unique ID', () => {
    const initialCount = notificationService.notifications().length;

    notificationService.info('Test message');

    expect(notificationService.notifications().length).toBe(initialCount + 1);
    const lastNotif = notificationService.notifications().at(-1);
    expect(lastNotif?.message).toBe('Test message');
    expect(lastNotif?.type).toBe('info');
  });

  it('should remove notification by ID', () => {
    notificationService.success('Test');
    const notifId = notificationService.notifications().at(-1)?.id;

    if (notifId) {
      notificationService.remove(notifId);
    }

    expect(notificationService.notifications().at(-1)?.id).not.toBe(notifId);
  });

  it('should auto-remove notification after duration', async () => {
    const initialCount = notificationService.notifications().length;

    notificationService.info('Auto-remove test', 50);

    expect(notificationService.notifications().length).toBe(initialCount + 1);

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(notificationService.notifications().length).toBe(initialCount);
  });

  it('should clear all notifications', () => {
    notificationService.info('Test 1');
    notificationService.info('Test 2');

    notificationService.clear();

    expect(notificationService.notifications().length).toBe(0);
  });

  it('should create notifications with correct types', () => {
    notificationService.success('Success');
    notificationService.error('Error');
    notificationService.warning('Warning');
    notificationService.info('Info');

    const notifs = notificationService.notifications();
    const types = notifs.slice(-4).map((n) => n.type);

    expect(types).toContain('success');
    expect(types).toContain('error');
    expect(types).toContain('warning');
    expect(types).toContain('info');
  });
});
