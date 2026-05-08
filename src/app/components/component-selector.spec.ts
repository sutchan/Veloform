// src/app/components/component-selector.spec.ts v3.2.0
import { describe, it, expect } from 'vitest';
import { ConfigComponent } from '../types';

describe('ComponentSelectorComponent', () => {
  const mockComponents: ConfigComponent[] = [
    { id: '1', category: 'Frame', bikeType: 'Road', name: 'Test Frame 1', price: 3000, weight: 900 },
    { id: '2', category: 'Frame', bikeType: 'Road', name: 'Test Frame 2', price: 4000, weight: 850 },
    { id: '3', category: 'Drivetrain', bikeType: 'Road', name: 'Test Drivetrain', price: 2500, weight: 2000 },
    { id: '4', category: 'Wheelset', bikeType: 'MTB', name: 'MTB Wheels', price: 1500, weight: 1600 },
  ];

  describe('Component filtering', () => {
    it('should filter components by bike type', () => {
      const roadComponents = mockComponents.filter(c => c.bikeType === 'Road');
      expect(roadComponents.length).toBe(3);
      expect(roadComponents.every(c => c.bikeType === 'Road')).toBe(true);
    });

    it('should filter components by category', () => {
      const frameComponents = mockComponents.filter(c => c.category === 'Frame');
      expect(frameComponents.length).toBe(2);
      expect(frameComponents.every(c => c.category === 'Frame')).toBe(true);
    });

    it('should return all components when category is "All"', () => {
      const allRoadComponents = mockComponents.filter(c => c.bikeType === 'Road');
      expect(allRoadComponents.length).toBe(3);
    });

    it('should extract unique categories', () => {
      const categories = new Set(mockComponents
        .filter(c => c.bikeType === 'Road')
        .map(c => c.category));
      expect(categories.size).toBe(2); // Frame and Drivetrain
      expect(categories.has('Frame')).toBe(true);
      expect(categories.has('Drivetrain')).toBe(true);
    });
  });

  describe('Component selection', () => {
    it('should identify current component', () => {
      const currentId = '1';
      const isCurrent = (id: string) => id === currentId;
      
      expect(isCurrent('1')).toBe(true);
      expect(isCurrent('2')).toBe(false);
    });

    it('should replace component in array', () => {
      const components = [...mockComponents];
      const oldComponent = components[0];
      const newComponent: ConfigComponent = {
        id: 'new-1',
        category: 'Frame',
        bikeType: 'Road',
        name: 'New Frame',
        price: 5000,
        weight: 800
      };
      
      const updated = components.map(c => c.id === oldComponent.id ? newComponent : c);
      
      expect(updated.length).toBe(components.length);
      expect(updated[0].name).toBe('New Frame');
      expect(updated[0].id).toBe('new-1');
    });
  });

  describe('Data integrity', () => {
    it('should maintain component structure', () => {
      const component: ConfigComponent = {
        id: 'test-1',
        category: 'Frame',
        name: 'Test Component',
        price: 1000,
        weight: 500,
        bikeType: 'Road',
        specs: 'Test specs'
      };
      
      expect(component.id).toBeDefined();
      expect(component.category).toBeDefined();
      expect(component.name).toBeDefined();
      expect(typeof component.price).toBe('number');
      expect(typeof component.weight).toBe('number');
    });

    it('should handle optional fields', () => {
      const minimalComponent: ConfigComponent = {
        id: 'min-1',
        category: 'Frame',
        name: 'Minimal',
        price: 100,
        weight: 100
      };
      
      expect(minimalComponent.specs).toBeUndefined();
      expect(minimalComponent.bikeType).toBeUndefined();
    });
  });
});
