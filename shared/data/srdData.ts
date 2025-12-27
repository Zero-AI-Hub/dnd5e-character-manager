/**
 * ════════════════════════════════════════════════════════════
 * DATOS SRD - RAZAS Y CLASES
 * 
 * Datos básicos del System Reference Document de D&D 5e
 * para autocompletado y validación.
 * ════════════════════════════════════════════════════════════
 */

import type { AbilityName } from '../types/character.js';

/**
 * Información de una raza SRD
 */
export interface SRDRace {
    id: string;
    name: string;
    nameEs: string;
    speed: number;
    abilityBonuses: Partial<Record<AbilityName, number>>;
    traits: string[];
}

/**
 * Información de una clase SRD
 */
export interface SRDClass {
    id: string;
    name: string;
    nameEs: string;
    hitDie: 6 | 8 | 10 | 12;
    primaryAbility: AbilityName[];
    savingThrows: [AbilityName, AbilityName];
    skillChoices: number;
    skillOptions: string[];
}

/**
 * Información de un trasfondo SRD
 */
export interface SRDBackground {
    id: string;
    name: string;
    nameEs: string;
    skillProficiencies: string[];
    languages?: number;
    toolProficiencies?: string[];
}

/**
 * Razas del SRD
 */
export const SRD_RACES: SRDRace[] = [
    {
        id: 'dwarf',
        name: 'Dwarf',
        nameEs: 'Enano',
        speed: 25,
        abilityBonuses: { constitution: 2 },
        traits: ['Darkvision', 'Dwarven Resilience', 'Stonecunning'],
    },
    {
        id: 'elf',
        name: 'Elf',
        nameEs: 'Elfo',
        speed: 30,
        abilityBonuses: { dexterity: 2 },
        traits: ['Darkvision', 'Keen Senses', 'Fey Ancestry', 'Trance'],
    },
    {
        id: 'halfling',
        name: 'Halfling',
        nameEs: 'Mediano',
        speed: 25,
        abilityBonuses: { dexterity: 2 },
        traits: ['Lucky', 'Brave', 'Halfling Nimbleness'],
    },
    {
        id: 'human',
        name: 'Human',
        nameEs: 'Humano',
        speed: 30,
        abilityBonuses: {
            strength: 1, dexterity: 1, constitution: 1,
            intelligence: 1, wisdom: 1, charisma: 1
        },
        traits: ['Extra Language'],
    },
    {
        id: 'dragonborn',
        name: 'Dragonborn',
        nameEs: 'Dracónido',
        speed: 30,
        abilityBonuses: { strength: 2, charisma: 1 },
        traits: ['Draconic Ancestry', 'Breath Weapon', 'Damage Resistance'],
    },
    {
        id: 'gnome',
        name: 'Gnome',
        nameEs: 'Gnomo',
        speed: 25,
        abilityBonuses: { intelligence: 2 },
        traits: ['Darkvision', 'Gnome Cunning'],
    },
    {
        id: 'half-elf',
        name: 'Half-Elf',
        nameEs: 'Semielfo',
        speed: 30,
        abilityBonuses: { charisma: 2 },
        traits: ['Darkvision', 'Fey Ancestry', 'Skill Versatility'],
    },
    {
        id: 'half-orc',
        name: 'Half-Orc',
        nameEs: 'Semiorco',
        speed: 30,
        abilityBonuses: { strength: 2, constitution: 1 },
        traits: ['Darkvision', 'Menacing', 'Relentless Endurance', 'Savage Attacks'],
    },
    {
        id: 'tiefling',
        name: 'Tiefling',
        nameEs: 'Tiefling',
        speed: 30,
        abilityBonuses: { intelligence: 1, charisma: 2 },
        traits: ['Darkvision', 'Hellish Resistance', 'Infernal Legacy'],
    },
];

/**
 * Clases del SRD
 */
export const SRD_CLASSES: SRDClass[] = [
    {
        id: 'barbarian',
        name: 'Barbarian',
        nameEs: 'Bárbaro',
        hitDie: 12,
        primaryAbility: ['strength'],
        savingThrows: ['strength', 'constitution'],
        skillChoices: 2,
        skillOptions: ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival'],
    },
    {
        id: 'bard',
        name: 'Bard',
        nameEs: 'Bardo',
        hitDie: 8,
        primaryAbility: ['charisma'],
        savingThrows: ['dexterity', 'charisma'],
        skillChoices: 3,
        skillOptions: ['Any'],
    },
    {
        id: 'cleric',
        name: 'Cleric',
        nameEs: 'Clérigo',
        hitDie: 8,
        primaryAbility: ['wisdom'],
        savingThrows: ['wisdom', 'charisma'],
        skillChoices: 2,
        skillOptions: ['History', 'Insight', 'Medicine', 'Persuasion', 'Religion'],
    },
    {
        id: 'druid',
        name: 'Druid',
        nameEs: 'Druida',
        hitDie: 8,
        primaryAbility: ['wisdom'],
        savingThrows: ['intelligence', 'wisdom'],
        skillChoices: 2,
        skillOptions: ['Arcana', 'Animal Handling', 'Insight', 'Medicine', 'Nature', 'Perception', 'Religion', 'Survival'],
    },
    {
        id: 'fighter',
        name: 'Fighter',
        nameEs: 'Guerrero',
        hitDie: 10,
        primaryAbility: ['strength', 'dexterity'],
        savingThrows: ['strength', 'constitution'],
        skillChoices: 2,
        skillOptions: ['Acrobatics', 'Animal Handling', 'Athletics', 'History', 'Insight', 'Intimidation', 'Perception', 'Survival'],
    },
    {
        id: 'monk',
        name: 'Monk',
        nameEs: 'Monje',
        hitDie: 8,
        primaryAbility: ['dexterity', 'wisdom'],
        savingThrows: ['strength', 'dexterity'],
        skillChoices: 2,
        skillOptions: ['Acrobatics', 'Athletics', 'History', 'Insight', 'Religion', 'Stealth'],
    },
    {
        id: 'paladin',
        name: 'Paladin',
        nameEs: 'Paladín',
        hitDie: 10,
        primaryAbility: ['strength', 'charisma'],
        savingThrows: ['wisdom', 'charisma'],
        skillChoices: 2,
        skillOptions: ['Athletics', 'Insight', 'Intimidation', 'Medicine', 'Persuasion', 'Religion'],
    },
    {
        id: 'ranger',
        name: 'Ranger',
        nameEs: 'Explorador',
        hitDie: 10,
        primaryAbility: ['dexterity', 'wisdom'],
        savingThrows: ['strength', 'dexterity'],
        skillChoices: 3,
        skillOptions: ['Animal Handling', 'Athletics', 'Insight', 'Investigation', 'Nature', 'Perception', 'Stealth', 'Survival'],
    },
    {
        id: 'rogue',
        name: 'Rogue',
        nameEs: 'Pícaro',
        hitDie: 8,
        primaryAbility: ['dexterity'],
        savingThrows: ['dexterity', 'intelligence'],
        skillChoices: 4,
        skillOptions: ['Acrobatics', 'Athletics', 'Deception', 'Insight', 'Intimidation', 'Investigation', 'Perception', 'Performance', 'Persuasion', 'Sleight of Hand', 'Stealth'],
    },
    {
        id: 'sorcerer',
        name: 'Sorcerer',
        nameEs: 'Hechicero',
        hitDie: 6,
        primaryAbility: ['charisma'],
        savingThrows: ['constitution', 'charisma'],
        skillChoices: 2,
        skillOptions: ['Arcana', 'Deception', 'Insight', 'Intimidation', 'Persuasion', 'Religion'],
    },
    {
        id: 'warlock',
        name: 'Warlock',
        nameEs: 'Brujo',
        hitDie: 8,
        primaryAbility: ['charisma'],
        savingThrows: ['wisdom', 'charisma'],
        skillChoices: 2,
        skillOptions: ['Arcana', 'Deception', 'History', 'Intimidation', 'Investigation', 'Nature', 'Religion'],
    },
    {
        id: 'wizard',
        name: 'Wizard',
        nameEs: 'Mago',
        hitDie: 6,
        primaryAbility: ['intelligence'],
        savingThrows: ['intelligence', 'wisdom'],
        skillChoices: 2,
        skillOptions: ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine', 'Religion'],
    },
];

/**
 * Trasfondos del SRD
 */
export const SRD_BACKGROUNDS: SRDBackground[] = [
    { id: 'acolyte', name: 'Acolyte', nameEs: 'Acólito', skillProficiencies: ['Insight', 'Religion'], languages: 2 },
    { id: 'charlatan', name: 'Charlatan', nameEs: 'Charlatán', skillProficiencies: ['Deception', 'Sleight of Hand'] },
    { id: 'criminal', name: 'Criminal', nameEs: 'Criminal', skillProficiencies: ['Deception', 'Stealth'] },
    { id: 'entertainer', name: 'Entertainer', nameEs: 'Animador', skillProficiencies: ['Acrobatics', 'Performance'] },
    { id: 'folk-hero', name: 'Folk Hero', nameEs: 'Héroe del pueblo', skillProficiencies: ['Animal Handling', 'Survival'] },
    { id: 'guild-artisan', name: 'Guild Artisan', nameEs: 'Artesano gremial', skillProficiencies: ['Insight', 'Persuasion'], languages: 1 },
    { id: 'hermit', name: 'Hermit', nameEs: 'Ermitaño', skillProficiencies: ['Medicine', 'Religion'], languages: 1 },
    { id: 'noble', name: 'Noble', nameEs: 'Noble', skillProficiencies: ['History', 'Persuasion'], languages: 1 },
    { id: 'outlander', name: 'Outlander', nameEs: 'Forastero', skillProficiencies: ['Athletics', 'Survival'], languages: 1 },
    { id: 'sage', name: 'Sage', nameEs: 'Sabio', skillProficiencies: ['Arcana', 'History'], languages: 2 },
    { id: 'sailor', name: 'Sailor', nameEs: 'Marinero', skillProficiencies: ['Athletics', 'Perception'] },
    { id: 'soldier', name: 'Soldier', nameEs: 'Soldado', skillProficiencies: ['Athletics', 'Intimidation'] },
    { id: 'urchin', name: 'Urchin', nameEs: 'Pilluelo', skillProficiencies: ['Sleight of Hand', 'Stealth'] },
];

/**
 * Buscar raza por ID o nombre
 */
export function findRace(query: string): SRDRace | undefined {
    const q = query.toLowerCase();
    return SRD_RACES.find(r =>
        r.id === q ||
        r.name.toLowerCase() === q ||
        r.nameEs.toLowerCase() === q
    );
}

/**
 * Buscar clase por ID o nombre
 */
export function findClass(query: string): SRDClass | undefined {
    const q = query.toLowerCase();
    return SRD_CLASSES.find(c =>
        c.id === q ||
        c.name.toLowerCase() === q ||
        c.nameEs.toLowerCase() === q
    );
}

/**
 * Buscar trasfondo por ID o nombre
 */
export function findBackground(query: string): SRDBackground | undefined {
    const q = query.toLowerCase();
    return SRD_BACKGROUNDS.find(b =>
        b.id === q ||
        b.name.toLowerCase() === q ||
        b.nameEs.toLowerCase() === q
    );
}

/**
 * Filtrar opciones para autocompletado
 */
export function filterOptions<T extends { name: string; nameEs: string }>(
    items: T[],
    query: string
): T[] {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.nameEs.toLowerCase().includes(q)
    );
}
