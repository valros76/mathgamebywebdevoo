// MathGame par Webdevoo — Générateur d'exercices déterministe et suivi de maîtrise
import type { Exercise, NotionMastery, MasteryTier } from '../../types';

export const EXERCISE_DATABASE: Record<string, Exercise[]> = {
  cp_additions_visuelles: [
    {
      id: 'ex_cp_add_1',
      notionId: 'cp_additions_visuelles',
      grade: 'CP',
      domain: 'nombres_calcul',
      competence: 'calculer',
      title: 'Les cristaux de lumière',
      storyContext: 'Le coffre de l\'arcaniste nécessite 10 cristaux pour s\'ouvrir. Tu en possèdes déjà 7.',
      question: 'Combien de cristaux manque-t-il pour faire 10 ? (7 + ... = 10)',
      type: 'numeric',
      correctNumericAnswer: 3,
      explanation: '7 + 3 = 10. Il manque 3 cristaux de lumière pour compléter la dizaine.',
      hints: [
        'Imagine tes 10 doigts. Lève 7 doigts : combien restent baissés ?',
        'Pars de 7 et compte sur tes doigts jusqu\'à 10 : 8, 9, 10... Tu as compté 3 doigts.',
        '10 - 7 = 3. La réponse est 3.'
      ],
      difficultyLevel: 1
    },
    {
      id: 'ex_cp_add_2',
      notionId: 'cp_additions_visuelles',
      grade: 'CP',
      domain: 'nombres_calcul',
      competence: 'representer',
      title: 'Le bouquet de mandragores',
      storyContext: 'L\'alchimiste mélange 4 mandragores rouges et 5 mandragores bleues dans son chaudron.',
      question: 'Combien de mandragores y a-t-il au total ?',
      type: 'multiple_choice',
      options: [
        { id: 'opt_1', label: '8 mandragores', isCorrect: false },
        { id: 'opt_2', label: '9 mandragores', isCorrect: true },
        { id: 'opt_3', label: '10 mandragores', isCorrect: false }
      ],
      explanation: '4 + 5 = 9. Le chaudron contient 9 mandragores.',
      hints: [
        'Regroupe les 4 mandragores et les 5 mandragores.',
        '4 + 4 = 8, donc 4 + 5 = 8 + 1.',
        '4 + 5 = 9. La bonne réponse est 9.'
      ],
      difficultyLevel: 1
    },
    {
      id: 'ex_cp_add_3',
      notionId: 'cp_additions_visuelles',
      grade: 'CP',
      domain: 'nombres_calcul',
      competence: 'calculer',
      title: 'La double clé runique',
      storyContext: 'Le gardien du portail a gravé : 6 + ... = 10 sur la porte magique.',
      question: 'Quel nombre complète ce sceau ?',
      type: 'numeric',
      correctNumericAnswer: 4,
      explanation: '6 + 4 = 10. Le complément à 10 de 6 est 4.',
      hints: [
        'Quel nombre faut-il ajouter à 6 pour atteindre 10 ?',
        'Pense à 5 + 5 = 10. Comme 6 = 5 + 1, il faut 5 - 1 = 4.',
        '6 + 4 = 10. La réponse est 4.'
      ],
      difficultyLevel: 2
    }
  ],

  cp_dizaines_unites: [
    {
      id: 'ex_cp_du_1',
      notionId: 'cp_dizaines_unites',
      grade: 'CP',
      domain: 'nombres_calcul',
      competence: 'representer',
      title: 'Les bourses de l\'avare',
      storyContext: 'Un marchand possède 3 bourses de 10 pièces d\'or et 4 pièces isolées.',
      question: 'Combien de pièces d\'or possède le marchand au total ?',
      type: 'numeric',
      correctNumericAnswer: 34,
      explanation: '3 bourses de 10 font 30 pièces. 30 + 4 = 34 pièces au total.',
      hints: [
        'Chaque bourse contient 10 pièces. Compte de 10 en 10 : 10, 20, 30...',
        '3 bourses valent 3 dizaines (30). Ajoute les 4 unités.',
        '3 dizaines et 4 unités = 34.'
      ],
      difficultyLevel: 1
    }
  ],

  ce1_tables_multiplication: [
    {
      id: 'ex_ce1_mult_1',
      notionId: 'ce1_tables_multiplication',
      grade: 'CE1',
      domain: 'nombres_calcul',
      competence: 'calculer',
      title: 'L\'attaque des 5 gobelins',
      storyContext: '5 gobelins attaquent. Chacun porte 4 dagues tranchantes.',
      question: 'Combien de dagues les gobelins portent-ils au total ? (5 × 4)',
      type: 'numeric',
      correctNumericAnswer: 20,
      explanation: '5 × 4 = 20 dagues. C\'est 4 + 4 + 4 + 4 + 4 = 20.',
      hints: [
        'Multiplie 5 par 4, ou compte de 5 en 5 quatre fois.',
        '5, 10, 15, 20...',
        '5 × 4 = 20. La réponse est 20.'
      ],
      difficultyLevel: 1
    },
    {
      id: 'ex_ce1_mult_2',
      notionId: 'ce1_tables_multiplication',
      grade: 'CE1',
      domain: 'nombres_calcul',
      competence: 'modeliser',
      title: 'L\'armoire aux fioles',
      storyContext: 'L\'étagère comporte 3 rangées de 6 fioles d\'élixir alignées.',
      question: 'Combien de fioles y a-t-il sur l\'étagère ?',
      type: 'numeric',
      correctNumericAnswer: 18,
      explanation: '3 × 6 = 18. C\'est 6 + 6 + 6 = 18 fioles.',
      hints: [
        'Il y a 3 rangées contenant chacune 6 fioles.',
        '6 + 6 = 12, puis 12 + 6 = ...',
        '3 × 6 = 18 fioles.'
      ],
      difficultyLevel: 2
    }
  ],

  ce2_tables_avancees: [
    {
      id: 'ex_ce2_mult_1',
      notionId: 'ce2_tables_avancees',
      grade: 'CE2',
      domain: 'nombres_calcul',
      competence: 'calculer',
      title: 'La rune du chiffre 7',
      storyContext: 'La gargouille exige de résoudre l\'invocation ancestrale : 7 × 8.',
      question: 'Quel est le résultat de 7 × 8 ?',
      type: 'numeric',
      correctNumericAnswer: 56,
      explanation: '7 × 8 = 56. (Astuce mnémotechnique : 5, 6, 7, 8 -> 56 = 7 × 8).',
      hints: [
        'Rappelle-toi de 7 × 7 = 49. Ajoute 7 à 49.',
        '49 + 7 = 56.',
        '7 × 8 = 56.'
      ],
      difficultyLevel: 2
    }
  ],

  cm1_fractions_simples: [
    {
      id: 'ex_cm1_frac_1',
      notionId: 'cm1_fractions_simples',
      grade: 'CM1',
      domain: 'nombres_calcul',
      competence: 'representer',
      title: 'La tarte enchantée',
      storyContext: 'Le festin royal découpe une tarte aux baies en 4 parts égales. Tu manges 3 parts.',
      question: 'Quelle fraction de la tarte as-tu mangée ?',
      type: 'multiple_choice',
      options: [
        { id: 'opt_1', label: '1/4', isCorrect: false },
        { id: 'opt_2', label: '3/4', isCorrect: true },
        { id: 'opt_3', label: '4/3', isCorrect: false },
        { id: 'opt_4', label: '3/10', isCorrect: false }
      ],
      explanation: 'Le dénominateur (4) indique le nombre total de parts égales. Le numérateur (3) indique les parts mangées : 3/4.',
      hints: [
        'Le nombre du bas (dénominateur) représente le nombre total de parts.',
        'Le nombre du haut (numérateur) représente les parts prises.',
        '3 parts sur 4 s\'écrit 3/4.'
      ],
      difficultyLevel: 1
    },
    {
      id: 'ex_cm1_frac_2',
      notionId: 'cm1_fractions_simples',
      grade: 'CM1',
      domain: 'nombres_calcul',
      competence: 'calculer',
      title: 'Le ruban de mithril',
      storyContext: 'Un ruban de mithril mesure 24 mètres. L\'enchanteresse en prend le quart (1/4).',
      question: 'Combien de mètres de ruban a-t-elle pris ?',
      type: 'numeric',
      correctNumericAnswer: 6,
      explanation: 'Prendre 1/4 de 24, c\'est diviser 24 par 4. 24 ÷ 4 = 6 mètres.',
      hints: [
        'Le quart d\'une longueur correspond à une division par 4.',
        'Combien fait 24 divisé par 4 ? Pense à 4 × ... = 24.',
        '24 ÷ 4 = 6 mètres.'
      ],
      difficultyLevel: 2
    },
    {
      id: 'ex_cm1_frac_3',
      notionId: 'cm1_fractions_simples',
      grade: 'CM1',
      domain: 'nombres_calcul',
      competence: 'calculer',
      title: 'Le trésor des demi-lingots',
      storyContext: 'Un coffre runique contient 36 lingots d\'or. Le héros en offre la moitié (1/2) aux orphelins du village.',
      question: 'Combien de lingots d\'or cela représente-t-il ?',
      type: 'numeric',
      correctNumericAnswer: 18,
      explanation: 'La moitié de 36 correspond à 36 divisé par 2. 36 ÷ 2 = 18 lingots.',
      hints: [
        'Prendre la moitié d\'un nombre, c\'est le diviser par 2.',
        '30 ÷ 2 = 15 et 6 ÷ 2 = 3. Additionne les deux : 15 + 3 = 18.',
        '36 ÷ 2 = 18 lingots.'
      ],
      difficultyLevel: 2
    },
    {
      id: 'ex_cm1_frac_4',
      notionId: 'cm1_fractions_simples',
      grade: 'CM1',
      domain: 'nombres_calcul',
      competence: 'calculer',
      title: 'Les cristaux de téléportation',
      storyContext: 'Pour activer le téléporteur, il faut les 3/4 de 20 cristaux d\'azur.',
      question: 'Combien de cristaux cela représente-t-il ? (les 3/4 de 20)',
      type: 'numeric',
      correctNumericAnswer: 15,
      explanation: 'On calcule d\'abord un quart : 20 ÷ 4 = 5. Puis on multiplie par 3 : 5 × 3 = 15 cristaux.',
      hints: [
        'Calcule d\'abord 1/4 de 20 en divisant 20 par 4.',
        '20 ÷ 4 = 5. Multiplie maintenant ce résultat par 3.',
        '5 × 3 = 15 cristaux.'
      ],
      difficultyLevel: 2
    },
    {
      id: 'ex_cm1_frac_5',
      notionId: 'cm1_fractions_simples',
      grade: 'CM1',
      domain: 'nombres_calcul',
      competence: 'representer',
      title: 'L\'unité complète de mana',
      storyContext: 'Une jauge de mana est divisée en 5 compartiments égaux.',
      question: 'Quelle fraction correspond à la jauge entièrement pleine ?',
      type: 'multiple_choice',
      options: [
        { id: 'opt_1', label: '1/5', isCorrect: false },
        { id: 'opt_2', label: '5/5 (soit 1)', isCorrect: true },
        { id: 'opt_3', label: '5/1', isCorrect: false },
        { id: 'opt_4', label: '4/5', isCorrect: false }
      ],
      explanation: 'Quand toutes les parts sont remplies, numérateur et dénominateur sont égaux : 5/5 = 1 unité entière.',
      hints: [
        'Si tu as pris toutes les 5 parts sur les 5 disponibles, quel est le numérateur ?',
        'Le haut et le bas doivent être égaux pour faire un tout.',
        '5/5 est égal à 1 unité complète.'
      ],
      difficultyLevel: 1
    }
  ],

  cm1_multiples_calcul: [
    {
      id: 'ex_cm1_mult_1',
      notionId: 'cm1_multiples_calcul',
      grade: 'CM1',
      domain: 'nombres_calcul',
      competence: 'calculer',
      title: 'Le portail des multiples de 7',
      storyContext: 'Pour déverrouiller la dalle, choisis le nombre qui est un multiple de 7.',
      question: 'Lequel de ces nombres est un multiple de 7 ?',
      type: 'multiple_choice',
      options: [
        { id: 'opt_1', label: '25', isCorrect: false },
        { id: 'opt_2', label: '42 (car 6 × 7 = 42)', isCorrect: true },
        { id: 'opt_3', label: '33', isCorrect: false },
        { id: 'opt_4', label: '50', isCorrect: false }
      ],
      explanation: '42 est dans la table de 7 car 7 × 6 = 42. C\'est donc un multiple de 7.',
      hints: [
        'Récite la table de 7 : 7, 14, 21, 28, 35, 42...',
        'Vérifie quel nombre peut se diviser exactement par 7.',
        '6 × 7 = 42. La réponse est 42.'
      ],
      difficultyLevel: 1
    },
    {
      id: 'ex_cm1_mult_2',
      notionId: 'cm1_multiples_calcul',
      grade: 'CM1',
      domain: 'nombres_calcul',
      competence: 'calculer',
      title: 'Le calcul éclair de la garnison',
      storyContext: '8 archers tirent chacun 7 flèches d\'argent sur la cible magique.',
      question: 'Combien de flèches ont été tirées au total ? (8 × 7)',
      type: 'numeric',
      correctNumericAnswer: 56,
      explanation: '8 × 7 = 56 flèches d\'argent.',
      hints: [
        'Pense à 7 × 7 = 49. Ajoute encore 7.',
        '49 + 7 = 56.',
        '8 × 7 = 56.'
      ],
      difficultyLevel: 1
    },
    {
      id: 'ex_cm1_mult_3',
      notionId: 'cm1_multiples_calcul',
      grade: 'CM1',
      domain: 'nombres_calcul',
      competence: 'calculer',
      title: 'Le trésor des coffres scellés',
      storyContext: 'Le coffre fort réclame le produit magique de 9 × 6.',
      question: 'Quel est le résultat de 9 × 6 ?',
      type: 'numeric',
      correctNumericAnswer: 54,
      explanation: '9 × 6 = 54. (Astuce : 10 × 6 - 6 = 60 - 6 = 54).',
      hints: [
        'Multiplie 6 par 10 (60) puis retire 6.',
        '60 - 6 = 54.',
        '9 × 6 = 54.'
      ],
      difficultyLevel: 2
    },
    {
      id: 'ex_cm1_mult_4',
      notionId: 'cm1_multiples_calcul',
      grade: 'CM1',
      domain: 'nombres_calcul',
      competence: 'calculer',
      title: 'La division des pièces d\'or',
      storyContext: 'On partage équitablement 48 pièces d\'or entre 6 aventuriers.',
      question: 'Combien de pièces reçoit chaque aventurier ? (48 ÷ 6)',
      type: 'numeric',
      correctNumericAnswer: 8,
      explanation: '48 ÷ 6 = 8 pièces chacun, car 6 × 8 = 48.',
      hints: [
        'Dans la table de 6, quel nombre multiplié par 6 donne 48 ?',
        '6 × 7 = 42, 6 × 8 = 48.',
        '48 ÷ 6 = 8.'
      ],
      difficultyLevel: 2
    }
  ],

  cm1_mesures_perimetres: [
    {
      id: 'ex_cm1_mes_1',
      notionId: 'cm1_mesures_perimetres',
      grade: 'CM1',
      domain: 'grandeurs_mesures',
      competence: 'calculer',
      title: 'Le périmètre du jardin carré',
      storyContext: 'Un jardin d\'herbes rares est un carré dont chaque côté mesure 9 mètres.',
      question: 'Quel est le périmètre (le tour complet) de ce jardin en mètres ?',
      type: 'numeric',
      correctNumericAnswer: 36,
      explanation: 'Le périmètre d\'un carré est côté × 4. 9 × 4 = 36 mètres.',
      hints: [
        'Un carré possède 4 côtés de même longueur.',
        'Additionne 9 + 9 + 9 + 9 ou calcule 4 × 9.',
        '4 × 9 = 36 mètres.'
      ],
      difficultyLevel: 1
    },
    {
      id: 'ex_cm1_mes_2',
      notionId: 'cm1_mesures_perimetres',
      grade: 'CM1',
      domain: 'grandeurs_mesures',
      competence: 'calculer',
      title: 'La conversion des poudres de fée',
      storyContext: 'L\'alchimiste a récolté 2 kilogrammes (kg) de poudre d\'étoiles.',
      question: 'Combien de grammes (g) cela fait-il ? (1 kg = 1000 g)',
      type: 'numeric',
      correctNumericAnswer: 2000,
      explanation: '1 kilogramme vaut 1000 grammes. Donc 2 kg = 2 × 1000 = 2000 grammes.',
      hints: [
        'Le préfixe « kilo » signifie mille.',
        'Multiplie 2 par 1 000.',
        '2 × 1 000 = 2 000 grammes.'
      ],
      difficultyLevel: 1
    },
    {
      id: 'ex_cm1_mes_3',
      notionId: 'cm1_mesures_perimetres',
      grade: 'CM1',
      domain: 'grandeurs_mesures',
      competence: 'calculer',
      title: 'Le périmètre de la clairière rectangulaire',
      storyContext: 'La clairière mesure 12 mètres de longueur et 5 mètres de largeur.',
      question: 'Quel est son périmètre en mètres ? ((Longueur + largeur) × 2)',
      type: 'numeric',
      correctNumericAnswer: 34,
      explanation: 'Périmètre d\'un rectangle = (12 + 5) × 2 = 17 × 2 = 34 mètres.',
      hints: [
        'Additionne d\'abord la longueur et la largeur : 12 + 5 = 17.',
        'Multiplie ensuite cette somme par 2 pour faire le tour complet.',
        '17 × 2 = 34 mètres.'
      ],
      difficultyLevel: 2
    },
    {
      id: 'ex_cm1_mes_4',
      notionId: 'cm1_mesures_perimetres',
      grade: 'CM1',
      domain: 'grandeurs_mesures',
      competence: 'calculer',
      title: 'La mesure de la tapisserie',
      storyContext: 'Un tissu magique mesure 3 mètres et 40 centimètres.',
      question: 'Combien de centimètres cela fait-il au total ? (1 m = 100 cm)',
      type: 'numeric',
      correctNumericAnswer: 340,
      explanation: '3 mètres = 300 cm. 300 cm + 40 cm = 340 cm.',
      hints: [
        '1 mètre = 100 centimètres, donc 3 mètres = 300 cm.',
        'Ajoute les 40 centimètres restants à 300.',
        '300 + 40 = 340 cm.'
      ],
      difficultyLevel: 2
    }
  ],

  '3e_theoreme_thales': [
    {
      id: 'ex_3e_thales_1',
      notionId: '3e_theoreme_thales',
      grade: '3e',
      domain: 'espace_geometrie',
      competence: 'calculer',
      title: 'L\'alignement des obélisques',
      storyContext: 'Dans une configuration de Thalès avec des droites parallèles, AB = 6 cm, AM = 2 cm et AC = 9 cm.',
      question: 'Quelle est la longueur AN en cm si (MN) est parallèle à (BC) ? (AM/AB = AN/AC)',
      type: 'numeric',
      correctNumericAnswer: 3,
      explanation: 'D\'après le théorème de Thalès : AM/AB = AN/AC => 2/6 = AN/9 => 1/3 = AN/9 => AN = 9 ÷ 3 = 3 cm.',
      hints: [
        'Écris l\'égalité des rapports : AM/AB = AN/AC.',
        'Remplace par les valeurs connues : 2/6 = AN/9.',
        'Fais un produit en croix : AN = (2 × 9) ÷ 6 = 18 ÷ 6 = 3 cm.'
      ],
      difficultyLevel: 2
    },
    {
      id: 'ex_3e_thales_2',
      notionId: '3e_theoreme_thales',
      grade: '3e',
      domain: 'espace_geometrie',
      competence: 'modeliser',
      title: 'La hauteur du colosse par son ombre',
      storyContext: 'Un bâton de 2 mètres projette une ombre de 3 mètres. Au même instant, l\'ombre du colosse mesure 15 mètres.',
      question: 'Quelle est la hauteur du colosse en mètres ?',
      type: 'numeric',
      correctNumericAnswer: 10,
      explanation: 'Les rayons du soleil sont parallèles. Rapport = 15 ÷ 3 = 5. Hauteur = 2 × 5 = 10 mètres.',
      hints: [
        'L\'ombre du colosse est 5 fois plus grande que celle du bâton (15 / 3 = 5).',
        'Multiplie la hauteur du bâton (2 m) par 5.',
        '2 × 5 = 10 mètres.'
      ],
      difficultyLevel: 2
    }
  ],

  cm2_proportionnalite: [
    {
      id: 'ex_cm2_prop_1',
      notionId: 'cm2_proportionnalite',
      grade: 'CM2',
      domain: 'donnees',
      competence: 'modeliser',
      title: 'La recette du philtre de force',
      storyContext: 'Pour préparer 2 fioles de philtre de force, il faut 6 écailles de dragon.',
      question: 'Combien d\'écailles de dragon faut-il pour préparer 5 fioles ?',
      type: 'numeric',
      correctNumericAnswer: 15,
      explanation: 'Pour 1 fiole, il faut 6 ÷ 2 = 3 écailles. Pour 5 fioles, il faut 5 × 3 = 15 écailles.',
      hints: [
        'Passe d\'abord par l\'unité : combien d\'écailles pour 1 seule fiole ?',
        '2 fioles = 6 écailles, donc 1 fiole = 3 écailles. Multiplie ensuite par 5.',
        '5 × 3 = 15 écailles.'
      ],
      difficultyLevel: 2
    }
  ],

  '6e_fractions_quotients': [
    {
      id: 'ex_6e_frac_1',
      notionId: '6e_fractions_quotients',
      grade: '6e',
      domain: 'nombres_calcul',
      competence: 'calculer',
      title: 'Le tribut des gobelins',
      storyContext: 'Le seigneur des ténèbres exige les 3/5 d\'un trésor de 30 lingots d\'argent.',
      question: 'Combien de lingots d\'argent cela représente-t-il ?',
      type: 'numeric',
      correctNumericAnswer: 18,
      explanation: 'On calcule (30 ÷ 5) × 3 = 6 × 3 = 18 lingots.',
      hints: [
        'Calcule d\'abord un cinquième (1/5) du trésor en divisant 30 par 5.',
        '1/5 de 30 = 6 lingots. Multiplie ensuite par 3 pour avoir 3/5.',
        '6 × 3 = 18 lingots.'
      ],
      difficultyLevel: 2
    },
    {
      id: 'ex_6e_frac_2',
      notionId: '6e_fractions_quotients',
      grade: '6e',
      domain: 'nombres_calcul',
      competence: 'calculer',
      title: 'Le partage de l\'élixir',
      storyContext: 'Une fiole magique contient 40 centilitres d\'élixir de sagesse. Le mage en boit les 7/8.',
      question: 'Combien de centilitres a-t-il bu ?',
      type: 'numeric',
      correctNumericAnswer: 35,
      explanation: '40 ÷ 8 = 5. Puis 5 × 7 = 35 centilitres.',
      hints: [
        'Divise 40 par 8 pour trouver 1/8.',
        '40 ÷ 8 = 5 cl.',
        'Multiplie par 7 : 5 × 7 = 35 cl.'
      ],
      difficultyLevel: 2
    },
    {
      id: 'ex_6e_frac_3',
      notionId: '6e_fractions_quotients',
      grade: '6e',
      domain: 'nombres_calcul',
      competence: 'representer',
      title: 'L\'égalité des fractions',
      storyContext: 'L\'enchanteresse cherche une fraction égale à 3/4 parmi les propositions.',
      question: 'Lequel de ces nombres est égal à 3/4 ?',
      type: 'multiple_choice',
      options: [
        { id: 'opt_1', label: '6/8', isCorrect: true },
        { id: 'opt_2', label: '4/5', isCorrect: false },
        { id: 'opt_3', label: '3/8', isCorrect: false },
        { id: 'opt_4', label: '9/10', isCorrect: false }
      ],
      explanation: 'En multipliant le numérateur et le dénominateur de 3/4 par 2, on obtient (3×2)/(4×2) = 6/8.',
      hints: [
        'Multiplie le haut et le bas par le même nombre.',
        '3 × 2 = 6 et 4 × 2 = 8.',
        'La bonne réponse est 6/8.'
      ],
      difficultyLevel: 2
    }
  ],

  '6e_nombres_decimaux': [
    {
      id: 'ex_6e_dec_1',
      notionId: '6e_nombres_decimaux',
      grade: '6e',
      domain: 'nombres_calcul',
      competence: 'calculer',
      title: 'L\'addition des poids d\'or',
      storyContext: 'Un aventurier transporte 12,4 kg d\'or et trouve un second sac de 7,85 kg.',
      question: 'Quel est le poids total de son butin en kg ? (12,4 + 7,85)',
      type: 'numeric',
      correctNumericAnswer: 20.25,
      explanation: '12,40 + 7,85 = 20,25 kg.',
      hints: [
        'Aligne bien les virgules : 12,40 + 7,85.',
        'Additionne les centièmes (0 + 5), les dixièmes (4 + 8), puis les unités.',
        '12,4 + 7,85 = 20,25.'
      ],
      difficultyLevel: 1
    },
    {
      id: 'ex_6e_dec_2',
      notionId: '6e_nombres_decimaux',
      grade: '6e',
      domain: 'nombres_calcul',
      competence: 'calculer',
      title: 'La monnaie de la taverne',
      storyContext: 'Le tavernier te rend la monnaie sur un achat de 14,20 € avec un billet de 20 €.',
      question: 'Quelle somme te rend-il ? (20 - 14,20)',
      type: 'numeric',
      correctNumericAnswer: 5.80,
      explanation: '20,00 - 14,20 = 5,80 €.',
      hints: [
        'Calcule la différence entre 20 et 14,20.',
        'De 14,20 à 15,00 il y a 0,80 €, puis de 15 à 20 il y a 5 €.',
        '5,80 €.'
      ],
      difficultyLevel: 2
    }
  ],

  '5e_nombres_relatifs': [
    {
      id: 'ex_5e_rel_1',
      notionId: '5e_nombres_relatifs',
      grade: '5e',
      domain: 'nombres_calcul',
      competence: 'calculer',
      title: 'La descente dans les abîmes',
      storyContext: 'Un mineur nain se trouve à -15 mètres sous terre. Il s\'enfonce encore de 8 mètres.',
      question: 'À quelle profondeur se trouve-t-il désormais ? (-15 + (-8))',
      type: 'numeric',
      correctNumericAnswer: -23,
      explanation: '(-15) + (-8) = -23 mètres. Deux nombres négatifs qui s\'ajoutent donnent un nombre encore plus négatif.',
      hints: [
        'Le nain descend de 15 mètres, puis descend ENCORE de 8 mètres.',
        'Les deux nombres ont le même signe (-). On garde le signe - et on additionne leurs distances à zéro : 15 + 8 = 23.',
        'Le résultat est -23 mètres.'
      ],
      difficultyLevel: 2
    },
    {
      id: 'ex_5e_rel_2',
      notionId: '5e_nombres_relatifs',
      grade: '5e',
      domain: 'nombres_calcul',
      competence: 'calculer',
      title: 'La température du pic gelé',
      storyContext: 'La nuit, la température est de -4°C. Le matin, elle augmente de 9°C.',
      question: 'Quelle est la nouvelle température ? (-4 + 9)',
      type: 'numeric',
      correctNumericAnswer: 5,
      explanation: '-4 + 9 = +5°C. Les deux nombres ont des signes différents : on prend le signe du plus grand (9 > 4 -> +) et on soustrait 9 - 4 = 5.',
      hints: [
        'Sur un thermomètre, tu pars de -4 et tu montes de 9 degrés.',
        '-4 pour remonter à 0 consomme 4 degrés. Il reste 9 - 4 = 5 degrés au-dessus de zéro.',
        '-4 + 9 = 5.'
      ],
      difficultyLevel: 1
    }
  ],

  '4e_theoreme_pythagore': [
    {
      id: 'ex_4e_pyth_1',
      notionId: '4e_theoreme_pythagore',
      grade: '4e',
      domain: 'espace_geometrie',
      competence: 'calculer',
      title: 'La passerelle de cristal',
      storyContext: 'Pour relier deux tours, on forme un triangle rectangle dont les côtés de l\'angle droit mesurent 3 mètres et 4 mètres.',
      question: 'Quelle est la longueur de l\'hypoténuse (la passerelle) en mètres ?',
      type: 'numeric',
      correctNumericAnswer: 5,
      explanation: 'D\'après le théorème de Pythagore : c² = 3² + 4² = 9 + 16 = 25. Donc c = √25 = 5 mètres.',
      hints: [
        'Dans un triangle rectangle, l\'hypoténuse au carré est égale à la somme des carrés des deux autres côtés : c² = a² + b².',
        'Calcule 3² = 9 et 4² = 16. Additionne-les : 9 + 16 = 25.',
        'La racine carrée de 25 est 5 (car 5 × 5 = 25). L\'hypoténuse mesure 5 mètres.'
      ],
      difficultyLevel: 2
    }
  ],

  '4e_calcul_litteral_equations': [
    {
      id: 'ex_4e_eq_1',
      notionId: '4e_calcul_litteral_equations',
      grade: '4e',
      domain: 'nombres_calcul',
      competence: 'calculer',
      title: 'L\'énigme du Sphinx',
      storyContext: 'Le Sphinx garde la pyramide et murmure : « 3x + 5 = 26 ».',
      question: 'Quelle est la valeur de x qui résout cette équation ?',
      type: 'numeric',
      correctNumericAnswer: 7,
      explanation: '3x + 5 = 26 => 3x = 26 - 5 = 21 => x = 21 ÷ 3 = 7.',
      hints: [
        'Isole 3x en soustrayant 5 aux deux côtés de l\'équation.',
        '3x = 26 - 5 = 21. Divise maintenant par 3.',
        'x = 21 / 3 = 7. La réponse est 7.'
      ],
      difficultyLevel: 2
    }
  ],

  '3e_fonctions_lineaires_affines': [
    {
      id: 'ex_3e_fnc_1',
      notionId: '3e_fonctions_lineaires_affines',
      grade: '3e',
      domain: 'nombres_calcul',
      competence: 'calculer',
      title: 'Le sortilège de dilatation',
      storyContext: 'La puissance f d\'un sort affine dépend du mana x injecté selon la formule : f(x) = 4x - 3.',
      question: 'Calcule l\'image de 5 par la fonction f (c\'est-à-dire f(5)).',
      type: 'numeric',
      correctNumericAnswer: 17,
      explanation: 'f(5) = 4 × 5 - 3 = 20 - 3 = 17 unités de puissance.',
      hints: [
        'Remplace la variable x par 5 dans la formule 4x - 3.',
        'Effectue d\'abord la multiplication : 4 × 5 = 20, puis soustrais 3.',
        '20 - 3 = 17.'
      ],
      difficultyLevel: 2
    }
  ],

  '3e_probabilites': [
    {
      id: 'ex_3e_prob_1',
      notionId: '3e_probabilites',
      grade: '3e',
      domain: 'donnees_probas',
      competence: 'raisonner',
      title: 'L\'urne des gemmes ancestrales',
      storyContext: 'Une urne magique contient 3 gemmes de feu, 2 gemmes d\'eau et 5 gemmes de terre, indiscernables au toucher.',
      question: 'Quelle est la probabilité de tirer une gemme de feu ?',
      type: 'multiple_choice',
      options: [
        { id: 'opt_1', label: '3/10 (ou 0,3)', isCorrect: true },
        { id: 'opt_2', label: '1/3', isCorrect: false },
        { id: 'opt_3', label: '3/7', isCorrect: false },
        { id: 'opt_4', label: '5/10 (ou 0,5)', isCorrect: false }
      ],
      explanation: 'Nombre total de gemmes = 3 + 2 + 5 = 10. Il y a 3 gemmes de feu, donc probabilité = 3/10 = 0,3 (soit 30%).',
      hints: [
        'Calcule d\'abord le nombre total d\'issues possibles (nombre total de gemmes).',
        'Nombre total = 3 + 2 + 5 = 10 gemmes. Combien sont favorables (gemmes de feu) ?',
        '3 issues favorables sur 10 au total -> la probabilité est 3/10.'
      ],
      difficultyLevel: 1
    }
  ]
};

/**
 * Récupère ou génère un exercice pour une notion donnée.
 */
export function getExerciseForNotion(notionId: string, index = 0): Exercise {
  const exercises = EXERCISE_DATABASE[notionId];
  if (exercises && exercises.length > 0) {
    return exercises[index % exercises.length];
  }

  // Fallback généré dynamiquement pour assurer qu'aucun écran ne soit vide
  return {
    id: `fallback_${notionId}_${Date.now()}`,
    notionId,
    grade: 'CM1',
    domain: 'nombres_calcul',
    competence: 'calculer',
    title: 'Défi arithmétique d\'entraînement',
    storyContext: 'Un coffre runique attend ta réponse pour libérer son énergie.',
    question: 'Combien font 15 + 25 ?',
    type: 'numeric',
    correctNumericAnswer: 40,
    explanation: '15 + 25 = 40. En additionnant les unités (5 + 5 = 10) et les dizaines (10 + 20 = 30), 30 + 10 = 40.',
    hints: [
      'Ajoute d\'abord 5 à 15 pour obtenir une dizaine ronde.',
      '15 + 5 = 20, puis ajoute les 20 restants.',
      '20 + 20 = 40.'
    ],
    difficultyLevel: 1
  };
}

/**
 * Sélectionne un exercice strictement inédit pour un combat (garantit zéro doublon de question).
 */
export function getUniqueExerciseForBattle(
  notionId: string,
  askedExerciseIds: string[],
  fallbackIndex = 0
): Exercise {
  const exercises = EXERCISE_DATABASE[notionId] || [];
  const unasked = exercises.filter((ex) => !askedExerciseIds.includes(ex.id));

  if (unasked.length > 0) {
    return unasked[0];
  }

  // Génération dynamique de variante arithmétique inédite si la base est épuisée
  const turn = askedExerciseIds.length + 1;
  const val1 = 14 + turn * 6;
  const val2 = 9 + turn * 4;
  return {
    id: `dyn_${notionId}_${turn}_${Date.now()}`,
    notionId,
    grade: 'CM1',
    domain: 'nombres_calcul',
    competence: 'calculer',
    title: `Sceau Arithmétique Suprême (Vague ${turn})`,
    storyContext: 'Le gardien puise dans sa réserve de mana et invoque une nouvelle énigme !',
    question: `Calcule la somme magique pour briser son enchantement : ${val1} + ${val2} = ?`,
    type: 'numeric',
    correctNumericAnswer: val1 + val2,
    explanation: `${val1} + ${val2} = ${val1 + val2}. Ton calcul précis terrasse le gardien.`,
    hints: [
      `Décompose le calcul : (${val1} + ${val2}).`,
      `Additionne les unités puis les dizaines.`,
      `${val1} + ${val2} = ${val1 + val2}.`
    ],
    difficultyLevel: 2
  };
}

/**
 * Calcule le niveau de maîtrise d'une notion selon le barème pédagogique
 */
export function updateMastery(
  current: NotionMastery | undefined,
  notionId: string,
  grade: NotionMastery['grade'],
  isSuccess: boolean,
  hintsUsedCount: number
): NotionMastery {
  const base: NotionMastery = current || {
    profileId: '',
    notionId,
    grade,
    attemptsCount: 0,
    successCount: 0,
    consecutiveSuccesses: 0,
    hintsUsedCount: 0,
    masteryLevel: 'decouverte',
    lastAttemptAt: Date.now()
  };

  const newAttempts = base.attemptsCount + 1;
  const newSuccess = isSuccess ? base.successCount + 1 : base.successCount;
  const newConsecutive = isSuccess ? base.consecutiveSuccesses + 1 : 0;
  const newHints = base.hintsUsedCount + hintsUsedCount;

  // Calcul du palier
  let level: MasteryTier = base.masteryLevel;

  if (newSuccess >= 4 && newConsecutive >= 3 && hintsUsedCount === 0) {
    level = 'maitrise';
  } else if (newSuccess >= 2 && newConsecutive >= 2) {
    level = 'consolide';
  } else if (newSuccess >= 1) {
    level = 'en_cours';
  } else {
    level = 'decouverte';
  }

  return {
    ...base,
    attemptsCount: newAttempts,
    successCount: newSuccess,
    consecutiveSuccesses: newConsecutive,
    hintsUsedCount: newHints,
    masteryLevel: level,
    lastAttemptAt: Date.now()
  };
}
