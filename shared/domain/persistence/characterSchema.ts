/**
 * ════════════════════════════════════════════════════════════
 * ESQUEMA DE PERSONAJE SERIALIZABLE
 * 
 * Este archivo define la estructura para guardar/cargar personajes
 * en formato JSON. Incluye validación y valores por defecto.
 * ════════════════════════════════════════════════════════════
 */

import type {
    Character,
    BasicInfo,
    Abilities,
    Skills,
    SavingThrowProficiencies,
    SkillName,
    AbilityName
} from '../../types/character.js';

/**
 * Versión del schema para migraciones futuras
 */
export const SCHEMA_VERSION = 1;

/**
 * Metadatos del archivo de personaje
 */
export interface CharacterFileMetadata {
    version: number;
    createdAt: string;
    updatedAt: string;
    appVersion: string;
}

/**
 * Estructura completa del archivo de personaje
 */
export interface CharacterFile {
    metadata: CharacterFileMetadata;
    character: Character;
}

/**
 * Crea las habilidades vacías por defecto
 */
export function createEmptySkills(): Skills {
    const skillNames: SkillName[] = [
        'acrobatics', 'animalHandling', 'arcana', 'athletics',
        'deception', 'history', 'insight', 'intimidation',
        'investigation', 'medicine', 'nature', 'perception',
        'performance', 'persuasion', 'religion', 'sleightOfHand',
        'stealth', 'survival'
    ];

    const skills: Partial<Skills> = {};
    for (const skill of skillNames) {
        skills[skill] = { proficient: false };
    }

    return skills as Skills;
}

/**
 * Crea un personaje nuevo con valores por defecto
 */
export function createDefaultCharacter(): Character {
    return {
        basics: {
            name: 'Nuevo Personaje',
            race: '',
            class: '',
            level: 1,
            background: '',
            experiencePoints: 0,
        },
        abilities: {
            strength: 10,
            dexterity: 10,
            constitution: 10,
            intelligence: 10,
            wisdom: 10,
            charisma: 10,
        },
        skills: createEmptySkills(),
        savingThrows: [],
    };
}

/**
 * Crea los metadatos para un archivo nuevo
 */
export function createFileMetadata(): CharacterFileMetadata {
    const now = new Date().toISOString();
    return {
        version: SCHEMA_VERSION,
        createdAt: now,
        updatedAt: now,
        appVersion: '0.1.0',
    };
}

/**
 * Crea un archivo de personaje nuevo
 */
export function createCharacterFile(character?: Partial<Character>): CharacterFile {
    return {
        metadata: createFileMetadata(),
        character: {
            ...createDefaultCharacter(),
            ...character,
        },
    };
}

/**
 * Serializa un personaje a JSON
 */
export function serializeCharacter(charFile: CharacterFile): string {
    return JSON.stringify(charFile, null, 2);
}

/**
 * Deserializa JSON a un personaje con validación básica
 */
export function deserializeCharacter(json: string): CharacterFile {
    const parsed = JSON.parse(json);

    // Validación básica
    if (!parsed.metadata || !parsed.character) {
        throw new Error('Invalid character file format');
    }

    if (typeof parsed.metadata.version !== 'number') {
        throw new Error('Missing or invalid schema version');
    }

    // Migración de versiones futuras aquí
    if (parsed.metadata.version > SCHEMA_VERSION) {
        throw new Error(
            `Character file version ${parsed.metadata.version} is newer than supported version ${SCHEMA_VERSION}`
        );
    }

    return parsed as CharacterFile;
}

/**
 * Valida que un personaje tenga todos los campos requeridos
 */
export function validateCharacter(character: Character): ValidationResult {
    const errors: string[] = [];

    // Validar basics
    if (!character.basics.name || character.basics.name.trim() === '') {
        errors.push('Character name is required');
    }

    if (character.basics.level < 1 || character.basics.level > 20) {
        errors.push('Level must be between 1 and 20');
    }

    // Validar abilities
    const abilityNames: AbilityName[] = [
        'strength', 'dexterity', 'constitution',
        'intelligence', 'wisdom', 'charisma'
    ];

    for (const ability of abilityNames) {
        const score = character.abilities[ability];
        if (score < 1 || score > 30) {
            errors.push(`${ability} must be between 1 and 30`);
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

/**
 * Resultado de validación
 */
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

/**
 * Actualiza los metadatos al guardar
 */
export function updateMetadata(metadata: CharacterFileMetadata): CharacterFileMetadata {
    return {
        ...metadata,
        updatedAt: new Date().toISOString(),
    };
}

/**
 * Extensión de archivo para personajes
 */
export const CHARACTER_FILE_EXTENSION = '.dnd5e';

/**
 * Filtro de archivos para diálogos
 */
export const CHARACTER_FILE_FILTER = {
    name: 'D&D 5e Character',
    extensions: ['dnd5e', 'json'],
};
