// MathGame par Webdevoo — Repères Pédagogiques de Mathématiques (Inspiré des programmes 2026)
import type { CurriculumNotion, SchoolGrade, SchoolWorld } from '../../types';

export const CURRICULUM_NOTIONS: CurriculumNotion[] = [
  // --- PRIMAIRE (Monde des Fondations) ---
  // CP
  {
    id: 'cp_additions_visuelles',
    grade: 'CP',
    world: 'primaire',
    domain: 'nombres_calcul',
    competences: ['calculer', 'representer'],
    title: 'Additions et compléments à 10',
    subtitle: 'Associer des gemmes magiques pour atteindre 10',
    officialRef: 'Repères 2026 (Cycle 2 - CP) - Nombres entiers et calcul',
    learningObjectives: [
      'Connaître les décompositions additives des nombres jusqu\'à 10',
      'Maîtriser les compléments à 10',
      'Associer une situation d\'ajout au symbole +'
    ],
    prerequisites: ['Dénombrement jusqu\'à 10'],
    commonMisconceptions: ['Confondre le signe + et le signe =', 'Recommencer à compter à partir de 1 au lieu de surcompter'],
    tutorialAvailable: true,
    tutorialId: 'tut_cp_additions_visuelles'
  },
  {
    id: 'cp_dizaines_unites',
    grade: 'CP',
    world: 'primaire',
    domain: 'nombres_calcul',
    competences: ['representer', 'modeliser'],
    title: 'Dizaines et Unités magiques',
    subtitle: 'Former des bourses de 10 pièces d\'or',
    officialRef: 'Repères 2026 (Cycle 2 - CP) - Numération décimale de position',
    learningObjectives: [
      'Comprendre qu\'un paquet de 10 unités forme 1 dizaine',
      'Lire et écrire les nombres jusqu\'à 50'
    ],
    prerequisites: ['Compter jusqu\'à 20'],
    commonMisconceptions: ['Inverser chiffre des dizaines et des unités (ex: 21 et 12)'],
    tutorialAvailable: true,
    tutorialId: 'tut_cp_dizaines_unites'
  },
  {
    id: 'cp_formes_geometriques',
    grade: 'CP',
    world: 'primaire',
    domain: 'espace_geometrie',
    competences: ['chercher', 'communiquer'],
    title: 'Reconnaissance des formes runiques',
    subtitle: 'Identifier cercles, carrés, triangles et rectangles',
    officialRef: 'Repères 2026 (Cycle 2 - CP) - Reconnaître et nommer les solides et figures',
    learningObjectives: [
      'Nommer carré, rectangle, triangle et cercle',
      'Compter les sommets et les côtés d\'une figure plane'
    ],
    prerequisites: ['Repérage dans le plan'],
    commonMisconceptions: ['Penser qu\'un carré orienté en pointe n\'est plus un carré'],
    tutorialAvailable: true,
    tutorialId: 'tut_cp_formes_geometriques'
  },

  // CE1
  {
    id: 'ce1_tables_multiplication',
    grade: 'CE1',
    world: 'primaire',
    domain: 'nombres_calcul',
    competences: ['calculer', 'modeliser'],
    title: 'L\'Élixir des Tables de Multiplication (2, 5, 10)',
    subtitle: 'Comprendre la multiplication comme une addition réitérée',
    officialRef: 'Repères 2026 (Cycle 2 - CE1) - Sens de la multiplication',
    learningObjectives: [
      'Construire et mémoriser les tables de 2, 5 et 10',
      'Modéliser une organisation rectangulaire d\'objets par une multiplication'
    ],
    prerequisites: ['Addition de nombres inférieurs à 100'],
    commonMisconceptions: ['Confondre 3 × 4 et 3 + 4'],
    tutorialAvailable: true,
    tutorialId: 'tut_ce1_tables_multiplication'
  },
  {
    id: 'ce1_monnaie_euros',
    grade: 'CE1',
    world: 'primaire',
    domain: 'grandeurs_mesures',
    competences: ['resoudre', 'calculer', 'chercher'] as unknown as any,
    title: 'Le Marchand Ambulant : Euros et Centimes',
    subtitle: 'Payer l\'équipement et rendre la monnaie',
    officialRef: 'Repères 2026 (Cycle 2 - CE1) - Grandeurs et mesures : la monnaie',
    learningObjectives: [
      'Utiliser les pièces et billets en euros et centimes d\'euros',
      'Calculer une somme ou un rendu de monnaie simple'
    ],
    prerequisites: ['Additions simples'],
    commonMisconceptions: ['Oublier que 1 € = 100 centimes'],
    tutorialAvailable: true,
    tutorialId: 'tut_ce1_monnaie_euros'
  },

  // CE2
  {
    id: 'ce2_tables_avancees',
    grade: 'CE2',
    world: 'primaire',
    domain: 'nombres_calcul',
    competences: ['calculer', 'raisonner'],
    title: 'Toutes les Tables de Multiplication (3, 4, 6, 7, 8, 9)',
    subtitle: 'Maîtriser le grimoire multiplicatif complet',
    officialRef: 'Repères 2026 (Cycle 2 - CE2) - Mémorisation du répertoire multiplicatif',
    learningObjectives: [
      'Connaître par cœur les tables de 0 à 9',
      'Utiliser la commutativité (ex: 7 × 8 = 8 × 7)'
    ],
    prerequisites: ['Tables de 2, 5 et 10'],
    commonMisconceptions: ['Hésitations sur 7 × 8 = 56 et 6 × 9 = 54'],
    tutorialAvailable: true,
    tutorialId: 'tut_ce2_tables_avancees'
  },
  {
    id: 'ce2_partage_division',
    grade: 'CE2',
    world: 'primaire',
    domain: 'nombres_calcul',
    competences: ['chercher', 'modeliser'],
    title: 'Le Partage du Trésor : Initiation à la Division',
    subtitle: 'Distribuer équitablement et trouver le reste',
    officialRef: 'Repères 2026 (Cycle 2 - CE2) - Résolution de problèmes de partage et de groupement',
    learningObjectives: [
      'Résoudre des problèmes de partage équitable',
      'Identifier le quotient et le reste'
    ],
    prerequisites: ['Tables de multiplication'],
    commonMisconceptions: ['Oublier le reste lors d\'un partage non exact'],
    tutorialAvailable: true,
    tutorialId: 'tut_ce2_partage_division'
  },

  // CM1
  {
    id: 'cm1_fractions_simples',
    grade: 'CM1',
    world: 'primaire',
    domain: 'nombres_calcul',
    competences: ['representer', 'modeliser'],
    title: 'Les Cristaux Fractionnaires : Partage de l\'Unité',
    subtitle: 'Comprendre numérateur et dénominateur sur des parchemins runiques',
    officialRef: 'Repères 2026 (Cycle 3 - CM1) - Fractions simples : partage et mesure',
    learningObjectives: [
      'Donner du sens à une fraction simple (demi, tiers, quart, dixième)',
      'Placer une fraction sur une demi-droite graduée',
      'Comparer des fractions simples à l\'unité 1'
    ],
    prerequisites: ['Partage équitable et divisions simples'],
    commonMisconceptions: ['Additionner séparément numérateur et dénominateur'],
    tutorialAvailable: true,
    tutorialId: 'tut_cm1_fractions_simples'
  },
  {
    id: 'cm1_perimetre_aire',
    grade: 'CM1',
    world: 'primaire',
    domain: 'grandeurs_mesures',
    competences: ['calculer', 'raisonner'],
    title: 'L\'Enceinte du Château : Périmètre et Aire',
    subtitle: 'Mesurer le contour et la surface des parcelles enchantées',
    officialRef: 'Repères 2026 (Cycle 3 - CM1) - Périmètres de polygones et approche de l\'aire',
    learningObjectives: [
      'Distinguer nettement le périmètre (contour) et l\'aire (surface)',
      'Calculer le périmètre d\'un carré et d\'un rectangle'
    ],
    prerequisites: ['Mesure de longueurs en cm et m'],
    commonMisconceptions: ['Confondre la formule du périmètre et celle de l\'aire'],
    tutorialAvailable: true,
    tutorialId: 'tut_cm1_perimetre_aire'
  },

  // CM2
  {
    id: 'cm2_nombres_decimaux',
    grade: 'CM2',
    world: 'primaire',
    domain: 'nombres_calcul',
    competences: ['calculer', 'representer'],
    title: 'L\'Échelle Décimale : Dixièmes et Centièmes',
    subtitle: 'Dompter les nombres à virgule dans les fioles d\'alchimie',
    officialRef: 'Repères 2026 (Cycle 3 - CM2) - Nombres décimaux et calcul posé',
    learningObjectives: [
      'Comprendre la signification de chaque chiffre dans un décimal',
      'Additionner et soustraire des nombres décimaux',
      'Multiplier un décimal par 10, 100, 1000'
    ],
    prerequisites: ['Fractions décimales'],
    commonMisconceptions: ['Penser que 3,15 est plus grand que 3,8 parce que 15 > 8'],
    tutorialAvailable: true,
    tutorialId: 'tut_cm2_nombres_decimaux'
  },
  {
    id: 'cm2_proportionnalite',
    grade: 'CM2',
    world: 'primaire',
    domain: 'donnees',
    competences: ['modeliser', 'raisonner'],
    title: 'Le Grimoire Alchimique : Proportionnalité Simple',
    subtitle: 'Multiplier et diviser les ingrédients d\'une potion sacrée',
    officialRef: 'Repères 2026 (Cycle 3 - CM2) - Résoudre des problèmes de proportionnalité',
    learningObjectives: [
      'Reconnaître une situation de proportionnalité',
      'Appliquer le passage par l\'unité et le coefficient multiplicateur'
    ],
    prerequisites: ['Multiplications et divisions'],
    commonMisconceptions: ['Additionner au lieu de multiplier (fausse linéarité additive)'],
    tutorialAvailable: true,
    tutorialId: 'tut_cm2_proportionnalite'
  },

  // --- COLLÈGE (Royaume des Savoirs) ---
  // 6e
  {
    id: '6e_fractions_quotients',
    grade: '6e',
    world: 'college',
    domain: 'nombres_calcul',
    competences: ['representer', 'calculer'],
    title: 'Fractions comme Nombres et Quotients',
    subtitle: 'Prendre une fraction d\'une grandeur magique',
    officialRef: 'Repères 2026 (Cycle 3 - 6e) - Écritures fractionnaires et quotients',
    learningObjectives: [
      'Comprendre l\'écriture fractionnaire a/b comme le quotient de a par b',
      'Calculer une fraction d\'une quantité (ex: 3/4 de 24 orbes)'
    ],
    prerequisites: ['Fractions simples et divisions'],
    commonMisconceptions: ['Confondre a/b et b/a'],
    tutorialAvailable: true,
    tutorialId: 'tut_6e_fractions_quotients'
  },
  {
    id: '6e_symetrie_axiale',
    grade: '6e',
    world: 'college',
    domain: 'espace_geometrie',
    competences: ['representer', 'raisonner'],
    title: 'Le Miroir d\'Électrum : Symétrie Axiale',
    subtitle: 'Construire le reflet parfait des figures gardiennes',
    officialRef: 'Repères 2026 (Cycle 3 - 6e) - Symétrie axiale : propriétés et conservation',
    learningObjectives: [
      'Identifier des axes de symétrie',
      'Construire le symétrique d\'un point par rapport à une droite',
      'Savoir que la symétrie conserve les longueurs et les angles'
    ],
    prerequisites: ['Notion d\'angle droit et de milieu'],
    commonMisconceptions: ['Faire glisser la figure au lieu de la retourner (confusion avec la translation)'],
    tutorialAvailable: true,
    tutorialId: 'tut_6e_symetrie_axiale'
  },

  // 5e
  {
    id: '5e_nombres_relatifs',
    grade: '5e',
    world: 'college',
    domain: 'nombres_calcul',
    competences: ['calculer', 'representer'],
    title: 'Le Bastion des Relatifs : Positifs et Négatifs',
    subtitle: 'Thermomètres mystiques, altitudes et opérations sur la droite',
    officialRef: 'Repères 2026 (Cycle 4 - 5e) - Nombres relatifs : repérage, comparaison, addition',
    learningObjectives: [
      'Comparer deux nombres relatifs',
      'Additionner et soustraire des nombres relatifs avec la règle des signes'
    ],
    prerequisites: ['Repérage sur une droite graduée'],
    commonMisconceptions: ['Penser que -8 est supérieur à -2 parce que 8 > 2'],
    tutorialAvailable: true,
    tutorialId: 'tut_5e_nombres_relatifs'
  },
  {
    id: '5e_angles_triangles',
    grade: '5e',
    world: 'college',
    domain: 'espace_geometrie',
    competences: ['raisonner', 'calculer'],
    title: 'Le Triangle des Sages : Somme des Angles = 180°',
    subtitle: 'Trouver l\'angle manquant pour déverrouiller la porte runique',
    officialRef: 'Repères 2026 (Cycle 4 - 5e) - Somme des angles d\'un triangle et inégalité triangulaire',
    learningObjectives: [
      'Appliquer la propriété : la somme des 3 angles d\'un triangle vaut 180°',
      'Calculer la mesure d\'un troisième angle dans un triangle quelconque ou rectangle'
    ],
    prerequisites: ['Mesure des angles en degrés'],
    commonMisconceptions: ['Oublier que la propriété s\'applique à TOUS les triangles'],
    tutorialAvailable: true,
    tutorialId: 'tut_5e_angles_triangles'
  },

  // 4e
  {
    id: '4e_theoreme_pythagore',
    grade: '4e',
    world: 'college',
    domain: 'espace_geometrie',
    competences: ['raisonner', 'calculer', 'modeliser'],
    title: 'Le Sanctuaire Sacré de Pythagore',
    subtitle: 'Dans un triangle rectangle : a² + b² = c²',
    officialRef: 'Repères 2026 (Cycle 4 - 4e) - Théorème de Pythagore et racine carrée',
    learningObjectives: [
      'Identifier l\'hypoténuse d\'un triangle rectangle',
      'Calculer la longueur de l\'hypoténuse ou d\'un côté de l\'angle droit',
      'Utiliser la racine carrée'
    ],
    prerequisites: ['Triangle rectangle, puissances et carrés'],
    commonMisconceptions: ['Appliquer Pythagore à un triangle qui n\'est pas rectangle'],
    tutorialAvailable: true,
    tutorialId: 'tut_4e_theoreme_pythagore'
  },
  {
    id: '4e_calcul_litteral_equations',
    grade: '4e',
    world: 'college',
    domain: 'nombres_calcul',
    competences: ['modeliser', 'calculer'],
    title: 'La Balance de Thot : Équations du Premier Degré',
    subtitle: 'Trouver la valeur secrète de l\'inconnue x',
    officialRef: 'Repères 2026 (Cycle 4 - 4e) - Développer, factoriser et résoudre ax + b = c',
    learningObjectives: [
      'Modéliser un problème avec une équation à une inconnue',
      'Isoler x en appliquant les mêmes opérations aux deux membres de l\'égalité'
    ],
    prerequisites: ['Calcul littéral et priorités opératoires'],
    commonMisconceptions: ['Oublier de changer le signe en transposant un terme'],
    tutorialAvailable: true,
    tutorialId: 'tut_4e_calcul_litteral_equations'
  },

  // 3e
  {
    id: '3e_fonctions_lineaires_affines',
    grade: '3e',
    world: 'college',
    domain: 'nombres_calcul',
    competences: ['modeliser', 'representer'],
    title: 'L\'Oracle d\'Hermès : Fonctions Linéaires et Affines',
    subtitle: 'Associer formules f(x) = ax + b, tableaux et droites dans le repère',
    officialRef: 'Repères 2026 (Cycle 4 - 3e) - Notion de fonction, antécédent, image, représentation',
    learningObjectives: [
      'Calculer l\'image et l\'antécédent d\'un nombre par une fonction affine',
      'Interpréter le coefficient directeur et l\'ordonnée à l\'origine',
      'Lier proportionnalité et fonction linéaire f(x) = ax'
    ],
    prerequisites: ['Repérage dans le plan et proportionnalité'],
    commonMisconceptions: ['Confondre image (f(x)) et antécédent (x)'],
    tutorialAvailable: true,
    tutorialId: 'tut_3e_fonctions_lineaires_affines'
  },
  {
    id: '3e_probabilites',
    grade: '3e',
    world: 'college',
    domain: 'donnees_probas',
    competences: ['raisonner', 'calculer'],
    title: 'Le Dé du Destin : Probabilités à Deux Épreuves',
    subtitle: 'Calculer les chances d\'apparition d\'un événement magique',
    officialRef: 'Repères 2026 (Cycle 4 - 3e) - Équiprobabilité, arbres de probabilités',
    learningObjectives: [
      'Calculer des probabilités dans une expérience aléatoire simple ou à deux étapes',
      'Exprimer une probabilité sous forme de fraction, décimal ou pourcentage'
    ],
    prerequisites: ['Fractions et statistiques simples'],
    commonMisconceptions: ['Penser que les tirages passés influencent le tirage indépendant suivant'],
    tutorialAvailable: true,
    tutorialId: 'tut_3e_probabilites'
  }
];

export function getNotionsForGrade(grade: SchoolGrade): CurriculumNotion[] {
  return CURRICULUM_NOTIONS.filter((n) => n.grade === grade);
}

export function getNotionById(id: string): CurriculumNotion | undefined {
  return CURRICULUM_NOTIONS.find((n) => n.id === id);
}
