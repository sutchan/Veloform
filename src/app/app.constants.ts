// src/app/app.constants.ts v3.2.0 - Default bike configurations
/**
 * Default components for Road bikes
 * Used when no database components are available for this category
 */
import { ConfigComponent } from './types';

export const ROAD_DEFAULTS: ConfigComponent[] = [
  { id: '1', category: 'Drivetrain', name: 'Shimano Dura-Ace Di2 R9200', price: 4200, weight: 2430 },
  { id: '2', category: 'Wheelset', name: 'Roval Rapide CLX II', price: 2800, weight: 1520 },
  { id: '3', category: 'Cockpit', name: 'Roval Rapide Cockpit', price: 600, weight: 310 },
  { id: '4', category: 'Tires', name: 'Turbo Cotton 28mm', price: 180, weight: 480 },
];

export const MTB_DEFAULTS: ConfigComponent[] = [
  { id: '5', category: 'Drivetrain', name: 'SRAM XX1 Eagle AXS', price: 2500, weight: 1515 },
  { id: '6', category: 'Suspension', name: 'Fox 34 Float Factory', price: 1050, weight: 1738 },
  { id: '7', category: 'Wheelset', name: 'Reserve 30|SL', price: 1800, weight: 1650 },
  { id: '8', category: 'Tires', name: 'Maxxis Rekon 2.4', price: 160, weight: 1600 },
];

export const FOLD_DEFAULTS: ConfigComponent[] = [
  { id: '9', category: 'Drivetrain', name: 'Brompton 6-Speed', price: 400, weight: 1200 },
  { id: '10', category: 'Frame', name: 'Titanium Main Frame', price: 2100, weight: 1800 },
  { id: '11', category: 'Wheelset', name: 'Brompton Superlight', price: 800, weight: 1100 },
];
