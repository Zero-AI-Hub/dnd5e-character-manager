import { describe, it, expect } from 'vitest';
import {
    getClassHitDie,
    calculateLevel1HP,
    getAverageHPPerLevel,
    calculateMaxHP,
    calculateClassMaxHP,
    calculateMaxHPDetailed,
} from '@shared/domain/calculators/hitPoints';

describe('getClassHitDie', () => {
    it('devuelve d12 para Barbarian', () => {
        expect(getClassHitDie('barbarian')).toBe(12);
    });

    it('devuelve d10 para Fighter', () => {
        expect(getClassHitDie('fighter')).toBe(10);
    });

    it('devuelve d8 para Cleric', () => {
        expect(getClassHitDie('cleric')).toBe(8);
    });

    it('devuelve d6 para Wizard', () => {
        expect(getClassHitDie('wizard')).toBe(6);
    });

    it('es case-insensitive', () => {
        expect(getClassHitDie('FIGHTER')).toBe(10);
        expect(getClassHitDie('Fighter')).toBe(10);
    });

    it('devuelve undefined para clase desconocida', () => {
        expect(getClassHitDie('homebrew')).toBeUndefined();
    });

    it('cubre las 12 clases SRD', () => {
        const expectedDice: Record<string, number> = {
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

        for (const [cls, expectedDie] of Object.entries(expectedDice)) {
            expect(getClassHitDie(cls)).toBe(expectedDie);
        }
    });
});

describe('calculateLevel1HP', () => {
    it('suma dado máximo + CON mod', () => {
        expect(calculateLevel1HP(10, 2)).toBe(12);  // Fighter CON +2
        expect(calculateLevel1HP(12, 3)).toBe(15);  // Barbarian CON +3
        expect(calculateLevel1HP(6, 1)).toBe(7);    // Wizard CON +1
    });

    it('funciona con CON negativo', () => {
        expect(calculateLevel1HP(6, -1)).toBe(5);   // Wizard CON -1
        expect(calculateLevel1HP(8, -2)).toBe(6);   // Rogue CON -2
    });

    it('tiene mínimo de 1 HP', () => {
        expect(calculateLevel1HP(6, -10)).toBe(1);  // Edge case extremo
    });
});

describe('getAverageHPPerLevel', () => {
    it('d12 → 7', () => expect(getAverageHPPerLevel(12)).toBe(7));
    it('d10 → 6', () => expect(getAverageHPPerLevel(10)).toBe(6));
    it('d8 → 5', () => expect(getAverageHPPerLevel(8)).toBe(5));
    it('d6 → 4', () => expect(getAverageHPPerLevel(6)).toBe(4));
});

describe('calculateMaxHP', () => {
    describe('nivel 1', () => {
        it('devuelve dado máximo + CON', () => {
            expect(calculateMaxHP(10, 1, 2)).toBe(12);  // Fighter
            expect(calculateMaxHP(12, 1, 3)).toBe(15);  // Barbarian
        });
    });

    describe('niveles superiores', () => {
        it('Fighter nivel 5 CON +3', () => {
            // Nivel 1: 10 + 3 = 13
            // Niveles 2-5: 4 × (6 + 3) = 36
            // Total: 49
            expect(calculateMaxHP(10, 5, 3)).toBe(49);
        });

        it('Wizard nivel 10 CON +1', () => {
            // Nivel 1: 6 + 1 = 7
            // Niveles 2-10: 9 × (4 + 1) = 45
            // Total: 52
            expect(calculateMaxHP(6, 10, 1)).toBe(52);
        });

        it('Barbarian nivel 20 CON +5', () => {
            // Nivel 1: 12 + 5 = 17
            // Niveles 2-20: 19 × (7 + 5) = 228
            // Total: 245
            expect(calculateMaxHP(12, 20, 5)).toBe(245);
        });
    });

    describe('CON negativo', () => {
        it('mínimo HP por nivel', () => {
            // Fighter nivel 3 CON -2
            // Nivel 1: 10 - 2 = 8
            // Niveles 2-3: 2 × (6 - 2) = 8
            // Total: 16
            expect(calculateMaxHP(10, 3, -2)).toBe(16);
        });

        it('HP mínimo = nivel', () => {
            // Wizard nivel 5 con CON muy bajo
            // El minimo deberia ser 5 (nivel)
            expect(calculateMaxHP(6, 5, -10)).toBe(5);
        });
    });

    describe('validación', () => {
        it('lanza error para nivel 0', () => {
            expect(() => calculateMaxHP(10, 0, 2)).toThrow();
        });

        it('lanza error para nivel 21', () => {
            expect(() => calculateMaxHP(10, 21, 2)).toThrow();
        });
    });
});

describe('calculateClassMaxHP', () => {
    it('calcula HP para Fighter', () => {
        // Fighter nivel 5 CON +2: 12 + (4 × 8) = 44
        expect(calculateClassMaxHP('fighter', 5, 2)).toBe(44);
    });

    it('calcula HP para Wizard', () => {
        // Wizard nivel 3 CON +0: 6 + (2 × 4) = 14
        expect(calculateClassMaxHP('wizard', 3, 0)).toBe(14);
    });

    it('lanza error para clase desconocida', () => {
        expect(() => calculateClassMaxHP('invalid', 1, 0)).toThrow('Unknown class');
    });
});

describe('calculateMaxHPDetailed', () => {
    it('devuelve desglose completo', () => {
        const result = calculateMaxHPDetailed(10, 5, 3);

        expect(result.maxHP).toBe(49);
        expect(result.hitDie).toBe(10);
        expect(result.level).toBe(5);
        expect(result.constitutionModifier).toBe(3);
        expect(result.breakdown.level1HP).toBe(13);
        expect(result.breakdown.avgHPPerLevel).toBe(6);
        expect(result.breakdown.additionalLevels).toBe(4);
        expect(result.breakdown.additionalHP).toBe(36);
    });
});
