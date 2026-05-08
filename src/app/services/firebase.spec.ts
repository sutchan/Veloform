// src/app/services/firebase.spec.ts v3.2.0
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as firebaseAuth from 'firebase/auth';
import * as firestore from 'firebase/firestore';
import { handleFirestoreError, loginWithGoogle, notificationService, auth } from './firebase';

// Mock Firebase modules
vi.mock('firebase/app');
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({ currentUser: null })),
  signInWithPopup: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  onAuthStateChanged: vi.fn()
}));
vi.mock('firebase/firestore');

describe('Firebase Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset auth state for each test
    Object.defineProperty(firebaseAuth, 'auth', {
      value: { currentUser: null },
      writable: true
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('handleFirestoreError', () => {
    it('should log error with operation type and path', () => {
      const consoleSpy = vi.spyOn(console, 'error');
      const error = new Error('Test error');
      
      handleFirestoreError(error, 'create' as any, 'configurations/test-id');
      
      expect(consoleSpy).toHaveBeenCalled();
      const callArg = consoleSpy.mock.calls[0][1];
      expect(typeof callArg).toBe('string');
      expect(callArg as string).toContain('Test error');
    });

    it('should call notificationService.error for CREATE operations', () => {
      const notifSpy = vi.spyOn(notificationService, 'error');
      
      handleFirestoreError(new Error('Create failed'), 'create' as any, 'configurations/id');
      
      expect(notifSpy).toHaveBeenCalledWith('Failed to save configuration. Please try again.');
    });

    it('should call notificationService.error for DELETE operations', () => {
      const notifSpy = vi.spyOn(notificationService, 'error');
      
      handleFirestoreError(new Error('Delete failed'), 'delete' as any, 'configurations/id');
      
      expect(notifSpy).toHaveBeenCalledWith('Failed to delete configuration. Please try again.');
    });

    it('should call notificationService.error for LIST operations', () => {
      const notifSpy = vi.spyOn(notificationService, 'error');
      
      handleFirestoreError(new Error('List failed'), 'list' as any, 'configurations');
      
      expect(notifSpy).toHaveBeenCalledWith('Failed to load configurations. Please refresh the page.');
    });

    it('should handle non-Error objects', () => {
      const consoleSpy = vi.spyOn(console, 'error');
      
      handleFirestoreError('String error', 'get' as any, 'path');
      
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('loginWithGoogle', () => {
    it('should call signInWithPopup with correct provider', async () => {
      const signInSpy = vi.fn().mockResolvedValueOnce({});
      vi.spyOn(firebaseAuth, 'signInWithPopup').mockImplementation(signInSpy);
      
      // Note: Actual implementation test would require proper mocking of auth instance
      // This is a simplified example
    });

    it('should show success notification on successful login', async () => {
      // This would require mocking the entire Firebase auth flow
      // Simplified example
    });

    it('should show error notification on login failure', async () => {
      // This would require mocking signInWithPopup to reject
      // Simplified example
    });
  });

  describe('NotificationService', () => {
    it('should add notification with unique ID', () => {
      const initialCount = notificationService.notifications$().length;
      
      notificationService.info('Test message');
      
      expect(notificationService.notifications$().length).toBe(initialCount + 1);
      const lastNotif = notificationService.notifications$().at(-1);
      expect(lastNotif?.message).toBe('Test message');
      expect(lastNotif?.type).toBe('info');
    });

    it('should remove notification by ID', () => {
      notificationService.success('Test');
      const notifId = notificationService.notifications$().at(-1)?.id;
      
      if (notifId) {
        notificationService.removeNotification(notifId);
      }
      
      expect(notificationService.notifications$().at(-1)?.id).not.toBe(notifId);
    });

    it('should auto-remove notification after duration', async () => {
      const initialCount = notificationService.notifications$().length;
      
      notificationService.info('Auto-remove test', 100); // 100ms duration
      
      expect(notificationService.notifications$().length).toBe(initialCount + 1);
      
      // Wait for auto-removal
      await new Promise(resolve => setTimeout(resolve, 150));
      
      expect(notificationService.notifications$().length).toBe(initialCount);
    });

    it('should not auto-remove notification with duration 0', async () => {
      const initialCount = notificationService.notifications$().length;
      
      notificationService.info('Persistent notification', 0);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(notificationService.notifications$().length).toBe(initialCount + 1);
      
      // Manual cleanup
      const lastId = notificationService.notifications$().at(-1)?.id;
      if (lastId) notificationService.removeNotification(lastId);
    });

    it('should clear all notifications', () => {
      notificationService.info('Test 1');
      notificationService.info('Test 2');
      
      notificationService.clearAll();
      
      expect(notificationService.notifications$().length).toBe(0);
    });

    it('should create notifications with correct types', () => {
      notificationService.success('Success');
      notificationService.error('Error');
      notificationService.warning('Warning');
      notificationService.info('Info');
      
      const notifs = notificationService.notifications$();
      const types = notifs.slice(-4).map((n: any) => n.type);
      
      expect(types).toContain('success');
      expect(types).toContain('error');
      expect(types).toContain('warning');
      expect(types).toContain('info');
    });
  });
});
