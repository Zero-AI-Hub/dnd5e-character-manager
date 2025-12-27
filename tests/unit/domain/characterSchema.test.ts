import { describe, it, expect, beforeEach } from 'vitest';
import {
    SCHEMA_VERSION,
    createEmptySkills,
    createDefaultCharacter,
    createFileMetadata,
    createCharacterFile,
    serializeCharacter,
    deserializeCharacter,
    validateCharacter,
    updateMetadata,
    CHARACTER_FILE_EXTENSION,
} from '@shared/domain/persistence/characterSchema';

describe('createEmptySkills', () => {
    it('crea objeto con las 18 habilidades', () => {
        const skills = createEmptySkills();
        expect(Object.keys(skills)).toHaveLength(18);
    });

    it('todas las habilidades no tienen competencia', () => {
        const skills = createEmptySkills();
        for (const skill of Object.values(skills)) {
            expect(skill.proficient).toBe(false);
        }
    });
});

describe('createDefaultCharacter', () => {
    it('crea personaje con valores por defecto', () => {
        const char = createDefaultCharacter();

        expect(char.basics.name).toBe('Nuevo Personaje');
        expect(char.basics.level).toBe(1);
        expect(char.abilities.strength).toBe(10);
        expect(char.savingThrows).toEqual([]);
    });

    it('todos los atributos en 10', () => {
        const char = createDefaultCharacter();
        const abilities = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];

        for (const ability of abilities) {
            expect(char.abilities[ability as keyof typeof char.abilities]).toBe(10);
        }
    });
});

describe('createFileMetadata', () => {
    it('incluye versión actual', () => {
        const meta = createFileMetadata();
        expect(meta.version).toBe(SCHEMA_VERSION);
    });

    it('incluye timestamps', () => {
        const meta = createFileMetadata();
        expect(meta.createdAt).toBeDefined();
        expect(meta.updatedAt).toBeDefined();
    });
});

describe('createCharacterFile', () => {
    it('crea archivo con metadata y personaje por defecto', () => {
        const file = createCharacterFile();

        expect(file.metadata).toBeDefined();
        expect(file.character).toBeDefined();
        expect(file.character.basics.name).toBe('Nuevo Personaje');
    });

    it('permite sobrescribir valores', () => {
        const file = createCharacterFile({
            basics: {
                name: 'Gandalf',
                race: 'human',
                class: 'wizard',
                level: 20,
                background: 'sage',
                experiencePoints: 355000,
            },
        });

        expect(file.character.basics.name).toBe('Gandalf');
        expect(file.character.basics.level).toBe(20);
    });
});

describe('serializeCharacter / deserializeCharacter', () => {
    it('roundtrip preserva datos', () => {
        const original = createCharacterFile();
        const json = serializeCharacter(original);
        const restored = deserializeCharacter(json);

        expect(restored.character.basics.name).toBe(original.character.basics.name);
        expect(restored.metadata.version).toBe(original.metadata.version);
    });

    it('JSON es legible (formateado)', () => {
        const file = createCharacterFile();
        const json = serializeCharacter(file);

        expect(json).toContain('\n');  // Tiene saltos de línea
        expect(json).toContain('  ');  // Tiene indentación
    });

    it('lanza error para JSON inválido', () => {
        expect(() => deserializeCharacter('{invalid}')).toThrow();
    });

    it('lanza error si falta metadata', () => {
        const invalid = JSON.stringify({ character: {} });
        expect(() => deserializeCharacter(invalid)).toThrow('Invalid character file format');
    });

    it('lanza error para versión futura', () => {
        const future = JSON.stringify({
            metadata: { version: 999 },
            character: {},
        });
        expect(() => deserializeCharacter(future)).toThrow('newer than supported');
    });
});

describe('validateCharacter', () => {
    it('personaje válido pasa validación', () => {
        const char = createDefaultCharacter();
        char.basics.name = 'Legolas';
        char.basics.class = 'ranger';

        const result = validateCharacter(char);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    it('nombre vacío es inválido', () => {
        const char = createDefaultCharacter();
        char.basics.name = '';

        const result = validateCharacter(char);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Character name is required');
    });

    it('nivel 0 es inválido', () => {
        const char = createDefaultCharacter();
        char.basics.level = 0;

        const result = validateCharacter(char);
        expect(result.isValid).toBe(false);
    });

    it('nivel 21 es inválido', () => {
        const char = createDefaultCharacter();
        char.basics.level = 21;

        const result = validateCharacter(char);
        expect(result.isValid).toBe(false);
    });

    it('atributo fuera de rango es inválido', () => {
        const char = createDefaultCharacter();
        char.abilities.strength = 35;

        const result = validateCharacter(char);
        expect(result.isValid).toBe(false);
        expect(result.errors.some(e => e.includes('strength'))).toBe(true);
    });
});

describe('updateMetadata', () => {
    it('actualiza updatedAt pero preserva createdAt', () => {
        const original = createFileMetadata();
        // Simular metadata antigua
        const oldMetadata = {
            ...original,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
        };

        const updated = updateMetadata(oldMetadata);

        expect(updated.createdAt).toBe('2024-01-01T00:00:00.000Z');
        expect(updated.updatedAt).not.toBe('2024-01-01T00:00:00.000Z');
        // Verificar que es una fecha ISO válida
        expect(() => new Date(updated.updatedAt)).not.toThrow();
    });
});

describe('constantes', () => {
    it('extensión de archivo definida', () => {
        expect(CHARACTER_FILE_EXTENSION).toBe('.dnd5e');
    });

    it('versión del schema es número', () => {
        expect(typeof SCHEMA_VERSION).toBe('number');
        expect(SCHEMA_VERSION).toBeGreaterThan(0);
    });
});
