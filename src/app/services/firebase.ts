// src/app/services/firebase.ts v3.1.0
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, serverTimestamp, getDocs, deleteDoc, query, where } from 'firebase/firestore';
import firebaseConfig from '../../../firebase-applet-config.json';
import { Configuration, ConfigComponent } from '../types';

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

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: Record<string, unknown>;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error('Login error', error);
  }
}

export async function saveConfiguration(config: Configuration) {
  if (!auth.currentUser) throw new Error('User not authenticated');
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
  } catch (error) {
    handleFirestoreError(error, existingDoc.exists() ? OperationType.UPDATE : OperationType.CREATE, `configurations/${configId}`);
  }
  return configId;
}

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

export async function deleteConfiguration(id: string) {
  if (!auth.currentUser) throw new Error('User not authenticated');
  try {
    await deleteDoc(doc(collection(db, 'configurations'), id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `configurations/${id}`);
  }
}

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
    } catch (e) {
      console.error('Seed error', e);
    }
  }
}
