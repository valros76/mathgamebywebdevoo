// MathGame par Webdevoo — Univers féérique RPG : Niveaux, Quêtes et Bestiaire (Zéro Doublon garanti)
import type { ZoneData, Quest, InventoryItem, AchievementBadge, SchoolGrade, SchoolWorld } from '../../types';

interface GradeConfig {
  grade: SchoolGrade;
  world: SchoolWorld;
  levels: number;
  subtitle: string;
  description: string;
  themeColor: string;
  bgGradient: string;
}

const GRADES_CONFIG: GradeConfig[] = [
  { grade: 'CP', world: 'primaire', levels: 3, subtitle: 'Premiers pas et calculs magiques', description: 'Apprentissage des nombres de 0 à 100 et premières additions.', themeColor: '#10b981', bgGradient: 'from-emerald-950 via-teal-900 to-slate-950' },
  { grade: 'CE1', world: 'primaire', levels: 3, subtitle: 'Nombres et mesures fondamentales', description: 'Calculs posés, soustractions et géométrie élémentaire.', themeColor: '#059669', bgGradient: 'from-green-950 via-emerald-950 to-slate-950' },
  { grade: 'CE2', world: 'primaire', levels: 3, subtitle: 'Multiplication et nombres entiers', description: 'Tables de multiplication, résolutions de problèmes et mesures.', themeColor: '#14b8a6', bgGradient: 'from-teal-950 via-emerald-950 to-slate-950' },
  { grade: 'CM1', world: 'primaire', levels: 4, subtitle: 'Fractions et décimaux', description: 'Nombres décimaux, fractions simples et aires.', themeColor: '#3b82f6', bgGradient: 'from-blue-950 via-indigo-950 to-slate-950' },
  { grade: 'CM2', world: 'primaire', levels: 4, subtitle: 'Proportionnalité et volumes', description: 'Calculs sur les décimaux, volumes et proportions.', themeColor: '#2563eb', bgGradient: 'from-indigo-950 via-blue-950 to-slate-950' },
  { grade: '6e', world: 'college', levels: 4, subtitle: 'Nombres relatifs et symétrie', description: 'Entiers relatifs, symétrie axiale et fractions quotients.', themeColor: '#06b6d4', bgGradient: 'from-cyan-950 via-blue-950 to-slate-950' },
  { grade: '5e', world: 'college', levels: 4, subtitle: 'Calcul littéral et angles', description: 'Initiation au calcul littéral, triangles et angles.', themeColor: '#8b5cf6', bgGradient: 'from-purple-950 via-violet-950 to-slate-950' },
  { grade: '4e', world: 'college', levels: 4, subtitle: 'Pythagore et équations', description: 'Théorème de Pythagore, équations du 1er degré et statistiques.', themeColor: '#7c3aed', bgGradient: 'from-violet-950 via-purple-950 to-slate-950' },
  { grade: '3e', world: 'college', levels: 4, subtitle: 'Fonctions et probabilités', description: 'Fonctions linéaires/affines, probabilités et Thalès.', themeColor: '#f59e0b', bgGradient: 'from-amber-950 via-purple-950 to-slate-950' },
];

export const GAME_ZONES: ZoneData[] = [];
export const GAME_QUESTS: Quest[] = [];

const THEME_DOMAINS = ['nombres_calcul', 'grandeurs_mesures', 'espace_geometrie', 'donnees'] as const;

for (const cfg of GRADES_CONFIG) {
  for (let lvl = 1; lvl <= cfg.levels; lvl++) {
    const zoneId = `zone_${cfg.grade.toLowerCase()}_l${lvl}`;
    const xPos = Math.round(15 + ((lvl - 1) * (70 / Math.max(1, cfg.levels - 1))));

    // 1. Create Zone for this Grade Level
    GAME_ZONES.push({
      id: zoneId,
      world: cfg.world,
      name: `${cfg.grade} — Niveau ${lvl}`,
      subtitle: `${cfg.subtitle} (Difficulté ${lvl}/${cfg.levels})`,
      grades: [cfg.grade],
      description: `${cfg.description} — Épreuve de niveau ${lvl} pour la classe de ${cfg.grade}.`,
      themeColor: cfg.themeColor,
      x: xPos,
      y: lvl % 2 === 0 ? 35 : 65,
      requiredLevel: lvl,
      bgGradient: cfg.bgGradient,
    });

    // 2. Create 10 Quests for this Grade Level
    for (let q = 1; q <= 10; q++) {
      const questId = `quest_${cfg.grade.toLowerCase()}_l${lvl}_q${q}`;
      const domain = THEME_DOMAINS[(lvl + q) % THEME_DOMAINS.length];
      const isBossQuest = q === 10;

      GAME_QUESTS.push({
        id: questId,
        zoneId: zoneId,
        title: `Quête ${cfg.grade} N°${(lvl - 1) * 10 + q} (Niv.${lvl})`,
        grade: cfg.grade,
        world: cfg.world,
        domain: domain,
        description: `Mission officielle du programme 2026 pour le niveau ${cfg.grade} — Épreuve #${q} du niveau ${lvl}.`,
        narrativeIntro: `« Aventurier du niveau ${cfg.grade}, prouve ta maîtrise en résolvant cette épreuve arithmétique rigoureuse ! »`,
        narrativeOutro: `L'épreuve #${q} est triomphée avec brio ! Le sceau runique s'illumine.`,
        notionIds: [`notion_${cfg.grade.toLowerCase()}_${domain}`],
        requiredLevel: lvl,
        sequenceOrder: (lvl - 1) * 10 + q,
        requiredPreviousQuestId: q > 1 ? `quest_${cfg.grade.toLowerCase()}_l${lvl}_q${q - 1}` : undefined,
        xpReward: 100 + lvl * 30 + q * 5,
        goldReward: 40 + lvl * 15 + q * 3,
        itemRewardId: isBossQuest ? 'item_diademe_hermes' : 'item_potion_soin',
        badgeRewardId: isBossQuest ? 'badge_calculer' : undefined,
        bossEnemy: {
          id: `boss_${questId}`,
          name: isBossQuest ? `Grand Gardien ${cfg.grade} (Niv.${lvl})` : `Sentinelle ${cfg.grade}-${lvl}-${q}`,
          title: `Maître de l'Épreuve ${q}`,
          avatarIcon: isBossQuest ? 'boss_archimage_chronos' : 'boss_gobelin_val',
          maxHp: 90, // Exactly 3 correct answers to defeat (90 HP / 30 dmg = 3 hits)
          currentHp: 90,
          shield: 10 * lvl,
          attackPower: 5 + lvl * 3,
          element: 'arcane',
          weaknessDomain: domain,
          description: `Un adversaire magique gardant l'accès à la quête ${q} du niveau ${lvl} (${cfg.grade}).`
        }
      });
    }
  }
}

import { CATALOG_BY_ID } from './rewardManager';

export const GAME_ITEMS: Record<string, InventoryItem> = CATALOG_BY_ID;

export const ACHIEVEMENT_BADGES: AchievementBadge[] = [
  {
    id: 'badge_chercher',
    title: 'Chercheur Émérite',
    description: 'A testé différentes pistes et exploré plusieurs solutions sans abandonner.',
    competence: 'chercher',
    icon: 'chercher',
  },
  {
    id: 'badge_modeliser',
    title: 'Modélisateur Maître',
    description: 'A su traduire une situation complexe en schéma ou en calcul.',
    competence: 'modeliser',
    icon: 'modeliser',
  },
  {
    id: 'badge_representer',
    title: 'Représentant Visionnaire',
    description: 'A excellé dans la représentation graphique et géométrique.',
    competence: 'representer',
    icon: 'representer',
  },
  {
    id: 'badge_calculer',
    title: 'Calculateur Prodigieux',
    description: 'A résolu des calculs mentaux et posés avec une précision absolue.',
    competence: 'calculer',
    icon: 'calculer',
  },
  {
    id: 'badge_raisonner',
    title: 'Raisonneur Logique',
    description: 'A appliqué des démonstrations et déductions rigoureuses.',
    competence: 'raisonner',
    icon: 'raisonner',
  },
  {
    id: 'badge_communiquer',
    title: 'Communicant Éloquent',
    description: 'A restitué clairement ses méthodes de résolution.',
    competence: 'communiquer',
    icon: 'communiquer',
  },
];
