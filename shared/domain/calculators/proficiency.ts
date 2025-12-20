import type { CharacterLevel, ProficiencyBonus } from '../../types/character.js';

/**
 * Tabla oficial de bonificadores de competencia por nivel (D&D 5e)
 * 
 * Niveles  | Bonificador
 * ---------|------------
 * 1-4      | +2
 * 5-8      | +3
 * 9-12     | +4
 * 13-16    | +5
 * 17-20    | +6
 */
const PROFICIENCY_BONUS_TABLE: Record<CharacterLevel, ProficiencyBonus> = {
  1: 2, 2: 2, 3: 2, 4: 2,
  5: 3, 6: 3, 7: 3, 8: 3,
  9: 4, 10: 4, 11: 4, 12: 4,
  13: 5, 14: 5, 15: 5, 16: 5,
  17: 6, 18: 6, 19: 6, 20: 6,
};

/**
 * Calcula el bonificador de competencia según el nivel del personaje.
 * 
 * Según las reglas de D&D 5e, el bonificador de competencia aumenta
 * cada 4 niveles, pero es más eficiente usar una tabla de lookup.
 * 
 * @param level - Nivel del personaje (1-20)
 * @returns Bonificador de competencia (+2 a +6)
 * 
 * @throws {Error} Si el nivel está fuera del rango válido (1-20)
 * 
 * @example
 * ```typescript
 * calculateProficiencyBonus(1)   // +2
 * calculateProficiencyBonus(5)   // +3
 * calculateProficiencyBonus(20)  // +6
 * ```
 */
export function calculateProficiencyBonus(level: CharacterLevel): ProficiencyBonus {
  // Validación de entrada
  if (level < 1 || level > 20) {
    throw new Error(
      `Invalid character level: ${level}. Must be between 1 and 20.`
    );
  }

  // Lookup en tabla (O(1))
  return PROFICIENCY_BONUS_TABLE[level];
}

/**
 * Fórmula alternativa (calculada) para el bonificador de competencia.
 * 
 * Esta función implementa la fórmula matemática:
 * proficiencyBonus = floor((level - 1) / 4) + 2
 * 
 * Es menos eficiente que la tabla de lookup, pero puede ser útil
 * para entender la lógica o para homebrew que modifique la progresión.
 * 
 * @param level - Nivel del personaje (1-20)
 * @returns Bonificador de competencia (+2 a +6)
 * 
 * @internal Esta función existe principalmente con fines educativos
 */
export function calculateProficiencyBonusFormula(level: CharacterLevel): ProficiencyBonus {
  if (level < 1 || level > 20) {
    throw new Error(
      `Invalid character level: ${level}. Must be between 1 and 20.`
    );
  }

  return Math.floor((level - 1) / 4) + 2;
}

/**
 * Valida si un nivel es válido para D&D 5e.
 * 
 * @param level - Nivel a validar
 * @returns true si el nivel es válido (1-20)
 */
export function isValidLevel(level: number): level is CharacterLevel {
  return Number.isInteger(level) && level >= 1 && level <= 20;
}

/**
 * Obtiene el rango de niveles para un bonificador específico.
 * 
 * @param bonus - Bonificador de competencia (+2 a +6)
 * @returns Rango de niveles [min, max] o null si el bonus no es válido
 * 
 * @example
 * ```typescript
 * getLevelRangeForBonus(2)  // [1, 4]
 * getLevelRangeForBonus(3)  // [5, 8]
 * getLevelRangeForBonus(6)  // [17, 20]
 * ```
 */
export function getLevelRangeForBonus(
  bonus: ProficiencyBonus
): [min: number, max: number] | null {
  const ranges: Record<ProficiencyBonus, [number, number]> = {
    2: [1, 4],
    3: [5, 8],
    4: [9, 12],
    5: [13, 16],
    6: [17, 20],
  };

  return ranges[bonus] || null;
}
