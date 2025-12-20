/**
 * ════════════════════════════════════════════════════════════
 * TIPOS BÁSICOS
 * ════════════════════════════════════════════════════════════
 */

/**
 * Puntuación de un atributo (1-30)
 * Típicamente 3-20 para personajes jugadores
 */
export type AbilityScore = number;

/**
 * Modificador derivado de un atributo (-5 a +10)
 */
export type AbilityModifier = number;

/**
 * Nivel del personaje (1-20)
 */
export type CharacterLevel = number;

/**
 * Bonificador de competencia (+2 a +6)
 */
export type ProficiencyBonus = number;

/**
 * ID de referencia al SRD (kebab-case)
 * Ejemplo: "high-elf", "wizard", "sage"
 */
export type SRDReference = string;

/**
 * ════════════════════════════════════════════════════════════
 * ATRIBUTOS (ABILITIES)
 * ════════════════════════════════════════════════════════════
 */

/**
 * Nombres de los 6 atributos de D&D 5e
 */
export type AbilityName = 
  | 'strength'
  | 'dexterity'
  | 'constitution'
  | 'intelligence'
  | 'wisdom'
  | 'charisma';

/**
 * Los 6 atributos principales
 */
export interface Abilities {
  strength: AbilityScore;
  dexterity: AbilityScore;
  constitution: AbilityScore;
  intelligence: AbilityScore;
  wisdom: AbilityScore;
  charisma: AbilityScore;
}

/**
 * Modificadores calculados de los atributos
 * (no se almacenan, se calculan on-demand)
 */
export interface AbilityModifiers {
  strength: AbilityModifier;
  dexterity: AbilityModifier;
  constitution: AbilityModifier;
  intelligence: AbilityModifier;
  wisdom: AbilityModifier;
  charisma: AbilityModifier;
}

/**
 * ════════════════════════════════════════════════════════════
 * HABILIDADES (SKILLS)
 * ════════════════════════════════════════════════════════════
 */

/**
 * Las 18 habilidades de D&D 5e
 */
export type SkillName =
  | 'acrobatics'      // Destreza
  | 'animalHandling'  // Sabiduría
  | 'arcana'          // Inteligencia
  | 'athletics'       // Fuerza
  | 'deception'       // Carisma
  | 'history'         // Inteligencia
  | 'insight'         // Sabiduría
  | 'intimidation'    // Carisma
  | 'investigation'   // Inteligencia
  | 'medicine'        // Sabiduría
  | 'nature'          // Inteligencia
  | 'perception'      // Sabiduría
  | 'performance'     // Carisma
  | 'persuasion'      // Carisma
  | 'religion'        // Inteligencia
  | 'sleightOfHand'   // Destreza
  | 'stealth'         // Destreza
  | 'survival';       // Sabiduría

/**
 * Datos de competencia de una habilidad
 */
export interface SkillProficiency {
  /** Si tiene competencia en esta habilidad */
  proficient: boolean;
  /** Si tiene pericia (expertise = doble competencia) */
  expertise?: boolean;
}

/**
 * Todas las habilidades con sus competencias
 */
export type Skills = Record<SkillName, SkillProficiency>;

/**
 * Mapeo de habilidad → atributo asociado
 * (usado para cálculos)
 */
export const SKILL_TO_ABILITY: Record<SkillName, AbilityName> = {
  acrobatics: 'dexterity',
  animalHandling: 'wisdom',
  arcana: 'intelligence',
  athletics: 'strength',
  deception: 'charisma',
  history: 'intelligence',
  insight: 'wisdom',
  intimidation: 'charisma',
  investigation: 'intelligence',
  medicine: 'wisdom',
  nature: 'intelligence',
  perception: 'wisdom',
  performance: 'charisma',
  persuasion: 'charisma',
  religion: 'intelligence',
  sleightOfHand: 'dexterity',
  stealth: 'dexterity',
  survival: 'wisdom',
} as const;

/**
 * ════════════════════════════════════════════════════════════
 * TIRADAS DE SALVACIÓN (SAVING THROWS)
 * ════════════════════════════════════════════════════════════
 */

/**
 * Competencias en tiradas de salvación
 * (cada clase tiene 2 competencias)
 */
export type SavingThrowProficiencies = AbilityName[];

/**
 * ════════════════════════════════════════════════════════════
 * INFORMACIÓN BÁSICA
 * ════════════════════════════════════════════════════════════
 */

/**
 * Datos básicos del personaje
 */
export interface BasicInfo {
  /** Nombre del personaje */
  name: string;
  
  /** Raza (referencia al SRD) */
  race: SRDReference;
  
  /** Subraza si aplica */
  subrace?: SRDReference;
  
  /** Clase (referencia al SRD) */
  class: SRDReference;
  
  /** Subclase si aplica (nivel 1-3 según clase) */
  subclass?: SRDReference;
  
  /** Nivel del personaje (1-20) */
  level: CharacterLevel;
  
  /** Trasfondo (referencia al SRD) */
  background: SRDReference;
  
  /** Alineamiento (opcional) */
  alignment?: string;
  
  /** Puntos de experiencia */
  experiencePoints: number;
}

/**
 * ════════════════════════════════════════════════════════════
 * PERSONAJE COMPLETO (MÍNIMO)
 * ════════════════════════════════════════════════════════════
 */

/**
 * Estructura mínima de un personaje de D&D 5e
 * 
 * Esta versión incluye solo lo esencial para:
 * - Información básica
 * - Atributos y modificadores
 * - Habilidades y competencias
 * - Tiradas de salvación
 * 
 * Futuras expansiones:
 * - Combat stats (HP, AC, initiative)
 * - Spells
 * - Equipment
 * - Features & traits
 * - Personality
 */
export interface Character {
  /** Información básica del personaje */
  basics: BasicInfo;
  
  /** Los 6 atributos principales */
  abilities: Abilities;
  
  /** Las 18 habilidades con sus competencias */
  skills: Skills;
  
  /** Competencias en tiradas de salvación */
  savingThrows: SavingThrowProficiencies;
}

/**
 * ════════════════════════════════════════════════════════════
 * HELPER TYPES (para uso interno)
 * ════════════════════════════════════════════════════════════
 */

/**
 * Resultado de calcular bonificador de habilidad
 */
export interface SkillBonus {
  /** Nombre de la habilidad */
  skill: SkillName;
  /** Bonificador total (atributo + competencia si aplica) */
  bonus: number;
  /** Desglose del cálculo */
  breakdown: {
    abilityModifier: AbilityModifier;
    proficiencyBonus: ProficiencyBonus;
    isProficient: boolean;
    hasExpertise: boolean;
  };
}

/**
 * Resultado de calcular tirada de salvación
 */
export interface SavingThrowBonus {
  /** Nombre del atributo */
  ability: AbilityName;
  /** Bonificador total */
  bonus: number;
  /** Si tiene competencia */
  isProficient: boolean;
}
