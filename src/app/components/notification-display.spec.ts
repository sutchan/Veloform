// src/app/components/notification-display.spec.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { NotificationDisplayComponent } from './notification-display';
import { notificationService } from '../services/notification';

describe('NotificationDisplayComponent', () => {
  let component: NotificationDisplayComponent;

  beforeEach(() => {
    component = new NotificationDisplayComponent();
    notificationService.clearAll();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct CSS classes for success notifications', () => {
    const classes = component.getNotificationClasses('success');
    
    expect(classes).toContain('bg-green-900/80');
    expect(classes).toContain('text-green-100');
    expect(classes).toContain('max-w-md');
  });

  it('should display correct CSS classes for error notifications', () => {
    const classes = component.getNotificationClasses('error');
    
    expect(classes).toContain('bg-red-900/80');
    expect(classes).toContain('text-red-100');
  });

  it('should display correct CSS classes for warning notifications', () => {
    const classes = component.getNotificationClasses('warning');
    
    expect(classes).toContain('bg-yellow-900/80');
    expect(classes).toContain('text-yellow-100');
  });

  it('should display correct CSS classes for info notifications', () => {
    const classes = component.getNotificationClasses('info');
    
    expect(classes).toContain('bg-blue-900/80');
    expect(classes).toContain('text-blue-100');
  });

  it('should return correct icon for success type', () => {
    const icon = component.getIcon('success');
    expect(icon).toBe('✓');
  });

  it('should return correct icon for error type', () => {
    const icon = component.getIcon('error');
    expect(icon).toBe('✕');
  });

  it('should return correct icon for warning type', () => {
    const icon = component.getIcon('warning');
    expect(icon).toBe('⚠');
  });

  it('should return correct icon for info type', () => {
    const icon = component.getIcon('info');
    expect(icon).toBe('ℹ');
  });

  it('should return default icon for unknown type', () => {
    const icon = component.getIcon('unknown' as any);
    expect(icon).toBe('•');
  });

  it('should allow removing notifications', () => {
    notificationService.success('Remove me');
    const notifId = notificationService.notifications$().at(-1)?.id;
    
    if (notifId) {
      notificationService.removeNotification(notifId);
    }
    
    const notifications = notificationService.notifications$();
    expect(notifications.find((n: any) => n.id === notifId)).toBeUndefined();
  });

  it('should render notifications from notificationService', () => {
    notificationService.success('Test notification');
    
    const notifications = notificationService.notifications$();
    expect(notifications.length).toBeGreaterThan(0);
  });
});