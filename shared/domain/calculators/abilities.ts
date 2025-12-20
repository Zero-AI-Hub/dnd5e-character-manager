import type {
  AbilityScore,
  AbilityModifier,
  Abilities,
  AbilityModifiers,
  AbilityName
} from '../../types/character.js';

/**
 * Tabla de referencia de puntuaciones y modificadores (D&D 5e)
 * 
 * Score | Modifier | Score | Modifier
 * ------|----------|-------|----------
 * 1     | -5       | 16-17 | +3
 * 2-3   | -4       | 18-19 | +4
 * 4-5   | -3       | 20-21 | +5
 * 6-7   | -2       | 22-23 | +6
 * 8-9   | -1       | 24-25 | +7
 * 10-11 | +0       | 26-27 | +8
 * 12-13 | +1       | 28-29 | +9
 * 14-15 | +2       | 30    | +10
 */
const ABILITY_MODIFIER_REFERENCE = `
Ability Score → Modifier
─────────────────────────
 1       →  -5
 2-3     →  -4
 4-5     →  -3
 6-7     →  -2
 8-9     →  -1
10-11    →   0
12-13    →  +1
14-15    →  +2
16-17    →  +3
18-19    →  +4
20-21    →  +5
22-23    →  +6
24-25    →  +7
26-27    →  +8
28-29    →  +9
30       →  +10
`;

/**
 * Calcula el modificador de un atributo según las reglas de D&D 5e.
 * 
 * La fórmula oficial es: `modifier = floor((score - 10) / 2)`
 * 
 * El modificador se usa en:
 * - Tiradas de ataque
 * - Tiradas de salvación
 * - Chequeos de habilidad
 * - CD de hechizos
 * - Daño de armas
 * 
 * @param score - Puntuación del atributo (1-30)
 * @returns Modificador calculado (-5 a +10)
 * 
 * @throws {Error} Si el score está fuera del rango válido (1-30)
 * 
 * @example
 * ```typescript
 * calculateAbilityModifier(10)  // 0
 * calculateAbilityModifier(16)  // +3
 * calculateAbilityModifier(8)   // -1
 * calculateAbilityModifier(20)  // +5
 * ```
 */
export function calculateAbilityModifier(score: AbilityScore): AbilityModifier {
  // Validación de entrada
  if (!isValidAbilityScore(score)) {
    throw new Error(
      `Invalid ability score: ${score}. Must be between 1 and 30.`
    );
  }

  // Aplicar fórmula oficial de D&D 5e
  return Math.floor((score - 10) / 2);
}

/**
 * Calcula todos los modificadores de un conjunto de atributos.
 * 
 * Esta función es más eficiente que calcular cada modificador por separado
 * cuando necesitas todos a la vez (ej: para mostrar en la ficha).
 * 
 * @param abilities - Objeto con los 6 atributos
 * @returns Objeto con los 6 modificadores correspondientes
 * 
 * @throws {Error} Si alguno de los scores es inválido
 * 
 * @example
 * ```typescript
 * const abilities = {
 *   strength: 16,
 *   dexterity: 14,
 *   constitution: 13,
 *   intelligence: 8,
 *   wisdom: 10,
 *   charisma: 12
 * };
 * 
 * const modifiers = calculateAllAbilityModifiers(abilities);
 * // {
 * //   strength: 3,
 * //   dexterity: 2,
 * //   constitution: 1,
 * //   intelligence: -1,
 * //   wisdom: 0,
 * //   charisma: 1
 * // }
 * ```
 */
export function calculateAllAbilityModifiers(abilities: Abilities): AbilityModifiers {
  return {
    strength: calculateAbilityModifier(abilities.strength),
    dexterity: calculateAbilityModifier(abilities.dexterity),
    constitution: calculateAbilityModifier(abilities.constitution),
    intelligence: calculateAbilityModifier(abilities.intelligence),
    wisdom: calculateAbilityModifier(abilities.wisdom),
    charisma: calculateAbilityModifier(abilities.charisma),
  };
}

/**
 * Valida si una puntuación de atributo es válida para D&D 5e.
 * 
 * Rangos válidos:
 * - Mínimo: 1 (extremadamente débil, casi imposible)
 * - Máximo: 30 (límite divino en D&D 5e)
 * - Típico para PCs: 3-20
 * 
 * @param score - Valor a validar
 * @returns true si el score es válido (1-30 y entero)
 */
export function isValidAbilityScore(score: number): score is AbilityScore {
  return Number.isInteger(score) && score >= 1 && score <= 30;
}

/**
 * Formatea un modificador para mostrarlo en UI.
 * 
 * Añade el signo '+' para modificadores positivos,
 * mantiene el '-' para negativos, y muestra '0' sin signo.
 * 
 * @param modifier - Modificador a formatear
 * @returns String formateado ("+3", "-1", "0")
 * 
 * @example
 * ```typescript
 * formatModifier(3)   // "+3"
 * formatModifier(-1)  // "-1"
 * formatModifier(0)   // "0"
 * ```
 */
export function formatModifier(modifier: AbilityModifier): string {
  if (modifier > 0) {
    return `+${modifier}`;
  }
  return modifier.toString();
}

/**
 * Obtiene una descripción textual de qué tan bueno es un modificador.
 * 
 * Útil para dar feedback al usuario sobre sus atributos.
 * 
 * @param modifier - Modificador del atributo
 * @returns Descripción cualitativa
 * 
 * @example
 * ```typescript
 * getModifierDescription(5)   // "Excepcional"
 * getModifierDescription(3)   // "Muy bueno"
 * getModifierDescription(0)   // "Promedio"
 * getModifierDescription(-2)  // "Bajo"
 * ```
 */
export function getModifierDescription(modifier: AbilityModifier): string {
  if (modifier >= 5) return 'Excepcional';
  if (modifier >= 3) return 'Muy bueno';
  if (modifier >= 1) return 'Bueno';
  if (modifier === 0) return 'Promedio';
  if (modifier >= -2) return 'Bajo';
  return 'Muy bajo';
}

/**
 * Obtiene el rango de puntuaciones que dan un modificador específico.
 * 
 * @param modifier - Modificador deseado
 * @returns Rango [min, max] de scores, o null si el modifier no es válido
 * 
 * @example
 * ```typescript
 * getScoreRangeForModifier(0)   // [10, 11]
 * getScoreRangeForModifier(3)   // [16, 17]
 * getScoreRangeForModifier(-1)  // [8, 9]
 * ```
 */
export function getScoreRangeForModifier(
  modifier: AbilityModifier
): [min: number, max: number] | null {
  // Validar que el modifier esté en rango válido
  if (modifier < -5 || modifier > 10) {
    return null;
  }

  // Calcular rango usando la fórmula inversa
  // Si modifier = floor((score - 10) / 2)
  // Entonces score_min = (modifier * 2) + 10
  const minScore = (modifier * 2) + 10;
  const maxScore = (modifier * 2) + 11;

  // Ajustar bordes
  const clampedMin = Math.max(1, minScore);
  const clampedMax = Math.min(30, maxScore);

  return [clampedMin, clampedMax];
}

/**
 * Genera una tabla de referencia completa de scores y modificadores.
 * 
 * Útil para documentación o para mostrar en ayuda de la UI.
 * 
 * @returns String con la tabla formateada
 */
export function getModifierReferenceTable(): string {
  return ABILITY_MODIFIER_REFERENCE;
}

/**
 * Calcula cuántos puntos de atributo se necesitan para alcanzar
 * el siguiente modificador (usando point buy de D&D 5e).
 * 
 * @param currentScore - Puntuación actual
 * @returns Puntos necesarios para el siguiente modificador, o null si ya está al máximo
 * 
 * @example
 * ```typescript
 * pointsToNextModifier(15)  // 1 punto (15 → 16 = +2 → +3)
 * pointsToNextModifier(16)  // 2 puntos (16 → 18 = +3 → +4)
 * ```
 */
export function pointsToNextModifier(currentScore: AbilityScore): number | null {
  if (!isValidAbilityScore(currentScore) || currentScore >= 30) {
    return null;
  }

  const currentModifier = calculateAbilityModifier(currentScore);

  // Buscar el siguiente score que de un modifier mayor
  for (let score = currentScore + 1; score <= 30; score++) {
    const newModifier = calculateAbilityModifier(score);
    if (newModifier > currentModifier) {
      return score - currentScore;
    }
  }

  return null;
}
