import type {
    CharacterLevel,
    AbilityModifier
} from '../../types/character.js';

/**
 * Tipos de dados de golpe por clase (SRD)
 */
export type HitDie = 6 | 8 | 10 | 12;

/**
 * Mapeo de clase a dado de golpe (SRD)
 */
const CLASS_HIT_DICE: Record<string, HitDie> = {
    barbarian: 12,
    bard: 8,
    cleric: 8,
    druid: 8,
    fighter: 10,
    monk: 8,
    paladin: 10,
    ranger: 10,
    rogue: 8,
    sorcerer: 6,
    warlock: 8,
    wizard: 6,
};

/**
 * Obtiene el dado de golpe de una clase.
 * 
 * @param className - Nombre de la clase
 * @returns Dado de golpe (d6, d8, d10, d12) o undefined si la clase no existe
 */
export function getClassHitDie(className: string): HitDie | undefined {
    return CLASS_HIT_DICE[className.toLowerCase()];
}

/**
 * Calcula los puntos de golpe máximos a nivel 1.
 * 
 * Regla D&D 5e: A nivel 1, HP = dado de golpe máximo + CON mod
 * 
 * @param hitDie - Dado de golpe de la clase
 * @param constitutionModifier - Modificador de Constitución
 * @returns Puntos de golpe máximos a nivel 1 (mínimo 1)
 * 
 * @example
 * ```typescript
 * calculateLevel1HP(10, 2);  // 12 (Fighter con CON +2)
 * calculateLevel1HP(6, -1);  // 5 (Wizard con CON -1)
 * ```
 */
export function calculateLevel1HP(
    hitDie: HitDie,
    constitutionModifier: AbilityModifier
): number {
    const hp = hitDie + constitutionModifier;
    // Mínimo 1 HP
    return Math.max(1, hp);
}

/**
 * Calcula el HP promedio ganado por nivel (después del 1).
 * 
 * Regla D&D 5e: HP por nivel = (dado/2 + 1, redondeado arriba) + CON mod
 * O bien se tira el dado.
 * 
 * @param hitDie - Dado de golpe de la clase
 * @returns HP promedio por nivel (sin CON mod)
 */
export function getAverageHPPerLevel(hitDie: HitDie): number {
    // D&D 5e usa dado/2 + 1 (redondeado arriba)
    return Math.ceil(hitDie / 2) + 1;
}

/**
 * Calcula los puntos de golpe máximos usando el método promedio.
 * 
 * Fórmula: (HD + CON) + ((nivel - 1) × (HP promedio + CON))
 * 
 * @param hitDie - Dado de golpe de la clase
 * @param level - Nivel del personaje (1-20)
 * @param constitutionModifier - Modificador de Constitución
 * @returns Puntos de golpe máximos (mínimo = nivel)
 * 
 * @example
 * ```typescript
 * // Fighter nivel 5 con CON +3
 * calculateMaxHP(10, 5, 3);  // 13 + (4 × 9) = 49
 * ```
 */
export function calculateMaxHP(
    hitDie: HitDie,
    level: CharacterLevel,
    constitutionModifier: AbilityModifier
): number {
    if (level < 1 || level > 20) {
        throw new Error(`Invalid level: ${level}. Must be between 1 and 20.`);
    }

    // Nivel 1: dado máximo + CON
    const level1HP = hitDie + constitutionModifier;

    if (level === 1) {
        return Math.max(1, level1HP);
    }

    // Niveles 2+: HP promedio + CON por nivel
    const avgHPPerLevel = getAverageHPPerLevel(hitDie);
    const additionalLevels = level - 1;
    const additionalHP = additionalLevels * (avgHPPerLevel + constitutionModifier);

    const totalHP = level1HP + additionalHP;

    // Mínimo 1 HP por nivel
    return Math.max(level, totalHP);
}

/**
 * Calcula los puntos de golpe máximos para una clase específica.
 * 
 * @param className - Nombre de la clase
 * @param level - Nivel del personaje
 * @param constitutionModifier - Modificador de Constitución
 * @returns Puntos de golpe máximos
 * @throws Error si la clase no existe
 */
export function calculateClassMaxHP(
    className: string,
    level: CharacterLevel,
    constitutionModifier: AbilityModifier
): number {
    const hitDie = getClassHitDie(className);

    if (!hitDie) {
        throw new Error(`Unknown class: ${className}`);
    }

    return calculateMaxHP(hitDie, level, constitutionModifier);
}

/**
 * Información detallada de HP
 */
export interface HPDetails {
    maxHP: number;
    hitDie: HitDie;
    level: number;
    constitutionModifier: number;
    breakdown: {
        level1HP: number;
        avgHPPerLevel: number;
        additionalLevels: number;
        additionalHP: number;
    };
}

/**
 * Calcula los puntos de golpe con desglose detallado.
 * 
 * @param hitDie - Dado de golpe de la clase
 * @param level - Nivel del personaje
 * @param constitutionModifier - Modificador de Constitución
 * @returns Objeto con HP y desglose del cálculo
 */
export function calculateMaxHPDetailed(
    hitDie: HitDie,
    level: CharacterLevel,
    constitutionModifier: AbilityModifier
): HPDetails {
    const level1HP = hitDie + constitutionModifier;
    const avgHPPerLevel = getAverageHPPerLevel(hitDie);
    const additionalLevels = Math.max(0, level - 1);
    const additionalHP = additionalLevels * (avgHPPerLevel + constitutionModifier);

    const maxHP = calculateMaxHP(hitDie, level, constitutionModifier);

    return {
        maxHP,
        hitDie,
        level,
        constitutionModifier,
        breakdown: {
            level1HP: Math.max(1, level1HP),
            avgHPPerLevel,
            additionalLevels,
            additionalHP,
        },
    };
}
