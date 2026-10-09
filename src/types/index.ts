// MathGame par Webdevoo — Définitions de types stricts

export type SchoolGrade = 'CP' | 'CE1' | 'CE2' | 'CM1' | 'CM2' | '6e' | '5e' | '4e' | '3e';

export type SchoolWorld = 'primaire' | 'college';

export type MathDomain =
  | 'nombres_calcul'
  | 'grandeurs_mesures'
  | 'espace_geometrie'
  | 'donnees'
  | 'donnees_probas'
  | 'proportionnalite'
  | 'algorithmique';

export type MathCompetence =
  | 'chercher'
  | 'modeliser'
  | 'representer'
  | 'raisonner'
  | 'calculer'
  | 'communiquer';

export type MasteryTier = 'decouverte' | 'en_cours' | 'consolide' | 'maitrise';

export type HeroClass = 'mage' | 'guerrier' | 'alchimiste' | 'rodeur';

export type SkinToneId = 'pale' | 'doree' | 'ambree' | 'ebene' | 'celeste';
export type HairStyleId = 'court' | 'court_classique' | 'court_degrade' | 'boucle' | 'tresse' | 'long' | 'chignon' | 'arcane';
export type HairColorId = 'brun' | 'blond' | 'roux' | 'noir' | 'argent' | 'violet';

export interface AvatarCustomization {
  skinTone: SkinToneId;
  hairStyle: HairStyleId;
  hairColor: HairColorId;
  gender?: 'garcon' | 'fille' | 'neutre';
  jacketId: string; // Tunique/Veste permanente garantie, ex: 'tunique_apprenti'
  capeId: string; // 'aucune' ou identifiant de cape
  accessoryId?: string; // 'aucun' ou identifiant de couvre-chef / bijou
}

export interface PlayerProfile {
  id: string;
  name: string;
  avatar: string;
  customization?: AvatarCustomization;
  heroClass: HeroClass;
  grade: SchoolGrade;
  world: SchoolWorld;
  level: number;
  xp: number;
  xpToNextLevel: number;
  gold: number;
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  unlockedZoneIds: string[];
  currentZoneId: string;
  dailyStreak: number;
  lastLoginDate: string; // YYYY-MM-DD
  maxStreak: number;
  prestigeLevel?: number; // 0 = initial, 1 = New Game+ Maître Mathématique
  createdAt: number;
  updatedAt: number;
}

export interface NotionMastery {
  profileId: string;
  notionId: string;
  grade: SchoolGrade;
  attemptsCount: number;
  successCount: number;
  consecutiveSuccesses: number;
  hintsUsedCount: number;
  masteryLevel: MasteryTier;
  lastAttemptAt: number;
}

export interface CurriculumNotion {
  id: string;
  grade: SchoolGrade;
  world: SchoolWorld;
  domain: MathDomain;
  competences: MathCompetence[];
  title: string;
  subtitle: string;
  officialRef: string; // Ex: BO n°31 / Cycle 2 / Cycle 3 / Cycle 4
  learningObjectives: string[];
  prerequisites: string[];
  commonMisconceptions: string[];
  tutorialAvailable: boolean;
  tutorialId?: string;
}

export type ExerciseType =
  | 'numeric'
  | 'multiple_choice'
  | 'association'
  | 'ordering'
  | 'fraction_visual'
  | 'canvas_geometry';

export interface ExerciseOption {
  id: string;
  label: string;
  isCorrect: boolean;
}

export interface Exercise {
  id: string;
  notionId: string;
  grade: SchoolGrade;
  domain: MathDomain;
  competence: MathCompetence;
  title: string;
  storyContext: string;
  question: string;
  type: ExerciseType;
  // Payload data for specific exercise types
  options?: ExerciseOption[];
  correctNumericAnswer?: number;
  tolerance?: number;
  correctAnswerText?: string;
  visualData?: {
    totalParts?: number;
    shadedParts?: number;
    shape?: 'rectangle' | 'circle' | 'number_line';
    min?: number;
    max?: number;
    targetValue?: number;
    unit?: string;
  };
  explanation: string;
  hints: string[]; // 3-level progressive hints
  difficultyLevel: 1 | 2 | 3;
}

export interface Quest {
  id: string;
  zoneId: string;
  title: string;
  grade: SchoolGrade;
  world: SchoolWorld;
  domain: MathDomain;
  description: string;
  narrativeIntro: string;
  narrativeOutro: string;
  notionIds: string[];
  requiredLevel: number;
  xpReward: number;
  goldReward: number;
  itemRewardId?: string;
  badgeRewardId?: string;
  sequenceOrder?: number;
  requiredPreviousQuestId?: string;
  bossEnemy?: MonsterEnemy;
}

export interface QuestState {
  profileId: string;
  questId: string;
  isCompleted: boolean;
  progressPercent: number;
  completedAt?: number;
}

export interface MonsterEnemy {
  id: string;
  name: string;
  title: string;
  avatarIcon: string;
  maxHp: number;
  currentHp: number;
  shield: number;
  attackPower: number;
  element: 'arcane' | 'nature' | 'cristal' | 'ombre';
  weaknessDomain: MathDomain;
  description: string;
}

export type WardrobeSlot = 'jacket' | 'cape' | 'accessory';
export type ItemCategory = 'wardrobe' | 'relic' | 'consumable';

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  type: 'consumable' | 'relic' | 'badge' | 'equipment';
  category?: ItemCategory;
  wardrobeSlot?: WardrobeSlot;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  effectDescription: string;
}

export interface InventoryRecord {
  id: string;
  profileId: string;
  itemId: string;
  quantity: number;
  acquiredAt: number;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  competence: MathCompetence;
  icon: string;
  unlockedAt?: number;
}

export interface PlayerSettings {
  profileId: string;
  soundEnabled: boolean;
  musicVolume: number;
  sfxVolume: number;
  reducedMotion: boolean;
  externalJsonBackupEnabled: boolean;
  lastExternalBackupDate?: number;
}

export interface ZoneData {
  id: string;
  world: SchoolWorld;
  name: string;
  subtitle: string;
  grades: SchoolGrade[];
  description: string;
  themeColor: string;
  x: number; // % coordinates on map
  y: number;
  requiredLevel: number;
  bgGradient: string;
}

export interface SaveDataPackage {
  formatVersion: '1.0.0';
  schemaVersion: 1;
  exportedAt: number;
  generator: 'MathGame par Webdevoo';
  profile: PlayerProfile;
  masteryRecords: NotionMastery[];
  questStates: QuestState[];
  inventory: InventoryRecord[];
  achievements: AchievementBadge[];
  settings: PlayerSettings;
  checksum: string;
}
