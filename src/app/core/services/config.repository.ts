// src/app/core/services/config.repository.ts - 重构版本 v3.3.0
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, deleteDoc, serverTimestamp, query, where } from 'firebase/firestore';
import { Configuration } from '../models/types';
import { firebaseService } from './firebase.service';
import { notificationService } from './notification.service';
import { APP_CONSTANTS } from '../constants/app.constants';
import { t } from './i18n.service';

class ConfigRepository {
  private db = getFirestore(firebaseService.app, firebaseService.config.firestoreDatabaseId);

  async save(config: Configuration): Promise<string> {
    const currentUser = firebaseService.getCurrentUser();
    if (!currentUser) {
      notificationService.error(t('auth.login_required'));
      throw new Error('User not authenticated');
    }

    const configId = config.id || crypto.randomUUID();
    const docRef = doc(collection(this.db, APP_CONSTANTS.FIRESTORE_COLLECTIONS.configurations), configId);

    const existingDoc = await getDoc(docRef);
    const data = {
      ...config,
      id: configId,
      userId: currentUser.uid,
      updatedAt: serverTimestamp(),
    };

    if (!existingDoc.exists()) {
      (data as Record<string, unknown>)['createdAt'] = serverTimestamp();
    }

    await setDoc(docRef, data, { merge: true });
    notificationService.success(existingDoc.exists() ? 'Configuration updated!' : 'Configuration saved!');

    return configId;
  }

  async getUserConfigs(): Promise<Configuration[]> {
    const currentUser = firebaseService.getCurrentUser();
    if (!currentUser) return [];

    const q = query(
      collection(this.db, APP_CONSTANTS.FIRESTORE_COLLECTIONS.configurations),
      where('userId', '==', currentUser.uid)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Configuration);
  }

  async getById(id: string): Promise<Configuration | null> {
    const docRef = doc(collection(this.db, APP_CONSTANTS.FIRESTORE_COLLECTIONS.configurations), id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as Configuration;
    }
    return null;
  }

  async delete(id: string): Promise<void> {
    const currentUser = firebaseService.getCurrentUser();
    if (!currentUser) {
      notificationService.error(t('auth.login_required'));
      throw new Error('User not authenticated');
    }

    await deleteDoc(doc(collection(this.db, APP_CONSTANTS.FIRESTORE_COLLECTIONS.configurations), id));
    notificationService.success('Configuration deleted.');
  }
}

export const configRepository = new ConfigRepository();
