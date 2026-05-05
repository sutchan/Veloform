// src/app/services/firebase.ts v3.1.1
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, serverTimestamp, getDocs, deleteDoc, query, where } from 'firebase/firestore';
import fallbackConfig from '../../../firebase-applet-config.json';
import { Configuration, ConfigComponent } from '../types';
import { notificationService } from './notification';

// Export notificationService for use in tests and components
export { notificationService };

// Load Firebase config from environment variables or fallback to JSON file
const getEnv = () => {
  try {
    return (import.meta as any).env || {};
  } catch {
    return {};
  }
};

const env = getEnv();
const firebaseConfig = {
  projectId: env.VITE_FIREBASE_PROJECT_ID || fallbackConfig.projectId,
  appId: env.VITE_FIREBASE_APP_ID || fallbackConfig.appId,
  apiKey: env.VITE_FIREBASE_API_KEY || fallbackConfig.apiKey,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || fallbackConfig.authDomain,
  firestoreDatabaseId: env.VITE_FIRESTORE_DATABASE_ID || fallbackConfig.firestoreDatabaseId,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || fallbackConfig.storageBucket,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || fallbackConfig.messagingSenderId,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || fallbackConfig.measurementId,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

/**
 * Firestore error information structure for logging and debugging
 * @internal
 */
interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: Record<string, unknown>;
}

/**
 * Handle Firestore errors with user-friendly notifications
 * @param error - The error object
 * @param operationType - Type of operation that failed
 * @param path - Path to the resource that was being accessed
 * @internal
 */
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  // Show user-friendly error message
  const errorMessages: Record<OperationType, string> = {
    [OperationType.CREATE]: 'Failed to save configuration. Please try again.',
    [OperationType.UPDATE]: 'Failed to update configuration. Please try again.',
    [OperationType.DELETE]: 'Failed to delete configuration. Please try again.',
    [OperationType.LIST]: 'Failed to load configurations. Please refresh the page.',
    [OperationType.GET]: 'Failed to load configuration. Please try again.',
    [OperationType.WRITE]: 'Failed to save data. Please check your connection and try again.',
  };
  
  notificationService.error(errorMessages[operationType]);
}

/**
 * Initiates Google OAuth login flow
 * Shows success/error notifications to the user
 * @returns Promise that resolves when login flow completes
 */
export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    notificationService.success('Login successful!');
  } catch (error) {
    const message = error instanceof Error && error.message.includes('popup-closed')
      ? 'Login was cancelled. Please try again.'
      : 'Login failed. Please try again.';
    notificationService.error(message);
  }
}

/**
 * Save or update a configuration in Firestore
 * Creates a new configuration if ID is not provided, otherwise updates existing
 * @param config - Configuration to save
 * @returns Promise resolving to the configuration ID
 * @throws Error if user is not authenticated
 */
export async function saveConfiguration(config: Configuration) {
  if (!auth.currentUser) {
    notificationService.error('You must be logged in to save configurations.');
    throw new Error('User not authenticated');
  }
  const configId = config.id || crypto.randomUUID();
  const docRef = doc(collection(db, 'configurations'), configId);
  
  const existingDoc = await getDoc(docRef);
  const data = {
    ...config,
    id: configId,
    userId: auth.currentUser.uid,
    updatedAt: serverTimestamp(),
  };

  if (!existingDoc.exists()) {
    (data as Record<string, unknown>)['createdAt'] = serverTimestamp();
  }

  try {
    await setDoc(docRef, data, { merge: true });
    notificationService.success(existingDoc.exists() ? 'Configuration updated!' : 'Configuration saved!');
  } catch (error) {
    handleFirestoreError(error, existingDoc.exists() ? OperationType.UPDATE : OperationType.CREATE, `configurations/${configId}`);
  }
  return configId;
}

/**
 * Fetch all configurations belonging to the currently logged-in user
 * @returns Promise resolving to array of configurations, empty array if not authenticated or no configs exist
 */
export async function getUserConfigurations(): Promise<Configuration[]> {
  if (!auth.currentUser) return [];
  try {
    const q = query(collection(db, 'configurations'), where('userId', '==', auth.currentUser.uid));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Configuration);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'configurations');
    return [];
  }
}

/**
 * Delete a configuration from Firestore
 * @param id - ID of the configuration to delete
 * @throws Error if user is not authenticated
 */
export async function deleteConfiguration(id: string) {
  if (!auth.currentUser) {
    notificationService.error('You must be logged in to delete configurations.');
    throw new Error('User not authenticated');
  }
  try {
    await deleteDoc(doc(collection(db, 'configurations'), id));
    notificationService.success('Configuration deleted.');
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `configurations/${id}`);
  }
}

/**
 * Fetch all available components from the database
 * Auto-seeds the database with default components if empty
 * @returns Promise resolving to array of all components
 */
export async function getComponentsFromDB(): Promise<ConfigComponent[]> {
  try {
    const snap = await getDocs(collection(db, 'components'));
    if (snap.empty) {
      await seedComponents();
      const freshSnap = await getDocs(collection(db, 'components'));
      return freshSnap.docs.map(d => d.data() as ConfigComponent);
    }
    return snap.docs.map(d => d.data() as ConfigComponent);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'components');
    return [];
  }
}

async function seedComponents() {
  const seeds = [
    { id: 'frame_road_sl8', category: 'Frame', bikeType: 'Road', name: 'S-Works Tarmac SL8', price: 5500, weight: 850, specs: 'Carbon Fact 12r' },
    { id: 'frame_road_aethos', category: 'Frame', bikeType: 'Road', name: 'Aethos Pro', price: 4200, weight: 685, specs: 'Carbon Fact 10r' },
    { id: 'drive_road_da', category: 'Drivetrain', bikeType: 'Road', name: 'Shimano Dura-Ace Di2 R9200', price: 4200, weight: 2430, specs: '12-speed electronic' },
    { id: 'wheel_road_clx', category: 'Wheelset', bikeType: 'Road', name: 'Roval Rapide CLX II', price: 2800, weight: 1520, specs: 'Aero Carbon' },
    
    { id: 'frame_mtb_epic', category: 'Frame', bikeType: 'MTB', name: 'Epic World Cup', price: 3500, weight: 1750, specs: 'Carbon, 75mm travel' },
    { id: 'drive_mtb_xx1', category: 'Drivetrain', bikeType: 'MTB', name: 'SRAM XX1 Eagle AXS', price: 2500, weight: 1515, specs: '12-speed wireless' },
    { id: 'susp_mtb_fox34', category: 'Suspension', bikeType: 'MTB', name: 'Fox 34 Float Factory', price: 1050, weight: 1738, specs: '120mm travel' },
    { id: 'wheel_mtb_res30', category: 'Wheelset', bikeType: 'MTB', name: 'Reserve 30|SL', price: 1800, weight: 1650, specs: 'Carbon MTB' },
    
    { id: 'frame_fold_tline', category: 'Frame', bikeType: 'Fold', name: 'Brompton T Line Titanium', price: 2100, weight: 1800, specs: 'Titanium' },
    { id: 'drive_fold_6spd', category: 'Drivetrain', bikeType: 'Fold', name: 'Brompton 6-Speed', price: 400, weight: 1200, specs: 'Internal hub' },
    { id: 'wheel_fold_super', category: 'Wheelset', bikeType: 'Fold', name: 'Brompton Superlight', price: 800, weight: 1100, specs: '16 inch' }
  ];

  for (const s of seeds) {
    try {
      await setDoc(doc(collection(db, 'components'), s.id), s);
    } catch {
    }
  }
}
