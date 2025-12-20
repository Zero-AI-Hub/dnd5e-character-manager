import { describe, it, expect } from 'vitest';
import {
  calculateProficiencyBonus,
  calculateProficiencyBonusFormula,
  isValidLevel,
  getLevelRangeForBonus,
} from '@shared/domain/calculators/proficiency';

describe('calculateProficiencyBonus', () => {
  describe('niveles 1-4 (bonificador +2)', () => {
    it('debería retornar +2 para nivel 1', () => {
      expect(calculateProficiencyBonus(1)).toBe(2);
    });

    it('debería retornar +2 para nivel 2', () => {
      expect(calculateProficiencyBonus(2)).toBe(2);
    });

    it('debería retornar +2 para nivel 3', () => {
      expect(calculateProficiencyBonus(3)).toBe(2);
    });

    it('debería retornar +2 para nivel 4', () => {
      expect(calculateProficiencyBonus(4)).toBe(2);
    });
  });

  describe('niveles 5-8 (bonificador +3)', () => {
    it('debería retornar +3 para nivel 5', () => {
      expect(calculateProficiencyBonus(5)).toBe(3);
    });

    it('debería retornar +3 para nivel 8', () => {
      expect(calculateProficiencyBonus(8)).toBe(3);
    });
  });

  describe('niveles 9-12 (bonificador +4)', () => {
    it('debería retornar +4 para nivel 9', () => {
      expect(calculateProficiencyBonus(9)).toBe(4);
    });

    it('debería retornar +4 para nivel 12', () => {
      expect(calculateProficiencyBonus(12)).toBe(4);
    });
  });

  describe('niveles 13-16 (bonificador +5)', () => {
    it('debería retornar +5 para nivel 13', () => {
      expect(calculateProficiencyBonus(13)).toBe(5);
    });

    it('debería retornar +5 para nivel 16', () => {
      expect(calculateProficiencyBonus(16)).toBe(5);
    });
  });

  describe('niveles 17-20 (bonificador +6)', () => {
    it('debería retornar +6 para nivel 17', () => {
      expect(calculateProficiencyBonus(17)).toBe(6);
    });

    it('debería retornar +6 para nivel 20', () => {
      expect(calculateProficiencyBonus(20)).toBe(6);
    });
  });

  describe('validación de entrada', () => {
    it('debería lanzar error si el nivel es 0', () => {
      expect(() => calculateProficiencyBonus(0)).toThrow(
        'Invalid character level: 0'
      );
    });

    it('debería lanzar error si el nivel es negativo', () => {
      expect(() => calculateProficiencyBonus(-5)).toThrow(
        'Invalid character level'
      );
    });

    it('debería lanzar error si el nivel es mayor a 20', () => {
      expect(() => calculateProficiencyBonus(21)).toThrow(
        'Invalid character level: 21'
      );
    });

    it('debería lanzar error si el nivel es 100', () => {
      expect(() => calculateProficiencyBonus(100)).toThrow(
        'Invalid character level'
      );
    });
  });
});

describe('calculateProficiencyBonusFormula', () => {
  it('debería dar los mismos resultados que la tabla para todos los niveles', () => {
    // Verificar que ambas implementaciones dan el mismo resultado
    for (let level = 1; level <= 20; level++) {
      const fromTable = calculateProficiencyBonus(level);
      const fromFormula = calculateProficiencyBonusFormula(level);
      
      expect(fromFormula).toBe(fromTable);
    }
  });

  it('debería calcular +2 para nivel 1 usando fórmula', () => {
    expect(calculateProficiencyBonusFormula(1)).toBe(2);
  });

  it('debería calcular +6 para nivel 20 usando fórmula', () => {
    expect(calculateProficiencyBonusFormula(20)).toBe(6);
  });

  it('debería lanzar error para niveles inválidos', () => {
    expect(() => calculateProficiencyBonusFormula(0)).toThrow();
    expect(() => calculateProficiencyBonusFormula(21)).toThrow();
  });
});

describe('isValidLevel', () => {
  it('debería retornar true para niveles válidos (1-20)', () => {
    expect(isValidLevel(1)).toBe(true);
    expect(isValidLevel(10)).toBe(true);
    expect(isValidLevel(20)).toBe(true);
  });

  it('debería retornar false para nivel 0', () => {
    expect(isValidLevel(0)).toBe(false);
  });

  it('debería retornar false para niveles mayores a 20', () => {
    expect(isValidLevel(21)).toBe(false);
    expect(isValidLevel(100)).toBe(false);
  });

  it('debería retornar false para niveles negativos', () => {
    expect(isValidLevel(-1)).toBe(false);
  });

  it('debería retornar false para números decimales', () => {
    expect(isValidLevel(5.5)).toBe(false);
    expect(isValidLevel(10.1)).toBe(false);
  });

  it('debería retornar false para NaN', () => {
    expect(isValidLevel(NaN)).toBe(false);
  });
});

describe('getLevelRangeForBonus', () => {
  it('debería retornar [1, 4] para bonificador +2', () => {
    expect(getLevelRangeForBonus(2)).toEqual([1, 4]);
  });

  it('debería retornar [5, 8] para bonificador +3', () => {
    expect(getLevelRangeForBonus(3)).toEqual([5, 8]);
  });

  it('debería retornar [9, 12] para bonificador +4', () => {
    expect(getLevelRangeForBonus(4)).toEqual([9, 12]);
  });

  it('debería retornar [13, 16] para bonificador +5', () => {
    expect(getLevelRangeForBonus(5)).toEqual([13, 16]);
  });

  it('debería retornar [17, 20] para bonificador +6', () => {
    expect(getLevelRangeForBonus(6)).toEqual([17, 20]);
  });

  it('debería retornar null para bonificadores inválidos', () => {
    expect(getLevelRangeForBonus(0)).toBeNull();
    expect(getLevelRangeForBonus(1)).toBeNull();
    expect(getLevelRangeForBonus(7)).toBeNull();
    expect(getLevelRangeForBonus(10)).toBeNull();
  });
});
