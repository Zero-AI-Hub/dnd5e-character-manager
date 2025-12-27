import { describe, it, expect } from 'vitest';
import {
    calculateSkillBonus,
    calculateSkillBonusDetailed,
    calculateAllSkillBonuses,
    getSkillAbility,
    formatSkillBonus,
} from '@shared/domain/calculators/skills';
import type { AbilityModifiers, Skills, SkillProficiency } from '@shared/types/character';

// Helper: crear modificadores de atributos de ejemplo
function createAbilityModifiers(overrides: Partial<AbilityModifiers> = {}): AbilityModifiers {
    return {
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
        ...overrides,
    };
}

// Helper: crear competencias de habilidades vacías
function createEmptySkills(): Skills {
    const skills: Partial<Skills> = {};
    const skillNames = [
        'acrobatics', 'animalHandling', 'arcana', 'athletics',
        'deception', 'history', 'insight', 'intimidation',
        'investigation', 'medicine', 'nature', 'perception',
        'performance', 'persuasion', 'religion', 'sleightOfHand',
        'stealth', 'survival'
    ] as const;

    for (const skill of skillNames) {
        skills[skill] = { proficient: false };
    }

    return skills as Skills;
}

describe('calculateSkillBonus', () => {
    describe('sin competencia', () => {
        it('devuelve solo el modificador de atributo', () => {
            const mods = createAbilityModifiers({ dexterity: 3 });
            const prof: SkillProficiency = { proficient: false };

            expect(calculateSkillBonus('stealth', mods, 2, prof)).toBe(3);
        });

        it('devuelve modificador negativo correctamente', () => {
            const mods = createAbilityModifiers({ strength: -2 });
            const prof: SkillProficiency = { proficient: false };

            expect(calculateSkillBonus('athletics', mods, 2, prof)).toBe(-2);
        });

        it('devuelve 0 para modificador 0', () => {
            const mods = createAbilityModifiers({ wisdom: 0 });
            const prof: SkillProficiency = { proficient: false };

            expect(calculateSkillBonus('perception', mods, 2, prof)).toBe(0);
        });
    });

    describe('con competencia', () => {
        it('suma el bonificador de competencia al modificador', () => {
            const mods = createAbilityModifiers({ dexterity: 3 });
            const prof: SkillProficiency = { proficient: true };

            expect(calculateSkillBonus('stealth', mods, 2, prof)).toBe(5); // 3 + 2
        });

        it('funciona con diferentes niveles de competencia', () => {
            const mods = createAbilityModifiers({ intelligence: 2 });
            const prof: SkillProficiency = { proficient: true };

            expect(calculateSkillBonus('arcana', mods, 3, prof)).toBe(5); // 2 + 3
            expect(calculateSkillBonus('arcana', mods, 4, prof)).toBe(6); // 2 + 4
            expect(calculateSkillBonus('arcana', mods, 6, prof)).toBe(8); // 2 + 6
        });

        it('funciona con modificador negativo y competencia', () => {
            const mods = createAbilityModifiers({ charisma: -1 });
            const prof: SkillProficiency = { proficient: true };

            expect(calculateSkillBonus('persuasion', mods, 2, prof)).toBe(1); // -1 + 2
        });
    });

    describe('con expertise (pericia)', () => {
        it('duplica el bonificador de competencia', () => {
            const mods = createAbilityModifiers({ dexterity: 3 });
            const prof: SkillProficiency = { proficient: true, expertise: true };

            expect(calculateSkillBonus('stealth', mods, 2, prof)).toBe(7); // 3 + (2 * 2)
        });

        it('expertise nivel alto genera bonificadores grandes', () => {
            const mods = createAbilityModifiers({ charisma: 5 });
            const prof: SkillProficiency = { proficient: true, expertise: true };

            expect(calculateSkillBonus('persuasion', mods, 6, prof)).toBe(17); // 5 + (6 * 2)
        });

        it('expertise sin proficient no suma nada (expertise requiere proficiency)', () => {
            const mods = createAbilityModifiers({ dexterity: 3 });
            // Caso edge: expertise = true pero proficient = false (inválido en D&D pero manejado)
            const prof: SkillProficiency = { proficient: false, expertise: true };

            expect(calculateSkillBonus('stealth', mods, 2, prof)).toBe(3);
        });
    });

    describe('mapeo correcto de habilidades a atributos', () => {
        it('acrobatics usa dexterity', () => {
            const mods = createAbilityModifiers({ dexterity: 4, strength: 1 });
            expect(calculateSkillBonus('acrobatics', mods, 2, { proficient: false })).toBe(4);
        });

        it('athletics usa strength', () => {
            const mods = createAbilityModifiers({ strength: 3, dexterity: 1 });
            expect(calculateSkillBonus('athletics', mods, 2, { proficient: false })).toBe(3);
        });

        it('arcana usa intelligence', () => {
            const mods = createAbilityModifiers({ intelligence: 2, wisdom: 1 });
            expect(calculateSkillBonus('arcana', mods, 2, { proficient: false })).toBe(2);
        });

        it('insight usa wisdom', () => {
            const mods = createAbilityModifiers({ wisdom: 2, intelligence: 1 });
            expect(calculateSkillBonus('insight', mods, 2, { proficient: false })).toBe(2);
        });

        it('persuasion usa charisma', () => {
            const mods = createAbilityModifiers({ charisma: 3, wisdom: 1 });
            expect(calculateSkillBonus('persuasion', mods, 2, { proficient: false })).toBe(3);
        });
    });
});

describe('calculateSkillBonusDetailed', () => {
    it('devuelve el desglose completo', () => {
        const mods = createAbilityModifiers({ dexterity: 3 });
        const prof: SkillProficiency = { proficient: true };

        const result = calculateSkillBonusDetailed('stealth', mods, 2, prof);

        expect(result.skill).toBe('stealth');
        expect(result.bonus).toBe(5);
        expect(result.breakdown.abilityModifier).toBe(3);
        expect(result.breakdown.proficiencyBonus).toBe(2);
        expect(result.breakdown.isProficient).toBe(true);
        expect(result.breakdown.hasExpertise).toBe(false);
    });

    it('marca expertise correctamente', () => {
        const mods = createAbilityModifiers({ dexterity: 3 });
        const prof: SkillProficiency = { proficient: true, expertise: true };

        const result = calculateSkillBonusDetailed('stealth', mods, 2, prof);

        expect(result.bonus).toBe(7);
        expect(result.breakdown.hasExpertise).toBe(true);
    });
});

describe('calculateAllSkillBonuses', () => {
    it('calcula todas las 18 habilidades', () => {
        const mods = createAbilityModifiers({
            strength: 2,
            dexterity: 3,
            constitution: 1,
            intelligence: 0,
            wisdom: 1,
            charisma: -1,
        });
        const skills = createEmptySkills();
        skills.stealth = { proficient: true };
        skills.persuasion = { proficient: true, expertise: true };

        const result = calculateAllSkillBonuses(mods, 2, skills);

        // Verificar que hay 18 habilidades
        expect(Object.keys(result)).toHaveLength(18);

        // Verificar cálculos específicos
        expect(result.athletics).toBe(2);      // STR +2, no prof
        expect(result.stealth).toBe(5);        // DEX +3 + prof 2
        expect(result.persuasion).toBe(3);     // CHA -1 + expertise 4
        expect(result.perception).toBe(1);     // WIS +1, no prof
    });
});

describe('getSkillAbility', () => {
    it('devuelve el atributo correcto para cada habilidad', () => {
        expect(getSkillAbility('acrobatics')).toBe('dexterity');
        expect(getSkillAbility('athletics')).toBe('strength');
        expect(getSkillAbility('arcana')).toBe('intelligence');
        expect(getSkillAbility('insight')).toBe('wisdom');
        expect(getSkillAbility('persuasion')).toBe('charisma');
    });
});

describe('formatSkillBonus', () => {
    it('añade + para bonificadores positivos', () => {
        expect(formatSkillBonus(5)).toBe('+5');
        expect(formatSkillBonus(1)).toBe('+1');
    });

    it('mantiene - para negativos', () => {
        expect(formatSkillBonus(-1)).toBe('-1');
        expect(formatSkillBonus(-5)).toBe('-5');
    });

    it('muestra 0 sin signo', () => {
        expect(formatSkillBonus(0)).toBe('0');
    });
});
