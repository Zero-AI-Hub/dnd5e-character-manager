import { describe, it, expect } from 'vitest';
import { calculateModifier, calculateAllModifiers } from '@shared/domain/calculators/modifiers';

describe('calculateModifier', () => {
  it('debería calcular modificador +0 para score 10', () => {
    expect(calculateModifier(10)).toBe(0);
  });

  it('debería calcular modificador +0 para score 11', () => {
    expect(calculateModifier(11)).toBe(0);
  });

  it('debería calcular modificador +3 para score 16', () => {
    expect(calculateModifier(16)).toBe(3);
  });

  it('debería calcular modificador -1 para score 8', () => {
    expect(calculateModifier(8)).toBe(-1);
  });

  it('debería calcular modificador +5 para score 20', () => {
    expect(calculateModifier(20)).toBe(5);
  });

  it('debería calcular modificador -5 para score 1', () => {
    expect(calculateModifier(1)).toBe(-5);
  });

  it('debería lanzar error si score es menor a 1', () => {
    expect(() => calculateModifier(0)).toThrow('Invalid ability score');
  });

  it('debería lanzar error si score es mayor a 30', () => {
    expect(() => calculateModifier(31)).toThrow('Invalid ability score');
  });
});

describe('calculateAllModifiers', () => {
  it('debería calcular todos los modificadores correctamente', () => {
    const abilities = {
      strength: 16,      // +3
      dexterity: 14,     // +2
      constitution: 13,  // +1
      intelligence: 8,   // -1
      wisdom: 10,        // +0
      charisma: 12,      // +1
    };

    const modifiers = calculateAllModifiers(abilities);

    expect(modifiers).toEqual({
      strength: 3,
      dexterity: 2,
      constitution: 1,
      intelligence: -1,
      wisdom: 0,
      charisma: 1,
    });
  });
});
