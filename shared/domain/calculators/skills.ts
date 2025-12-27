import type {
    SkillName,
    SkillProficiency,
    Skills,
    AbilityName,
    AbilityModifiers,
    SkillBonus,
    ProficiencyBonus
} from '../../types/character.js';
import { SKILL_TO_ABILITY } from '../../types/character.js';
import { calculateProficiencyBonus } from './proficiency.js';
import { calculateAbilityModifier } from './abilities.js';

/**
 * Calcula el bonificador total de una habilidad.
 * 
 * Fórmula: modificador de atributo + (competencia × bonificador de competencia)
 * Con expertise: modificador de atributo + (2 × bonificador de competencia)
 * 
 * @param skillName - Nombre de la habilidad
 * @param abilityModifiers - Modificadores de todos los atributos
 * @param proficiencyBonus - Bonificador de competencia del personaje
 * @param skillProficiency - Datos de competencia en la habilidad
 * @returns Bonificador total de la habilidad
 * 
 * @example
 * ```typescript
 * const bonus = calculateSkillBonus(
 *   'stealth',
 *   { dexterity: 3, ... },
 *   2,
 *   { proficient: true, expertise: false }
 * );
 * // Result: 5 (3 + 2)
 * ```
 */
export function calculateSkillBonus(
    skillName: SkillName,
    abilityModifiers: AbilityModifiers,
    proficiencyBonus: ProficiencyBonus,
    skillProficiency: SkillProficiency
): number {
    const abilityName = SKILL_TO_ABILITY[skillName];
    const abilityMod = abilityModifiers[abilityName];

    let bonus = abilityMod;

    if (skillProficiency.proficient) {
        if (skillProficiency.expertise) {
            // Expertise = doble bonificador de competencia
            bonus += proficiencyBonus * 2;
        } else {
            bonus += proficiencyBonus;
        }
    }

    return bonus;
}

/**
 * Calcula el bonificador detallado de una habilidad.
 * 
 * Devuelve un objeto con el desglose completo del cálculo.
 * 
 * @param skillName - Nombre de la habilidad
 * @param abilityModifiers - Modificadores de todos los atributos
 * @param proficiencyBonus - Bonificador de competencia del personaje
 * @param skillProficiency - Datos de competencia en la habilidad
 * @returns Objeto SkillBonus con desglose
 */
export function calculateSkillBonusDetailed(
    skillName: SkillName,
    abilityModifiers: AbilityModifiers,
    proficiencyBonus: ProficiencyBonus,
    skillProficiency: SkillProficiency
): SkillBonus {
    const abilityName = SKILL_TO_ABILITY[skillName];
    const abilityMod = abilityModifiers[abilityName];
    const isProficient = skillProficiency.proficient;
    const hasExpertise = skillProficiency.expertise ?? false;

    const bonus = calculateSkillBonus(
        skillName,
        abilityModifiers,
        proficiencyBonus,
        skillProficiency
    );

    return {
        skill: skillName,
        bonus,
        breakdown: {
            abilityModifier: abilityMod,
            proficiencyBonus,
            isProficient,
            hasExpertise,
        },
    };
}

/**
 * Calcula todos los bonificadores de habilidades de un personaje.
 * 
 * @param abilityModifiers - Modificadores de todos los atributos
 * @param proficiencyBonus - Bonificador de competencia del personaje
 * @param skills - Competencias en todas las habilidades
 * @returns Objeto con todos los bonificadores de habilidades
 */
export function calculateAllSkillBonuses(
    abilityModifiers: AbilityModifiers,
    proficiencyBonus: ProficiencyBonus,
    skills: Skills
): Record<SkillName, number> {
    const skillNames: SkillName[] = [
        'acrobatics', 'animalHandling', 'arcana', 'athletics',
        'deception', 'history', 'insight', 'intimidation',
        'investigation', 'medicine', 'nature', 'perception',
        'performance', 'persuasion', 'religion', 'sleightOfHand',
        'stealth', 'survival'
    ];

    const result = {} as Record<SkillName, number>;

    for (const skill of skillNames) {
        result[skill] = calculateSkillBonus(
            skill,
            abilityModifiers,
            proficiencyBonus,
            skills[skill]
        );
    }

    return result;
}

/**
 * Obtiene el atributo asociado a una habilidad.
 * 
 * @param skillName - Nombre de la habilidad
 * @returns Nombre del atributo asociado
 */
export function getSkillAbility(skillName: SkillName): AbilityName {
    return SKILL_TO_ABILITY[skillName];
}

/**
 * Formatea un bonificador de habilidad para mostrar en UI.
 * 
 * @param bonus - Bonificador a formatear
 * @returns String formateado ("+5", "-1", "0")
 */
export function formatSkillBonus(bonus: number): string {
    if (bonus > 0) {
        return `+${bonus}`;
    }
    return bonus.toString();
}
