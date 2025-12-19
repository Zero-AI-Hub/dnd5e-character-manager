import type { AbilityScore, AbilityModifier } from '@shared/types/character.types';

/**
 * Calcula el modificador de un atributo según las reglas de D&D 5e.
 * 
 * Fórmula: floor((score - 10) / 2)
 * 
 * Ejemplos:
 * - Score 10 → Modificador +0
 * - Score 16 → Modificador +3
 * - Score 8  → Modificador -1
 * 
 * @param score - Puntuación del atributo (1-30)
 * @returns Modificador calculado (-5 a +10)
 * 
 * @throws {Error} Si el score está fuera del rango válido
 */
export function calculateModifier(score: AbilityScore): AbilityModifier {
  // Validación de entrada
  if (score < 1 || score > 30) {
    throw new Error(`Invalid ability score: ${score}. Must be between 1 and 30.`);
  }
  
  // Cálculo según reglas D&D 5e
  return Math.floor((score - 10) / 2);
}

/**
 * Calcula todos los modificadores de un conjunto de atributos.
 * 
 * @param abilities - Objeto con los 6 atributos
 * @returns Objeto con los 6 modificadores correspondientes
 */
export function calculateAllModifiers(abilities: {
  strength: AbilityScore;
  dexterity: AbilityScore;
  constitution: AbilityScore;
  intelligence: AbilityScore;
  wisdom: AbilityScore;
  charisma: AbilityScore;
}): {
  strength: AbilityModifier;
  dexterity: AbilityModifier;
  constitution: AbilityModifier;
  intelligence: AbilityModifier;
  wisdom: AbilityModifier;
  charisma: AbilityModifier;
} {
  return {
    strength: calculateModifier(abilities.strength),
    dexterity: calculateModifier(abilities.dexterity),
    constitution: calculateModifier(abilities.constitution),
    intelligence: calculateModifier(abilities.intelligence),
    wisdom: calculateModifier(abilities.wisdom),
    charisma: calculateModifier(abilities.charisma),
  };
}
