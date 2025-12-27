import { useState, useEffect } from 'react';
import type { Character, AbilityName, SkillName } from '@shared/types/character';
import { SKILL_TO_ABILITY } from '@shared/types/character';
import { calculateAbilityModifier, calculateAllAbilityModifiers, formatModifier } from '@shared/domain/calculators/abilities';
import { calculateProficiencyBonus } from '@shared/domain/calculators/proficiency';
import { calculateAllSkillBonuses, formatSkillBonus } from '@shared/domain/calculators/skills';
import { calculateAllSavingThrowBonuses, formatSavingThrowBonus } from '@shared/domain/calculators/savingThrows';
import { calculateClassMaxHP } from '@shared/domain/calculators/hitPoints';
import { createDefaultCharacter } from '@shared/domain/persistence/characterSchema';

/**
 * Mapeo de nombres de habilidades a español
 */
const SKILL_NAMES_ES: Record<SkillName, string> = {
    acrobatics: 'Acrobacias',
    animalHandling: 'Trato con Animales',
    arcana: 'Arcano',
    athletics: 'Atletismo',
    deception: 'Engaño',
    history: 'Historia',
    insight: 'Perspicacia',
    intimidation: 'Intimidación',
    investigation: 'Investigación',
    medicine: 'Medicina',
    nature: 'Naturaleza',
    perception: 'Percepción',
    performance: 'Interpretación',
    persuasion: 'Persuasión',
    religion: 'Religión',
    sleightOfHand: 'Juego de Manos',
    stealth: 'Sigilo',
    survival: 'Supervivencia',
};

/**
 * Nombres de atributos en español
 */
const ABILITY_NAMES_ES: Record<AbilityName, string> = {
    strength: 'Fuerza',
    dexterity: 'Destreza',
    constitution: 'Constitución',
    intelligence: 'Inteligencia',
    wisdom: 'Sabiduría',
    charisma: 'Carisma',
};

/**
 * Abreviaturas de atributos
 */
const ABILITY_ABBR: Record<AbilityName, string> = {
    strength: 'FUE',
    dexterity: 'DES',
    constitution: 'CON',
    intelligence: 'INT',
    wisdom: 'SAB',
    charisma: 'CAR',
};

interface CharacterSheetProps {
    character?: Character;
    onCharacterChange?: (character: Character) => void;
}

/**
 * Componente principal de la ficha de personaje
 */
export function CharacterSheet({ character: propCharacter, onCharacterChange }: CharacterSheetProps) {
    const [character, setCharacter] = useState<Character>(propCharacter || createDefaultCharacter());

    // Sincronizar con props
    useEffect(() => {
        if (propCharacter) {
            setCharacter(propCharacter);
        }
    }, [propCharacter]);

    // Calcular valores derivados
    const abilityModifiers = calculateAllAbilityModifiers(character.abilities);
    const proficiencyBonus = calculateProficiencyBonus(character.basics.level);
    const skillBonuses = calculateAllSkillBonuses(abilityModifiers, proficiencyBonus, character.skills);
    const savingThrowBonuses = calculateAllSavingThrowBonuses(abilityModifiers, proficiencyBonus, character.savingThrows);

    // HP (usar clase si está definida, si no usar d8 por defecto)
    const hitDie = character.basics.class ? undefined : 8;
    let maxHP = 0;
    try {
        if (character.basics.class) {
            maxHP = calculateClassMaxHP(character.basics.class, character.basics.level, abilityModifiers.constitution);
        } else {
            maxHP = character.basics.level * (5 + abilityModifiers.constitution); // Aproximación
        }
    } catch {
        maxHP = 10 + abilityModifiers.constitution;
    }

    // Actualizar atributo
    const updateAbility = (ability: AbilityName, value: number) => {
        const newCharacter = {
            ...character,
            abilities: {
                ...character.abilities,
                [ability]: Math.max(1, Math.min(30, value)),
            },
        };
        setCharacter(newCharacter);
        onCharacterChange?.(newCharacter);
    };

    // Actualizar básicos
    const updateBasics = (field: keyof typeof character.basics, value: string | number) => {
        const newCharacter = {
            ...character,
            basics: {
                ...character.basics,
                [field]: value,
            },
        };
        setCharacter(newCharacter);
        onCharacterChange?.(newCharacter);
    };

    // Toggle competencia en habilidad
    const toggleSkillProficiency = (skill: SkillName) => {
        const current = character.skills[skill];
        const newCharacter = {
            ...character,
            skills: {
                ...character.skills,
                [skill]: {
                    proficient: !current.proficient,
                    expertise: false,
                },
            },
        };
        setCharacter(newCharacter);
        onCharacterChange?.(newCharacter);
    };

    const abilityNames: AbilityName[] = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
    const skillNames: SkillName[] = Object.keys(SKILL_NAMES_ES) as SkillName[];

    return (
        <div className="character-sheet">
            {/* Header - Información básica */}
            <div className="character-sheet__header">
                <div className="card">
                    <div className="basic-info">
                        <input
                            type="text"
                            className="basic-info__name"
                            value={character.basics.name}
                            onChange={(e) => updateBasics('name', e.target.value)}
                            placeholder="Nombre del personaje"
                            style={{
                                background: 'transparent',
                                border: 'none',
                                fontSize: '1.75rem',
                                color: 'var(--color-accent-gold)',
                                width: 'auto',
                            }}
                        />
                        <div className="basic-info__details">
                            <div className="basic-info__item">
                                <span className="basic-info__label">Clase</span>
                                <input
                                    type="text"
                                    value={character.basics.class}
                                    onChange={(e) => updateBasics('class', e.target.value)}
                                    placeholder="Clase"
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        textAlign: 'center',
                                        width: '100px',
                                    }}
                                />
                            </div>
                            <div className="basic-info__item">
                                <span className="basic-info__label">Nivel</span>
                                <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={character.basics.level}
                                    onChange={(e) => updateBasics('level', Number(e.target.value))}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        textAlign: 'center',
                                        width: '50px',
                                        fontSize: '1rem',
                                    }}
                                />
                            </div>
                            <div className="basic-info__item">
                                <span className="basic-info__label">Raza</span>
                                <input
                                    type="text"
                                    value={character.basics.race}
                                    onChange={(e) => updateBasics('race', e.target.value)}
                                    placeholder="Raza"
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        textAlign: 'center',
                                        width: '100px',
                                    }}
                                />
                            </div>
                            <div className="basic-info__item">
                                <span className="basic-info__label">Trasfondo</span>
                                <input
                                    type="text"
                                    value={character.basics.background}
                                    onChange={(e) => updateBasics('background', e.target.value)}
                                    placeholder="Trasfondo"
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        textAlign: 'center',
                                        width: '100px',
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar - Atributos y Tiradas de Salvación */}
            <div className="character-sheet__sidebar">
                {/* Atributos */}
                <div className="card">
                    <h3 className="card__title">Atributos</h3>
                    <div className="abilities">
                        {abilityNames.map((ability) => (
                            <div key={ability} className="ability">
                                <div className="ability__name">{ABILITY_ABBR[ability]}</div>
                                <input
                                    type="number"
                                    min="1"
                                    max="30"
                                    value={character.abilities[ability]}
                                    onChange={(e) => updateAbility(ability, Number(e.target.value))}
                                    className="ability__score"
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        textAlign: 'center',
                                        width: '60px',
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                    }}
                                />
                                <div className="ability__modifier">
                                    {formatModifier(abilityModifiers[ability])}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Competencia */}
                <div className="card">
                    <h3 className="card__title">Competencia</h3>
                    <div className="combat-stat" style={{ background: 'transparent' }}>
                        <div className="combat-stat__label">Bonificador</div>
                        <div className="combat-stat__value">+{proficiencyBonus}</div>
                    </div>
                </div>

                {/* Tiradas de Salvación */}
                <div className="card">
                    <h3 className="card__title">Tiradas de Salvación</h3>
                    <div className="saving-throws">
                        {abilityNames.map((ability) => {
                            const isProficient = character.savingThrows.includes(ability);
                            return (
                                <div
                                    key={ability}
                                    className={`saving-throw ${isProficient ? 'saving-throw--proficient' : ''}`}
                                >
                                    <span className="saving-throw__name">{ABILITY_ABBR[ability]}</span>
                                    <span className="saving-throw__bonus">
                                        {formatSavingThrowBonus(savingThrowBonuses[ability])}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Estadísticas de Combate */}
                <div className="card">
                    <h3 className="card__title">Combate</h3>
                    <div className="combat-stats">
                        <div className="combat-stat">
                            <div className="combat-stat__label">PG Máx</div>
                            <div className="combat-stat__value">{maxHP}</div>
                        </div>
                        <div className="combat-stat">
                            <div className="combat-stat__label">CA</div>
                            <div className="combat-stat__value">{10 + abilityModifiers.dexterity}</div>
                        </div>
                        <div className="combat-stat">
                            <div className="combat-stat__label">Iniciativa</div>
                            <div className="combat-stat__value">{formatModifier(abilityModifiers.dexterity)}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main - Habilidades */}
            <div className="character-sheet__main">
                <div className="card">
                    <h3 className="card__title">Habilidades</h3>
                    <div className="skills">
                        {skillNames.sort((a, b) => SKILL_NAMES_ES[a].localeCompare(SKILL_NAMES_ES[b])).map((skill) => {
                            const isProficient = character.skills[skill].proficient;
                            const hasExpertise = character.skills[skill].expertise;
                            const abilityAbbr = ABILITY_ABBR[SKILL_TO_ABILITY[skill]];

                            return (
                                <div
                                    key={skill}
                                    className={`skill ${isProficient ? 'skill--proficient' : ''} ${hasExpertise ? 'skill--expertise' : ''}`}
                                    onClick={() => toggleSkillProficiency(skill)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <span className="skill__name">
                                        {isProficient && '●'} {SKILL_NAMES_ES[skill]}
                                        <span className="skill__ability">({abilityAbbr})</span>
                                    </span>
                                    <span className="skill__bonus">
                                        {formatSkillBonus(skillBonuses[skill])}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CharacterSheet;
