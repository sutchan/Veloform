// src/app/types.ts v3.1.0
export interface ConfigComponent {
  id: string;
  category: string;
  name: string;
  price: number;
  weight: number; // in grams
  bikeType?: string;
}

export interface Configuration {
  id?: string;
  userId?: string;
  bikeType: 'Road' | 'MTB' | 'Fold';
  name: string;
  components: ConfigComponent[];
  totalCost: number;
  estimatedWeight: number; // in kg
  createdAt?: ReturnType<typeof import('firebase/firestore').serverTimestamp>;
  updatedAt?: ReturnType<typeof import('firebase/firestore').serverTimestamp>;
}
