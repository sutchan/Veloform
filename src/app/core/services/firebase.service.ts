// src/app/core/services/firebase.service.ts - 重构版本 v3.3.0
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
import { FirebaseConfig } from '../models/types';
import fallbackConfig from '../../../../firebase-applet-config.json';

/**
 * Firebase 初始化服务
 * 负责 Firebase 应用的初始化和认证
 */
class FirebaseService {
  private _config: FirebaseConfig;
  private _app: ReturnType<typeof initializeApp> | null = null;
  private _initialized = false;

  constructor() {
    this._config = this.loadConfig();
  }

  private loadConfig(): FirebaseConfig {
    const getEnv = () => {
      try {
        return (import.meta as any).env || {};
      } catch {
        return {};
      }
    };

    const env = getEnv();
    return {
      projectId: env.VITE_FIREBASE_PROJECT_ID || fallbackConfig.projectId,
      appId: env.VITE_FIREBASE_APP_ID || fallbackConfig.appId,
      apiKey: env.VITE_FIREBASE_API_KEY || fallbackConfig.apiKey,
      authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || fallbackConfig.authDomain,
      firestoreDatabaseId: env.VITE_FIRESTORE_DATABASE_ID || fallbackConfig.firestoreDatabaseId,
      storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || fallbackConfig.storageBucket,
      messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || fallbackConfig.messagingSenderId,
      measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || fallbackConfig.measurementId,
    };
  }

  get app() {
    if (!this._app) {
      this._app = initializeApp(this._config);
      this._initialized = true;
    }
    return this._app;
  }

  get config(): FirebaseConfig {
    return this._config;
  }

  get auth() {
    return getAuth(this.app);
  }

  get isInitialized(): boolean {
    return this._initialized;
  }

  async loginWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(this.auth, provider);
    return result.user;
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }
}

export const firebaseService = new FirebaseService();

export const auth = firebaseService.auth;

export { FirebaseService };
