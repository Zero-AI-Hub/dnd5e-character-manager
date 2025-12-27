import type {
    AbilityName,
    AbilityModifiers,
    SavingThrowProficiencies,
    SavingThrowBonus,
    ProficiencyBonus
} from '../../types/character.js';

/**
 * Los 6 atributos para tiradas de salvación
 */
const ABILITY_NAMES: AbilityName[] = [
    'strength', 'dexterity', 'constitution',
    'intelligence', 'wisdom', 'charisma'
];

/**
 * Calcula el bonificador de tirada de salvación para un atributo.
 * 
 * Fórmula: modificador de atributo + (competencia × bonificador de competencia)
 * 
 * @param abilityName - Nombre del atributo
 * @param abilityModifiers - Modificadores de todos los atributos
 * @param proficiencyBonus - Bonificador de competencia del personaje
 * @param savingThrowProficiencies - Lista de atributos con competencia en salvación
 * @returns Bonificador total de la tirada de salvación
 * 
 * @example
 * ```typescript
 * const bonus = calculateSavingThrowBonus(
 *   'dexterity',
 *   { dexterity: 3, ... },
 *   2,
 *   ['dexterity', 'charisma'] // Pícaro tiene competencia en DEX y CHA
 * );
 * // Result: 5 (3 + 2)
 * ```
 */
export function calculateSavingThrowBonus(
    abilityName: AbilityName,
    abilityModifiers: AbilityModifiers,
    proficiencyBonus: ProficiencyBonus,
    savingThrowProficiencies: SavingThrowProficiencies
): number {
    const abilityMod = abilityModifiers[abilityName];
    const isProficient = savingThrowProficiencies.includes(abilityName);

    if (isProficient) {
        return abilityMod + proficiencyBonus;
    }

    return abilityMod;
}

/**
 * Calcula el bonificador detallado de una tirada de salvación.
 * 
 * @param abilityName - Nombre del atributo
 * @param abilityModifiers - Modificadores de todos los atributos
 * @param proficiencyBonus - Bonificador de competencia del personaje
 * @param savingThrowProficiencies - Lista de atributos con competencia en salvación
 * @returns Objeto SavingThrowBonus con desglose
 */
export function calculateSavingThrowBonusDetailed(
    abilityName: AbilityName,
    abilityModifiers: AbilityModifiers,
    proficiencyBonus: ProficiencyBonus,
    savingThrowProficiencies: SavingThrowProficiencies
): SavingThrowBonus {
    const isProficient = savingThrowProficiencies.includes(abilityName);
    const bonus = calculateSavingThrowBonus(
        abilityName,
        abilityModifiers,
        proficiencyBonus,
        savingThrowProficiencies
    );

    return {
        ability: abilityName,
        bonus,
        isProficient,
    };
}

/**
 * Calcula todos los bonificadores de tiradas de salvación.
 * 
 * @param abilityModifiers - Modificadores de todos los atributos
 * @param proficiencyBonus - Bonificador de competencia del personaje
 * @param savingThrowProficiencies - Lista de atributos con competencia en salvación
 * @returns Objeto con todos los bonificadores de salvación
 */
export function calculateAllSavingThrowBonuses(
    abilityModifiers: AbilityModifiers,
    proficiencyBonus: ProficiencyBonus,
    savingThrowProficiencies: SavingThrowProficiencies
): Record<AbilityName, number> {
    const result = {} as Record<AbilityName, number>;

    for (const ability of ABILITY_NAMES) {
        result[ability] = calculateSavingThrowBonus(
            ability,
            abilityModifiers,
            proficiencyBonus,
            savingThrowProficiencies
        );
    }

    return result;
}

/**
 * Calcula todos los bonificadores de salvación con desglose detallado.
 * 
 * @param abilityModifiers - Modificadores de todos los atributos
 * @param proficiencyBonus - Bonificador de competencia del personaje
 * @param savingThrowProficiencies - Lista de atributos con competencia en salvación
 * @returns Array de SavingThrowBonus para todos los atributos
 */
export function calculateAllSavingThrowBonusesDetailed(
    abilityModifiers: AbilityModifiers,
    proficiencyBonus: ProficiencyBonus,
    savingThrowProficiencies: SavingThrowProficiencies
): SavingThrowBonus[] {
    return ABILITY_NAMES.map(ability =>
        calculateSavingThrowBonusDetailed(
            ability,
            abilityModifiers,
            proficiencyBonus,
            savingThrowProficiencies
        )
    );
}

/**
 * Formatea un bonificador de salvación para mostrar en UI.
 * 
 * @param bonus - Bonificador a formatear
 * @returns String formateado ("+5", "-1", "0")
 */
export function formatSavingThrowBonus(bonus: number): string {
    if (bonus > 0) {
        return `+${bonus}`;
    }
    return bonus.toString();
}

/**
 * Obtiene las competencias de salvación de una clase (SRD).
 * 
 * @param className - Nombre de la clase
 * @returns Lista de atributos con competencia, o undefined si no existe
 */
export function getClassSavingThrowProficiencies(
    className: string
): SavingThrowProficiencies | undefined {
    const classProficiencies: Record<string, SavingThrowProficiencies> = {
        barbarian: ['strength', 'constitution'],
        bard: ['dexterity', 'charisma'],
        cleric: ['wisdom', 'charisma'],
        druid: ['intelligence', 'wisdom'],
        fighter: ['strength', 'constitution'],
        monk: ['strength', 'dexterity'],
        paladin: ['wisdom', 'charisma'],
        ranger: ['strength', 'dexterity'],
        rogue: ['dexterity', 'intelligence'],
        sorcerer: ['constitution', 'charisma'],
        warlock: ['wisdom', 'charisma'],
        wizard: ['intelligence', 'wisdom'],
    };

    return classProficiencies[className.toLowerCase()];
}
