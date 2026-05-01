// src/app/types.ts v3.2.0 - Enhanced type definitions with JSDoc

/**
 * Represents a single component in a bike configuration.
 * @interface ConfigComponent
 */
export interface ConfigComponent {
  /** Unique identifier for the component */
  id: string;
  
  /** Component category (e.g., 'Drivetrain', 'Wheelset', 'Frame') */
  category: string;
  
  /** Display name of the component */
  name: string;
  
  /** Price in USD */
  price: number;
  
  /** Weight in grams */
  weight: number;
  
  /** Bike type this component is compatible with (optional) */
  bikeType?: 'Road' | 'MTB' | 'Fold';

  /** Optional specifications or detailed description */
  specs?: string;
}

/**
 * Represents a complete bike configuration that can be saved/loaded.
 * @interface Configuration
 */
export interface Configuration {
  /** Unique identifier for the configuration (auto-generated at save time) */
  id?: string;
  
  /** Firebase user ID of the configuration owner */
  userId?: string;
  
  /** Type of bike this configuration is for */
  bikeType: 'Road' | 'MTB' | 'Fold';
  
  /** Display name for the configuration */
  name: string;
  
  /** Array of components that make up this configuration */
  components: ConfigComponent[];
  
  /** Total cost of all components in USD */
  totalCost: number;
  
  /** Estimated weight of the complete bike in kilograms */
  estimatedWeight: number;
  
  /** Server timestamp when the configuration was created */
  createdAt?: any; // Firebase serverTimestamp type
  
  /** Server timestamp when the configuration was last updated */
  updatedAt?: any; // Firebase serverTimestamp type
}

/** Type for bike categories */
export type BikeType = 'Road' | 'MTB' | 'Fold';

/** Type for component categories */
export type ComponentCategory = 'Frame' | 'Drivetrain' | 'Wheelset' | 'Suspension' | 'Cockpit' | 'Tires';
