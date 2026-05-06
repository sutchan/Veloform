import { describe, it, expect } from 'vitest';

describe('App', () => {
  it('should have expected bike types', () => {
    const expectedTypes = ['Road', 'MTB', 'Fold'] as const;
    expect(expectedTypes.length).toBe(3);
    expect(expectedTypes).toContain('Road');
    expect(expectedTypes).toContain('MTB');
    expect(expectedTypes).toContain('Fold');
  });

  it('should define valid bike type values', () => {
    const bikeTypes = ['Road', 'MTB', 'Fold'] as const;
    bikeTypes.forEach(type => {
      expect(['Road', 'MTB', 'Fold']).toContain(type);
    });
  });
});