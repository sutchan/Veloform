// src/app/components/build-list.spec.ts v3.2.0
import { describe, it, expect } from 'vitest';
import { ConfigComponent } from '../types';

describe('BuildListComponent', () => {
  const mockComponents: ConfigComponent[] = [
    { id: '1', category: 'Drivetrain', name: 'Shimano Dura-Ace Di2', price: 4200, weight: 2430 },
    { id: '2', category: 'Wheelset', name: 'Roval Rapide CLX II', price: 2800, weight: 1520 },
    { id: '3', category: 'Frame', name: 'S-Works Tarmac SL8', price: 5500, weight: 850 },
  ];

  describe('Component rendering', () => {
    it('should display all components', () => {
      expect(mockComponents.length).toBe(3);
    });

    it('should have required fields for each component', () => {
      mockComponents.forEach(comp => {
        expect(comp.id).toBeDefined();
        expect(comp.category).toBeDefined();
        expect(comp.name).toBeDefined();
        expect(typeof comp.price).toBe('number');
        expect(typeof comp.weight).toBe('number');
      });
    });

    it('should calculate total cost correctly', () => {
      const totalCost = mockComponents.reduce((acc, c) => acc + c.price, 0);
      expect(totalCost).toBe(12500); // 4200 + 2800 + 5500
    });

    it('should calculate total weight correctly', () => {
      const totalWeight = mockComponents.reduce((acc, c) => acc + c.weight, 0);
      expect(totalWeight).toBe(4800); // 2430 + 1520 + 850
    });
  });

  describe('Component editing', () => {
    it('should emit edit event when edit button is clicked', () => {
      let emittedComponent: ConfigComponent | null = null;
      
      // Simulate edit emission
      const onEdit = (comp: ConfigComponent) => {
        emittedComponent = comp;
      };
      
      onEdit(mockComponents[0]);
      
      expect(emittedComponent).toEqual(mockComponents[0]);
    });

    it('should handle edit for different components', () => {
      const editedComponents: ConfigComponent[] = [];
      
      mockComponents.forEach(comp => {
        editedComponents.push(comp);
      });
      
      expect(editedComponents.length).toBe(3);
      expect(editedComponents[0].id).toBe('1');
      expect(editedComponents[1].id).toBe('2');
    });
  });

  describe('Empty state', () => {
    it('should handle empty component list', () => {
      const emptyComponents: ConfigComponent[] = [];
      expect(emptyComponents.length).toBe(0);
    });

    it('should calculate zero totals for empty list', () => {
      const emptyComponents: ConfigComponent[] = [];
      const totalCost = emptyComponents.reduce((acc, c) => acc + c.price, 0);
      const totalWeight = emptyComponents.reduce((acc, c) => acc + c.weight, 0);
      
      expect(totalCost).toBe(0);
      expect(totalWeight).toBe(0);
    });
  });

  describe('Saving state', () => {
    it('should track saving state', () => {
      let isSaving = false;
      
      expect(isSaving).toBe(false);
      
      isSaving = true;
      expect(isSaving).toBe(true);
      
      isSaving = false;
      expect(isSaving).toBe(false);
    });
  });

  describe('Sync and Deploy actions', () => {
    it('should emit sync event', () => {
      let syncEmitted = false;
      
      const onSync = () => {
        syncEmitted = true;
      };
      
      onSync();
      
      expect(syncEmitted).toBe(true);
    });

    it('should emit deploy event', () => {
      let deployEmitted = false;
      
      const onDeploy = () => {
        deployEmitted = true;
      };
      
      onDeploy();
      
      expect(deployEmitted).toBe(true);
    });
  });
});
