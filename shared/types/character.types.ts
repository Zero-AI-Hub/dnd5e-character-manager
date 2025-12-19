/**
 * Puntuación de un atributo (Fuerza, Destreza, etc.)
 * Rango válido: 1-30 (típicamente 3-20 para personajes)
 */
export type AbilityScore = number;

/**
 * Modificador derivado de un atributo
 * Rango: -5 a +10 (para scores de 1 a 30)
 */
export type AbilityModifier = number;

/**
 * Los 6 atributos de D&D 5e
 */
export interface Abilities {
  strength: AbilityScore;
  dexterity: AbilityScore;
  constitution: AbilityScore;
  intelligence: AbilityScore;
  wisdom: AbilityScore;
  charisma: AbilityScore;
}
