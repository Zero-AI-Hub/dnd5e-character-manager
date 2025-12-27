import { describe, it, expect } from 'vitest';
import {
    calculateSavingThrowBonus,
    calculateSavingThrowBonusDetailed,
    calculateAllSavingThrowBonuses,
    calculateAllSavingThrowBonusesDetailed,
    formatSavingThrowBonus,
    getClassSavingThrowProficiencies,
} from '@shared/domain/calculators/savingThrows';
import type { AbilityModifiers, SavingThrowProficiencies } from '@shared/types/character';

// Helper: crear modificadores de atributos
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

describe('calculateSavingThrowBonus', () => {
    describe('sin competencia', () => {
        it('devuelve solo el modificador de atributo', () => {
            const mods = createAbilityModifiers({ dexterity: 3 });
            const profs: SavingThrowProficiencies = [];

            expect(calculateSavingThrowBonus('dexterity', mods, 2, profs)).toBe(3);
        });

        it('devuelve modificador negativo correctamente', () => {
            const mods = createAbilityModifiers({ strength: -2 });
            const profs: SavingThrowProficiencies = [];

            expect(calculateSavingThrowBonus('strength', mods, 2, profs)).toBe(-2);
        });
    });

    describe('con competencia', () => {
        it('suma el bonificador de competencia', () => {
            const mods = createAbilityModifiers({ dexterity: 3 });
            const profs: SavingThrowProficiencies = ['dexterity'];

            expect(calculateSavingThrowBonus('dexterity', mods, 2, profs)).toBe(5);
        });

        it('no suma si no tiene competencia en ese atributo', () => {
            const mods = createAbilityModifiers({ dexterity: 3, strength: 2 });
            const profs: SavingThrowProficiencies = ['strength'];

            expect(calculateSavingThrowBonus('dexterity', mods, 2, profs)).toBe(3);
            expect(calculateSavingThrowBonus('strength', mods, 2, profs)).toBe(4);
        });

        it('funciona con múltiples competencias', () => {
            const mods = createAbilityModifiers({ dexterity: 3, charisma: 2 });
            const profs: SavingThrowProficiencies = ['dexterity', 'charisma'];

            expect(calculateSavingThrowBonus('dexterity', mods, 2, profs)).toBe(5);
            expect(calculateSavingThrowBonus('charisma', mods, 2, profs)).toBe(4);
        });
    });
});

describe('calculateSavingThrowBonusDetailed', () => {
    it('devuelve el desglose completo con competencia', () => {
        const mods = createAbilityModifiers({ dexterity: 3 });
        const profs: SavingThrowProficiencies = ['dexterity'];

        const result = calculateSavingThrowBonusDetailed('dexterity', mods, 2, profs);

        expect(result.ability).toBe('dexterity');
        expect(result.bonus).toBe(5);
        expect(result.isProficient).toBe(true);
    });

    it('devuelve el desglose sin competencia', () => {
        const mods = createAbilityModifiers({ wisdom: 1 });
        const profs: SavingThrowProficiencies = ['dexterity'];

        const result = calculateSavingThrowBonusDetailed('wisdom', mods, 2, profs);

        expect(result.ability).toBe('wisdom');
        expect(result.bonus).toBe(1);
        expect(result.isProficient).toBe(false);
    });
});

describe('calculateAllSavingThrowBonuses', () => {
    it('calcula los 6 atributos', () => {
        const mods = createAbilityModifiers({
            strength: 2,
            dexterity: 3,
            constitution: 1,
            intelligence: 0,
            wisdom: -1,
            charisma: 2,
        });
        const profs: SavingThrowProficiencies = ['dexterity', 'intelligence']; // Rogue

        const result = calculateAllSavingThrowBonuses(mods, 2, profs);

        expect(result.strength).toBe(2);      // No prof
        expect(result.dexterity).toBe(5);     // Prof
        expect(result.constitution).toBe(1);  // No prof
        expect(result.intelligence).toBe(2);  // Prof
        expect(result.wisdom).toBe(-1);       // No prof
        expect(result.charisma).toBe(2);      // No prof
    });
});

describe('calculateAllSavingThrowBonusesDetailed', () => {
    it('devuelve array de 6 elementos', () => {
        const mods = createAbilityModifiers();
        const profs: SavingThrowProficiencies = ['strength', 'constitution'];

        const result = calculateAllSavingThrowBonusesDetailed(mods, 2, profs);

        expect(result).toHaveLength(6);
        expect(result[0].ability).toBe('strength');
        expect(result[0].isProficient).toBe(true);
        expect(result[1].ability).toBe('dexterity');
        expect(result[1].isProficient).toBe(false);
    });
});

describe('formatSavingThrowBonus', () => {
    it('añade + para positivos', () => {
        expect(formatSavingThrowBonus(5)).toBe('+5');
    });

    it('mantiene - para negativos', () => {
        expect(formatSavingThrowBonus(-2)).toBe('-2');
    });

    it('muestra 0 sin signo', () => {
        expect(formatSavingThrowBonus(0)).toBe('0');
    });
});

describe('getClassSavingThrowProficiencies', () => {
    it('devuelve competencias correctas para Fighter', () => {
        const profs = getClassSavingThrowProficiencies('fighter');
        expect(profs).toContain('strength');
        expect(profs).toContain('constitution');
    });

    it('devuelve competencias correctas para Rogue', () => {
        const profs = getClassSavingThrowProficiencies('rogue');
        expect(profs).toContain('dexterity');
        expect(profs).toContain('intelligence');
    });

    it('devuelve competencias correctas para Wizard', () => {
        const profs = getClassSavingThrowProficiencies('wizard');
        expect(profs).toContain('intelligence');
        expect(profs).toContain('wisdom');
    });

    it('es case-insensitive', () => {
        expect(getClassSavingThrowProficiencies('FIGHTER')).toEqual(
            getClassSavingThrowProficiencies('fighter')
        );
    });

    it('devuelve undefined para clase desconocida', () => {
        expect(getClassSavingThrowProficiencies('homebrew')).toBeUndefined();
    });

    it('cubre todas las 12 clases SRD', () => {
        const classes = [
            'barbarian', 'bard', 'cleric', 'druid', 'fighter', 'monk',
            'paladin', 'ranger', 'rogue', 'sorcerer', 'warlock', 'wizard'
        ];

        for (const cls of classes) {
            const profs = getClassSavingThrowProficiencies(cls);
            expect(profs).toBeDefined();
            expect(profs).toHaveLength(2);
        }
    });
});
