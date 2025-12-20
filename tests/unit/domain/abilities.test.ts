import { describe, it, expect } from 'vitest';
import {
  calculateAbilityModifier,
  calculateAllAbilityModifiers,
  isValidAbilityScore,
  formatModifier,
  getModifierDescription,
  getScoreRangeForModifier,
  pointsToNextModifier,
} from '@shared/domain/calculators/abilities';

describe('calculateAbilityModifier', () => {
  describe('modificadores positivos', () => {
    it('debería calcular +0 para score 10', () => {
      expect(calculateAbilityModifier(10)).toBe(0);
    });

    it('debería calcular +0 para score 11', () => {
      expect(calculateAbilityModifier(11)).toBe(0);
    });

    it('debería calcular +1 para score 12', () => {
      expect(calculateAbilityModifier(12)).toBe(1);
    });

    it('debería calcular +1 para score 13', () => {
      expect(calculateAbilityModifier(13)).toBe(1);
    });

    it('debería calcular +2 para score 14', () => {
      expect(calculateAbilityModifier(14)).toBe(2);
    });

    it('debería calcular +2 para score 15', () => {
      expect(calculateAbilityModifier(15)).toBe(2);
    });

    it('debería calcular +3 para score 16', () => {
      expect(calculateAbilityModifier(16)).toBe(3);
    });

    it('debería calcular +3 para score 17', () => {
      expect(calculateAbilityModifier(17)).toBe(3);
    });

    it('debería calcular +4 para score 18', () => {
      expect(calculateAbilityModifier(18)).toBe(4);
    });

    it('debería calcular +4 para score 19', () => {
      expect(calculateAbilityModifier(19)).toBe(4);
    });

    it('debería calcular +5 para score 20', () => {
      expect(calculateAbilityModifier(20)).toBe(5);
    });
  });

  describe('modificadores negativos', () => {
    it('debería calcular -1 para score 8', () => {
      expect(calculateAbilityModifier(8)).toBe(-1);
    });

    it('debería calcular -1 para score 9', () => {
      expect(calculateAbilityModifier(9)).toBe(-1);
    });

    it('debería calcular -2 para score 6', () => {
      expect(calculateAbilityModifier(6)).toBe(-2);
    });

    it('debería calcular -2 para score 7', () => {
      expect(calculateAbilityModifier(7)).toBe(-2);
    });

    it('debería calcular -3 para score 4', () => {
      expect(calculateAbilityModifier(4)).toBe(-3);
    });

    it('debería calcular -3 para score 5', () => {
      expect(calculateAbilityModifier(5)).toBe(-3);
    });

    it('debería calcular -4 para score 2', () => {
      expect(calculateAbilityModifier(2)).toBe(-4);
    });

    it('debería calcular -4 para score 3', () => {
      expect(calculateAbilityModifier(3)).toBe(-4);
    });

    it('debería calcular -5 para score 1', () => {
      expect(calculateAbilityModifier(1)).toBe(-5);
    });
  });

  describe('casos extremos (válidos)', () => {
    it('debería calcular +10 para score 30 (máximo)', () => {
      expect(calculateAbilityModifier(30)).toBe(10);
    });

    it('debería calcular -5 para score 1 (mínimo)', () => {
      expect(calculateAbilityModifier(1)).toBe(-5);
    });

    it('debería manejar scores altos (22-29)', () => {
      expect(calculateAbilityModifier(22)).toBe(6);
      expect(calculateAbilityModifier(24)).toBe(7);
      expect(calculateAbilityModifier(26)).toBe(8);
      expect(calculateAbilityModifier(28)).toBe(9);
      expect(calculateAbilityModifier(29)).toBe(9);
    });
  });

  describe('validación de entrada', () => {
    it('debería lanzar error para score 0', () => {
      expect(() => calculateAbilityModifier(0)).toThrow(
        'Invalid ability score: 0'
      );
    });

    it('debería lanzar error para score negativo', () => {
      expect(() => calculateAbilityModifier(-5)).toThrow(
        'Invalid ability score'
      );
    });

    it('debería lanzar error para score mayor a 30', () => {
      expect(() => calculateAbilityModifier(31)).toThrow(
        'Invalid ability score: 31'
      );
    });

    it('debería lanzar error para score 100', () => {
      expect(() => calculateAbilityModifier(100)).toThrow(
        'Invalid ability score'
      );
    });

    it('debería lanzar error para números decimales', () => {
      expect(() => calculateAbilityModifier(10.5)).toThrow(
        'Invalid ability score'
      );
    });

    it('debería lanzar error para NaN', () => {
      expect(() => calculateAbilityModifier(NaN)).toThrow(
        'Invalid ability score'
      );
    });

    it('debería lanzar error para Infinity', () => {
      expect(() => calculateAbilityModifier(Infinity)).toThrow(
        'Invalid ability score'
      );
    });
  });

  describe('array típico para personaje estándar', () => {
    // Standard array: 15, 14, 13, 12, 10, 8
    it('debería calcular correctamente el standard array', () => {
      expect(calculateAbilityModifier(15)).toBe(2);
      expect(calculateAbilityModifier(14)).toBe(2);
      expect(calculateAbilityModifier(13)).toBe(1);
      expect(calculateAbilityModifier(12)).toBe(1);
      expect(calculateAbilityModifier(10)).toBe(0);
      expect(calculateAbilityModifier(8)).toBe(-1);
    });
  });
});

describe('calculateAllAbilityModifiers', () => {
  it('debería calcular todos los modificadores correctamente', () => {
    const abilities = {
      strength: 16,
      dexterity: 14,
      constitution: 13,
      intelligence: 8,
      wisdom: 10,
      charisma: 12,
    };

    const modifiers = calculateAllAbilityModifiers(abilities);

    expect(modifiers).toEqual({
      strength: 3,
      dexterity: 2,
      constitution: 1,
      intelligence: -1,
      wisdom: 0,
      charisma: 1,
    });
  });

  it('debería calcular modificadores para el standard array', () => {
    const abilities = {
      strength: 15,
      dexterity: 14,
      constitution: 13,
      intelligence: 12,
      wisdom: 10,
      charisma: 8,
    };

    const modifiers = calculateAllAbilityModifiers(abilities);

    expect(modifiers).toEqual({
      strength: 2,
      dexterity: 2,
      constitution: 1,
      intelligence: 1,
      wisdom: 0,
      charisma: -1,
    });
  });

  it('debería calcular modificadores para scores todos iguales', () => {
    const abilities = {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    };

    const modifiers = calculateAllAbilityModifiers(abilities);

    expect(modifiers).toEqual({
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
    });
  });

  it('debería lanzar error si algún score es inválido', () => {
    const invalidAbilities = {
      strength: 16,
      dexterity: 14,
      constitution: 31, // ❌ Inválido
      intelligence: 8,
      wisdom: 10,
      charisma: 12,
    };

    expect(() => calculateAllAbilityModifiers(invalidAbilities)).toThrow(
      'Invalid ability score'
    );
  });
});

describe('isValidAbilityScore', () => {
  it('debería retornar true para scores válidos (1-30)', () => {
    expect(isValidAbilityScore(1)).toBe(true);
    expect(isValidAbilityScore(10)).toBe(true);
    expect(isValidAbilityScore(20)).toBe(true);
    expect(isValidAbilityScore(30)).toBe(true);
  });

  it('debería retornar false para score 0', () => {
    expect(isValidAbilityScore(0)).toBe(false);
  });

  it('debería retornar false para scores mayores a 30', () => {
    expect(isValidAbilityScore(31)).toBe(false);
    expect(isValidAbilityScore(100)).toBe(false);
  });

  it('debería retornar false para scores negativos', () => {
    expect(isValidAbilityScore(-1)).toBe(false);
    expect(isValidAbilityScore(-10)).toBe(false);
  });

  it('debería retornar false para números decimales', () => {
    expect(isValidAbilityScore(10.5)).toBe(false);
    expect(isValidAbilityScore(15.1)).toBe(false);
  });

  it('debería retornar false para NaN', () => {
    expect(isValidAbilityScore(NaN)).toBe(false);
  });

  it('debería retornar false para Infinity', () => {
    expect(isValidAbilityScore(Infinity)).toBe(false);
    expect(isValidAbilityScore(-Infinity)).toBe(false);
  });
});

describe('formatModifier', () => {
  it('debería formatear modificadores positivos con "+"', () => {
    expect(formatModifier(1)).toBe('+1');
    expect(formatModifier(3)).toBe('+3');
    expect(formatModifier(5)).toBe('+5');
  });

  it('debería formatear modificador 0 sin signo', () => {
    expect(formatModifier(0)).toBe('0');
  });

  it('debería formatear modificadores negativos con "-"', () => {
    expect(formatModifier(-1)).toBe('-1');
    expect(formatModifier(-3)).toBe('-3');
    expect(formatModifier(-5)).toBe('-5');
  });
});

describe('getModifierDescription', () => {
  it('debería describir modificadores excepcionales (5+)', () => {
    expect(getModifierDescription(5)).toBe('Excepcional');
    expect(getModifierDescription(10)).toBe('Excepcional');
  });

  it('debería describir modificadores muy buenos (3-4)', () => {
    expect(getModifierDescription(3)).toBe('Muy bueno');
    expect(getModifierDescription(4)).toBe('Muy bueno');
  });

  it('debería describir modificadores buenos (1-2)', () => {
    expect(getModifierDescription(1)).toBe('Bueno');
    expect(getModifierDescription(2)).toBe('Bueno');
  });

  it('debería describir modificador promedio (0)', () => {
    expect(getModifierDescription(0)).toBe('Promedio');
  });

  it('debería describir modificadores bajos (-1 a -2)', () => {
    expect(getModifierDescription(-1)).toBe('Bajo');
    expect(getModifierDescription(-2)).toBe('Bajo');
  });

  it('debería describir modificadores muy bajos (-3 o menos)', () => {
    expect(getModifierDescription(-3)).toBe('Muy bajo');
    expect(getModifierDescription(-5)).toBe('Muy bajo');
  });
});

describe('getScoreRangeForModifier', () => {
  it('debería retornar [10, 11] para modificador 0', () => {
    expect(getScoreRangeForModifier(0)).toEqual([10, 11]);
  });

  it('debería retornar [16, 17] para modificador +3', () => {
    expect(getScoreRangeForModifier(3)).toEqual([16, 17]);
  });

  it('debería retornar [8, 9] para modificador -1', () => {
    expect(getScoreRangeForModifier(-1)).toEqual([8, 9]);
  });

  it('debería retornar [20, 21] para modificador +5', () => {
    expect(getScoreRangeForModifier(5)).toEqual([20, 21]);
  });

  it('debería retornar [1, 1] para modificador -5 (mínimo)', () => {
    expect(getScoreRangeForModifier(-5)).toEqual([1, 1]);
  });

  it('debería retornar [30, 30] para modificador +10 (máximo)', () => {
    expect(getScoreRangeForModifier(10)).toEqual([30, 30]);
  });

  it('debería retornar null para modificadores inválidos', () => {
    expect(getScoreRangeForModifier(-6)).toBeNull();
    expect(getScoreRangeForModifier(11)).toBeNull();
    expect(getScoreRangeForModifier(100)).toBeNull();
  });
});

describe('pointsToNextModifier', () => {
  it('debería retornar 1 para score 15 (siguiente es 16 para +3)', () => {
    expect(pointsToNextModifier(15)).toBe(1);
  });

  it('debería retornar 2 para score 16 (siguiente es 18 para +4)', () => {
    expect(pointsToNextModifier(16)).toBe(2);
  });

  it('debería retornar 1 para score 9 (siguiente es 10 para 0)', () => {
    expect(pointsToNextModifier(9)).toBe(1);
  });

  it('debería retornar 2 para score 10 (siguiente es 12 para +1)', () => {
    expect(pointsToNextModifier(10)).toBe(2);
  });

  it('debería retornar null para score 30 (máximo)', () => {
    expect(pointsToNextModifier(30)).toBeNull();
  });

  it('debería retornar null para scores inválidos', () => {
    expect(pointsToNextModifier(0)).toBeNull();
    expect(pointsToNextModifier(31)).toBeNull();
  });
});
