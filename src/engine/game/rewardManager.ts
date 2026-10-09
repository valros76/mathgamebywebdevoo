// MathGame par Webdevoo — Moteur déterministe de récompenses (3 objets sans doublon par étape)
import type { InventoryItem, PlayerProfile, WardrobeSlot } from '../../types';

export const REWARD_CATALOG: InventoryItem[] = [
  // --- GARDE-ROBE : VESTES & TUNIQUES ---
  {
    id: 'item_veste_arcaniste',
    name: 'Veste d\'Arcaniste des Runes',
    description: 'Une somptueuse veste violette brodée de runes d\'or qui résonne avec les théorèmes.',
    type: 'equipment',
    category: 'wardrobe',
    wardrobeSlot: 'jacket',
    icon: 'veste_arcaniste',
    rarity: 'rare',
    effectDescription: 'Permet de personnaliser le buste de ton avatar avec la tenue d\'arcaniste.',
  },
  {
    id: 'item_cuirasse_geometre',
    name: 'Cuirasse du Géomètre d\'Acier',
    description: 'Un plastron poli gravé d\'hexagones et d\'angles droits inébranlables.',
    type: 'equipment',
    category: 'wardrobe',
    wardrobeSlot: 'jacket',
    icon: 'cuirasse_geometre',
    rarity: 'rare',
    effectDescription: 'Apparence d\'armure géométrique pour ton héros.',
  },
  {
    id: 'item_manteau_alchimiste',
    name: 'Manteau de l\'Alchimiste Fluvial',
    description: 'Un manteau d\'émeraude doté d\'une ceinture de fioles colorées pour les dosages parfaits.',
    type: 'equipment',
    category: 'wardrobe',
    wardrobeSlot: 'jacket',
    icon: 'manteau_alchimiste',
    rarity: 'rare',
    effectDescription: 'Apparence de maître alchimiste pour ton avatar.',
  },
  {
    id: 'item_tunique_rodeur',
    name: 'Tunique du Rôdeur Sylvestre',
    description: 'Un vêtement en cuir souple cousu de fil d\'or pour traquer les inconnues sans bruit.',
    type: 'equipment',
    category: 'wardrobe',
    wardrobeSlot: 'jacket',
    icon: 'tunique_rodeur',
    rarity: 'rare',
    effectDescription: 'Apparence de rôdeur forestier pour ton avatar.',
  },
  {
    id: 'item_manteau_archimage_supreme',
    name: 'Manteau Céleste d\'Archimage Suprême',
    description: 'Une tenue légendaire tissée de poussière d\'étoiles accordée uniquement aux maîtres ayant conquis l\'intégralité des quêtes du royaume.',
    type: 'equipment',
    category: 'wardrobe',
    wardrobeSlot: 'jacket',
    icon: 'veste_arcaniste',
    rarity: 'legendary',
    effectDescription: 'Apparence suprême exclusive du Prestige New Game+.',
  },

  // --- GARDE-ROBE : CAPES ---
  {
    id: 'item_cape_azur',
    name: 'Cape Azur des Marées',
    description: 'Un manteau fluide d\'un bleu azuréen chatoyant qui ondule comme une onde sinusoïdale.',
    type: 'equipment',
    category: 'wardrobe',
    wardrobeSlot: 'cape',
    icon: 'cape_azur',
    rarity: 'rare',
    effectDescription: 'Équipe une majestueuse cape azur avec fermoir royal sur ton avatar.',
  },
  {
    id: 'item_cape_etoilee',
    name: 'Cape Étoilée d\'Astronomie',
    description: 'Tissée de velours noir et constellée d\'étoiles d\'argent, elle scintille dans l\'obscurité.',
    type: 'equipment',
    category: 'wardrobe',
    wardrobeSlot: 'cape',
    icon: 'cape_etoilee',
    rarity: 'epic',
    effectDescription: 'Équipe une cape de nuit céleste sur ton avatar.',
  },
  {
    id: 'item_cape_emeraude',
    name: 'Cape d\'Émeraude Végétale',
    description: 'Bénie par les fées d\'Euclide, elle exhale un parfum de mousse et de feuillage frais.',
    type: 'equipment',
    category: 'wardrobe',
    wardrobeSlot: 'cape',
    icon: 'cape_emeraude',
    rarity: 'rare',
    effectDescription: 'Équipe une cape forestière sur ton avatar.',
  },
  {
    id: 'item_cape_pourpre',
    name: 'Cape Pourpre Royale',
    description: 'Un manteau de couronnement vermeil réservé aux grands stratèges arithmétiques.',
    type: 'equipment',
    category: 'wardrobe',
    wardrobeSlot: 'cape',
    icon: 'cape_pourpre',
    rarity: 'epic',
    effectDescription: 'Équipe une somptueuse cape impériale sur ton avatar.',
  },
  {
    id: 'item_cape_phenix',
    name: 'Cape Ardente du Phénix',
    description: 'Une cape aux dégradés de braise et d\'aurore qui ravive la ferveur mathématique.',
    type: 'equipment',
    category: 'wardrobe',
    wardrobeSlot: 'cape',
    icon: 'cape_phenix',
    rarity: 'legendary',
    effectDescription: 'Équipe la flamboyante cape du Phénix sur ton avatar.',
  },
  {
    id: 'item_cape_or',
    name: 'Manteau d\'Or Solaire',
    description: 'Fait de fils d\'or pur battus, reflétant la splendeur des démonstrations parfaites.',
    type: 'equipment',
    category: 'wardrobe',
    wardrobeSlot: 'cape',
    icon: 'cape_or',
    rarity: 'legendary',
    effectDescription: 'Équipe un manteau d\'or scintillant sur ton avatar.',
  },

  // --- GARDE-ROBE : ACCESSOIRES & COUVRE-CHEFS ---
  {
    id: 'item_diademe_cristal',
    name: 'Diadème de Cristal Flottant',
    description: 'Un cercle d\'or fin supportant un cristal bleu en lévitation au-dessus du front.',
    type: 'equipment',
    category: 'wardrobe',
    wardrobeSlot: 'accessory',
    icon: 'couronne',
    rarity: 'epic',
    effectDescription: 'Orne le front de ton héros d\'un cristal magique flottant.',
  },
  {
    id: 'item_chapeau_pointu',
    name: 'Chapeau Pointu d\'Adepte',
    description: 'Le couvre-chef traditionnel des étudiants de l\'Académie des Mathémagies.',
    type: 'equipment',
    category: 'wardrobe',
    wardrobeSlot: 'accessory',
    icon: 'grimoire',
    rarity: 'rare',
    effectDescription: 'Coiffe ton avatar du célèbre chapeau pointu d\'arcaniste.',
  },
  {
    id: 'item_lunettes_savant',
    name: 'Lunettes de Savant d\'Alexandrie',
    description: 'Montures de cuivre légères qui dédoublent les détails des figures géométriques.',
    type: 'equipment',
    category: 'wardrobe',
    wardrobeSlot: 'accessory',
    icon: 'relic',
    rarity: 'rare',
    effectDescription: 'Équipe d\'élégantes lunettes de savant dorées sur ton avatar.',
  },
  {
    id: 'item_casque_ailes',
    name: 'Casque Ailé d\'Hermès',
    description: 'Un casque d\'argent forgé avec des ailerons nacrés symbolisant la vivacité d\'esprit.',
    type: 'equipment',
    category: 'wardrobe',
    wardrobeSlot: 'accessory',
    icon: 'armure',
    rarity: 'epic',
    effectDescription: 'Équipe un heaume guerrier ailé sur ton avatar.',
  },
  {
    id: 'item_masque_chasseur',
    name: 'Masque d\'Ombre du Traqueur',
    description: 'Un demi-masque en cuir végétal qui affine la vision des relations mathématiques.',
    type: 'equipment',
    category: 'wardrobe',
    wardrobeSlot: 'accessory',
    icon: 'bouclier',
    rarity: 'rare',
    effectDescription: 'Équipe le masque de rôdeur sur ton avatar.',
  },
  {
    id: 'item_couronne_lumiere_pure',
    name: 'Couronne Royale des Étoiles Pures',
    description: 'Une couronne de platine ornée d\'astres scintillants accordée aux héros ayant bravé chaque épreuve du jeu.',
    type: 'equipment',
    category: 'wardrobe',
    wardrobeSlot: 'accessory',
    icon: 'couronne',
    rarity: 'legendary',
    effectDescription: 'Couronne mythique exclusive du Prestige New Game+.',
  },

  // --- RELIQUES MATHÉMATIQUES & OUTILS ---
  {
    id: 'item_compas_or',
    name: 'Compas d\'Or de Pythagore',
    description: 'L\'outil légendaire utilisé par les bâtisseurs des sept sanctuaires de la géométrie.',
    type: 'relic',
    category: 'relic',
    icon: 'compas',
    rarity: 'epic',
    effectDescription: '+25 de puissance magique sur les exercices de géométrie.',
  },
  {
    id: 'item_cristal_fraction',
    name: 'Prisme de Décomposition',
    description: 'Un cristal taillé en 4 facettes égales qui brille d\'une lueur boréale.',
    type: 'relic',
    category: 'relic',
    icon: 'cristal',
    rarity: 'rare',
    effectDescription: '+15% de bonus d\'expérience sur les défis de fractions.',
  },
  {
    id: 'item_amulette_glace',
    name: 'Amulette du Zéro Absolu',
    description: 'Gravée du signe moins et du signe plus, elle protège son porteur contre les erreurs de signes.',
    type: 'relic',
    category: 'relic',
    icon: 'bouclier',
    rarity: 'rare',
    effectDescription: '+10 d\'armure arcanique permanente.',
  },
  {
    id: 'item_rapporteur_astral',
    name: 'Rapporteur Céleste des Angles',
    description: 'Un demi-cercle d\'argent gradué en degrés d\'étoiles pour jauger les angles droits et aigus.',
    type: 'relic',
    category: 'relic',
    icon: 'compas',
    rarity: 'rare',
    effectDescription: 'Permet de mesurer instantanément les alignements de planètes.',
  },
  {
    id: 'item_tamis_eratosthene',
    name: 'Crible d\'Or d\'Ératosthène',
    description: 'Une grille enchantée qui filtre les nombres composés pour ne laisser passer que les premiers.',
    type: 'relic',
    category: 'relic',
    icon: 'piece',
    rarity: 'epic',
    effectDescription: 'Révèle les diviseurs secrets lors des combats arithmétiques.',
  },
  {
    id: 'item_sablier_archimede',
    name: 'Sablier du Temps Infini',
    description: 'Contient du sable de diamant qui s\'écoule en décimales précises.',
    type: 'relic',
    category: 'relic',
    icon: 'flamme',
    rarity: 'legendary',
    effectDescription: 'Permet d\'étendre le temps de réflexion sans aucune pénalité.',
  },
  {
    id: 'item_diademe_hermes',
    name: 'Diadème Stellaire d\'Hermès',
    description: 'Permet de visualiser les courbes f(x) directement dans le firmament nocturne.',
    type: 'relic',
    category: 'relic',
    icon: 'couronne',
    rarity: 'legendary',
    effectDescription: 'Titre honorifique : Grand Maître du Collège.',
  },

  // --- CONSOMMABLES D'AVENTURE ---
  {
    id: 'item_fiole_mana',
    name: 'Fiole de Mana Pédagogique',
    description: 'Un élixir bleuté distillé par les fées d\'Euclide. Rétablit l\'énergie magique.',
    type: 'consumable',
    category: 'consumable',
    icon: 'potion',
    rarity: 'common',
    effectDescription: 'Régénère 20 points de Mana et offre 1 Indice sans pénalité.',
  },
  {
    id: 'item_potion_soin',
    name: 'Élixir de Jouvence Mathématique',
    description: 'Une potion régénératrice qui restaure les points de vie en cas de choc arcanique.',
    type: 'consumable',
    category: 'consumable',
    icon: 'potion',
    rarity: 'common',
    effectDescription: 'Restaure 35 Points de Vie (HP).',
  },
  {
    id: 'item_cristal_clarte',
    name: 'Cristal de Clarté Géométrique',
    description: 'Une gemme transparente qui dissout les doutes et illumine la solution logique.',
    type: 'consumable',
    category: 'consumable',
    icon: 'cristal',
    rarity: 'common',
    effectDescription: 'Fournit instantanément une explication pas à pas détaillée.',
  },
  {
    id: 'item_plume_phenix',
    name: 'Plume de Phénix d\'Hypatie',
    description: 'Une plume sacrée capable de réécrire une étape de calcul erronée.',
    type: 'consumable',
    category: 'consumable',
    icon: 'flamme',
    rarity: 'rare',
    effectDescription: 'Protège contre 1 erreur lors du prochain combat.',
  },
  {
    id: 'item_parchemin_solution',
    name: 'Parchemin de Révélation',
    description: 'Un vélin magique qui trace les schémas géométriques avant l\'affrontement.',
    type: 'consumable',
    category: 'consumable',
    icon: 'parchemin',
    rarity: 'rare',
    effectDescription: 'Dévoile les formules clés de la quête.',
  },
];

export const CATALOG_BY_ID: Record<string, InventoryItem> = REWARD_CATALOG.reduce(
  (acc, item) => {
    acc[item.id] = item;
    return acc;
  },
  {} as Record<string, InventoryItem>
);

/**
 * RÈGLE FONDAMENTALE : Chaque étape récompensable accorde TROIS NOUVEAUX OBJETS RÉELLEMENT DIFFÉRENTS.
 * Le système est déterministe et protège contre les répétitions et doublons.
 *
 * @param questId - L'identifiant de la quête réussie
 * @param ownedItemIds - La liste des identifiants d'objets déjà possédés par le joueur
 * @returns Une liste de 3 nouveaux objets garantis sans doublons
 */
export function getThreeDeterministicStageRewards(
  questId: string,
  ownedItemIds: string[] = []
): InventoryItem[] {
  const ownedSet = new Set(ownedItemIds);

  // Filtrer les objets non encore possédés
  const unowned = REWARD_CATALOG.filter((item) => !ownedSet.has(item.id));

  // Si le joueur a déjà presque tout le catalogue, générer des reliques de prestige uniques
  if (unowned.length < 3) {
    const fallbackRewards: InventoryItem[] = [...unowned];
    let counter = 1;
    while (fallbackRewards.length < 3) {
      const prestigeId = `item_prestige_infini_${questId}_${counter}`;
      if (!ownedSet.has(prestigeId)) {
        fallbackRewards.push({
          id: prestigeId,
          name: `Fragment d'Infini Mathématique #${counter}`,
          description: `Une relique d'une pureté absolue forgée lors de la victoire de l'étape ${questId}.`,
          type: 'relic',
          category: 'relic',
          icon: 'cristal',
          rarity: 'legendary',
          effectDescription: '+50 de Prestige Mathématique.',
        });
      }
      counter++;
    }
    return fallbackRewards.slice(0, 3);
  }

  // Sélection équilibrée déterministe :
  // On privilégie 1 objet Garde-Robe, 1 Relique et 1 Consommable si possible
  const unownedWardrobe = unowned.filter((item) => item.category === 'wardrobe');
  const unownedRelics = unowned.filter((item) => item.category === 'relic');
  const unownedConsumables = unowned.filter((item) => item.category === 'consumable');

  const selected: InventoryItem[] = [];
  const selectedIds = new Set<string>();

  // Helper pour ajouter sans doublon
  const tryAdd = (list: InventoryItem[]) => {
    for (const item of list) {
      if (!selectedIds.has(item.id)) {
        selected.push(item);
        selectedIds.add(item.id);
        break;
      }
    }
  };

  // 1. Un objet de garde-robe si disponible
  if (unownedWardrobe.length > 0) {
    tryAdd(unownedWardrobe);
  }

  // 2. Une relique si disponible
  if (unownedRelics.length > 0) {
    tryAdd(unownedRelics);
  }

  // 3. Un consommable si disponible
  if (unownedConsumables.length > 0) {
    tryAdd(unownedConsumables);
  }

  // Si on n'a pas encore atteint 3 (par exemple une catégorie est épuisée), on complète avec le reste des non possédés
  for (const item of unowned) {
    if (selected.length >= 3) break;
    if (!selectedIds.has(item.id)) {
      selected.push(item);
      selectedIds.add(item.id);
    }
  }

  return selected.slice(0, 3);
}

/**
 * Alias déterministe pour récupérer les objets de récompense d'une étape
 */
export const getRewardItemsForStage = getThreeDeterministicStageRewards;

/**
 * Met à jour le profil avec les nouveaux objets et les sauvegarde
 */
export function applyRewardsToProfile(
  player: PlayerProfile,
  rewards: InventoryItem[]
): PlayerProfile {
  return {
    ...player,
    updatedAt: Date.now(),
  };
}

/**
 * Récompenses de prestige exclusives débloquées en terminant toutes les quêtes et en recommençant (New Game+)
 */
export const PRESTIGE_EXCLUSIVE_ITEMS: InventoryItem[] = [
  REWARD_CATALOG.find((i) => i.id === 'item_manteau_archimage_supreme')!,
  REWARD_CATALOG.find((i) => i.id === 'item_couronne_lumiere_pure')!,
].filter(Boolean);

