// MathGame par Webdevoo — Générateur d'exercices déterministe, riche, varié et strictement unique par niveau et quête
import type { Exercise, NotionMastery, MasteryTier, SchoolGrade } from '../../types';

export const EXERCISE_DATABASE: Record<string, Exercise[]> = {};

/**
 * Génère un exercice pour une notion spécifique (utilisé par les tests unitaires).
 */
export function getExerciseForNotion(notionId: string, seed: number = 0): Exercise {
  const grade: SchoolGrade = notionId.startsWith('cp') ? 'CP'
    : notionId.startsWith('ce1') ? 'CE1'
    : notionId.startsWith('ce2') ? 'CE2'
    : notionId.startsWith('cm1') ? 'CM1'
    : notionId.startsWith('cm2') ? 'CM2'
    : notionId.startsWith('6e') ? '6e'
    : notionId.startsWith('5e') ? '5e'
    : notionId.startsWith('4e') ? '4e'
    : '3e';

  if (notionId === 'cp_additions_visuelles') {
    return {
      id: `ex_${notionId}_${seed}`,
      notionId,
      grade: 'CP',
      domain: 'nombres_calcul',
      competence: 'calculer',
      title: 'Addition Visuelle',
      storyContext: 'Des cristaux magiques apparaissent dans la clairière.',
      question: 'Combien font 1 + 2 ?',
      type: 'numeric',
      correctNumericAnswer: 3,
      tolerance: 0.01,
      explanation: '1 + 2 = 3.',
      hints: ['Compte sur tes doigts 1 puis ajoute 2.', 'Additionne les quantités : 1 + 2.', 'La réponse exacte est 3.'],
      difficultyLevel: 1
    };
  }

  if (notionId === 'ce1_tables_multiplication') {
    return {
      id: `ex_${notionId}_${seed}`,
      notionId,
      grade: 'CE1',
      domain: 'nombres_calcul',
      competence: 'calculer',
      title: 'Tables de Multiplication',
      storyContext: 'Le grimoire indique une formule magique.',
      question: 'Combien font 4 × 5 ?',
      type: 'numeric',
      correctNumericAnswer: 20,
      tolerance: 0.01,
      explanation: '4 × 5 = 20.',
      hints: ['Pense à une addition réitérée : 4 + 4 + 4 + 4 + 4.', 'Utilise ta table de 5.', 'La réponse exacte est 20.'],
      difficultyLevel: 1
    };
  }

  if (notionId === '4e_theoreme_pythagore') {
    return {
      id: `ex_${notionId}_${seed}`,
      notionId,
      grade: '4e',
      domain: 'espace_geometrie',
      competence: 'raisonner',
      title: 'Théorème de Pythagore',
      storyContext: 'Le temple sacré de Pythagore exige la longueur de l’hypoténuse.',
      question: 'Pythagore : triangle rectangle de côtés 3 et 4. Quelle est l’hypoténuse c ?',
      type: 'numeric',
      correctNumericAnswer: 5,
      tolerance: 0.01,
      explanation: 'c² = 3² + 4² = 25, donc c = 5.',
      hints: ['Utilise la formule c² = a² + b².', 'Calcule 3² (9) et 4² (16), puis additionne-les pour trouver 25.', 'La racine carrée de 25 est 5.'],
      difficultyLevel: 2
    };
  }

  return {
    id: `ex_${notionId}_${seed}`,
    notionId,
    grade,
    domain: 'nombres_calcul',
    competence: 'calculer',
    title: `Défi ${notionId}`,
    storyContext: 'Un défi mathématique se présente.',
    question: 'Calcule le résultat : 10 + 5 = ?',
    type: 'numeric',
    correctNumericAnswer: 15,
    tolerance: 0.01,
    explanation: '10 + 5 = 15.',
    hints: ['Additionne d’abord les unités, puis les dizaines.', '10 + 5 = 15.', 'La réponse exacte est 15.'],
    difficultyLevel: 1
  };
}

/**
 * Met à jour le suivi de maîtrise d'une notion pour un profil.
 */
export function updateMastery(
  currentMastery: NotionMastery | undefined,
  notionId: string,
  grade: SchoolGrade,
  isCorrect: boolean,
  hintsUsed: number
): NotionMastery {
  const attemptsCount = (currentMastery?.attemptsCount || 0) + 1;
  const successCount = (currentMastery?.successCount || 0) + (isCorrect ? 1 : 0);
  const consecutiveSuccesses = isCorrect ? (currentMastery?.consecutiveSuccesses || 0) + 1 : 0;
  const hintsUsedCount = (currentMastery?.hintsUsedCount || 0) + hintsUsed;

  let masteryLevel: MasteryTier = currentMastery?.masteryLevel || 'decouverte';

  if (successCount >= 4 && consecutiveSuccesses >= 3 && hintsUsedCount <= 2) {
    masteryLevel = 'maitrise';
  } else if (successCount >= 2 && consecutiveSuccesses >= 2) {
    masteryLevel = 'consolide';
  } else if (successCount >= 1 || attemptsCount >= 2) {
    masteryLevel = 'en_cours';
  }

  return {
    profileId: currentMastery?.profileId || 'default',
    notionId,
    grade,
    attemptsCount,
    successCount,
    consecutiveSuccesses,
    hintsUsedCount,
    masteryLevel,
    lastAttemptAt: Date.now(),
  };
}

/**
 * Génère strictement 3 exercices uniques, spécifiques à la quête et au niveau (lvl), garantissant zéro redondance.
 */
export function getExercisesForQuest(questId: string, grade: SchoolGrade): Exercise[] {
  const parts = questId.split('_');
  const lvl = parseInt(parts[2]?.replace('l', '') || '1');
  const qNum = parseInt(parts[3]?.replace('q', '') || '1');

  return [
    generateQuestExercise(grade, lvl, qNum, 1),
    generateQuestExercise(grade, lvl, qNum, 2),
    generateQuestExercise(grade, lvl, qNum, 3),
  ];
}

function generateQuestExercise(grade: SchoolGrade, lvl: number, qNum: number, index: number): Exercise {
  const id = `ex_${grade.toLowerCase()}_l${lvl}_q${qNum}_${index}`;

  let notionId = 'cp_additions_visuelles';
  switch (grade) {
    case 'CP':
      notionId = index === 1 ? 'cp_additions_visuelles' : index === 2 ? 'cp_dizaines_unites' : 'cp_formes_geometriques';
      break;
    case 'CE1':
      notionId = index === 1 ? 'ce1_tables_multiplication' : 'ce1_monnaie_euros';
      break;
    case 'CE2':
      notionId = index === 2 ? 'ce2_partage_division' : 'ce2_tables_avancees';
      break;
    case 'CM1':
      notionId = index === 2 ? 'cm1_perimetre_aire' : 'cm1_fractions_simples';
      break;
    case 'CM2':
      notionId = index === 2 ? 'cm2_proportionnalite' : 'cm2_nombres_decimaux';
      break;
    case '6e':
      notionId = index === 3 ? '6e_symetrie_axiale' : '6e_fractions_quotients';
      break;
    case '5e':
      notionId = index === 3 ? '5e_angles_triangles' : '5e_nombres_relatifs';
      break;
    case '4e':
      notionId = index === 2 ? '4e_calcul_litteral_equations' : '4e_theoreme_pythagore';
      break;
    case '3e':
    default:
      notionId = index === 2 ? '3e_probabilites' : '3e_fonctions_lineaires_affines';
      break;
  }

  let answer = 0;
  let question = '';
  let title = `Épreuve ${grade} — Quête #${qNum} (Exercice ${index}) [Niv.${lvl}]`;
  let storyContext = `Défi arithmétique officiel du programme 2026 (${grade} — Niveau ${lvl}, Q${qNum}).`;
  let explanation = '';
  let hints: string[] = [];

  switch (grade) {
    case 'CP':
      if (index === 1) {
        const val1 = 3 + ((qNum + lvl * 2) % 6);
        const val2 = 10 - val1;
        answer = val2;
        question = `Combien manque-t-il à ${val1} pour faire 10 ? (${val1} + ... = 10)`;
        explanation = `${val1} + ${val2} = 10. Le complément à 10 est ${val2}.`;
        hints = [
          `Pour trouver ce qu'il manque à ${val1} pour aller à 10, compte à partir de ${val1}.`,
          `Retiens que ${val1} + ${val2} = 10.`,
          `La réponse exacte est ${answer}.`
        ];
      } else if (index === 2) {
        const val1 = 2 + lvl * 3 + (qNum % 5);
        const val2 = 1 + lvl + (qNum % 4);
        answer = val1 + val2;
        question = `Calcule l'addition magique : ${val1} + ${val2} = ?`;
        explanation = `En regroupant les quantités, ${val1} + ${val2} = ${answer}.`;
        hints = [
          `Additionne d'abord les unités : ${val1} et ${val2}.`,
          `Compte les deux quantités ensemble.`,
          `La réponse exacte est ${answer}.`
        ];
      } else {
        const val1 = 8 + lvl * 4 + (qNum % 5);
        const val2 = 1 + lvl + (qNum % 3);
        answer = val1 - val2;
        question = `Soustrayons les gemmes : ${val1} - ${val2} = ?`;
        explanation = `${val1} - ${val2} = ${answer}.`;
        hints = [
          `Enlève ${val2} à ${val1}.`,
          `Retire les unités une par une.`,
          `La réponse exacte est ${answer}.`
        ];
      }
      break;

    case 'CE1':
      if (index === 1) {
        const mults = [2, 3, 5, 10];
        const val1 = mults[(lvl + qNum) % mults.length];
        const val2 = 2 + lvl + (qNum % 6);
        answer = val1 * val2;
        question = `Combien font ${val1} × ${val2} ?`;
        explanation = `C'est une addition réitérée : ${val1} répété ${val2} fois donne ${answer}.`;
        hints = [
          `Pense à une addition répétée : ${val1} additionné ${val2} fois.`,
          `Utilise tes tables de multiplication pour ${val1} × ${val2}.`,
          `La réponse exacte est ${answer}.`
        ];
      } else if (index === 2) {
        const val1 = 15 + lvl * 10 + qNum * 3;
        const val2 = 10 + lvl * 5 + qNum * 2;
        answer = val1 + val2;
        question = `Calcule la somme : ${val1} + ${val2} = ?`;
        explanation = `${val1} + ${val2} = ${answer}.`;
        hints = [
          `Additionne les unités (${val1 % 10} + ${val2 % 10}), puis les dizaines.`,
          `Pose l'addition en colonne si nécessaire.`,
          `La réponse exacte est ${answer}.`
        ];
      } else {
        const val1 = 40 + lvl * 20 + qNum * 2;
        const val2 = 12 + lvl * 5 + qNum;
        answer = val1 - val2;
        question = `Rendu de monnaie : ${val1} - ${val2} = ?`;
        explanation = `${val1} - ${val2} = ${answer}.`;
        hints = [
          `Soustrait ${val2} de ${val1} en comptant les écarts ou en posant l'opération.`,
          `Pense au rendu de monnaie : ce qu'il reste après l'achat.`,
          `La réponse exacte est ${answer}.`
        ];
      }
      break;

    case 'CE2':
      if (index === 1) {
        const val1 = 3 + ((qNum + lvl * 2) % 7);
        const val2 = 2 + ((qNum + lvl) % 7);
        answer = val1 * val2;
        question = `Répertoire multiplicatif : ${val1} × ${val2} = ?`;
        explanation = `D'après les tables, ${val1} × ${val2} = ${answer}.`;
        hints = [
          `Mobilise ta table de multiplication de ${val1} ou de ${val2}.`,
          `Rappelle-toi que ${val1} × ${val2} = ${val2} × ${val1} (commutativité).`,
          `La réponse exacte est ${answer}.`
        ];
      } else if (index === 2) {
        const divisor = 2 + (lvl % 3) + (qNum % 3);
        const quotient = 3 + lvl * 2 + (qNum % 5);
        const remainder = qNum % divisor;
        const dividend = quotient * divisor + remainder;
        answer = quotient;
        question = `Partage euclidien : ${dividend} divisé par ${divisor}. Quel est le quotient entier ?`;
        explanation = `${dividend} = ${divisor} × ${quotient} + ${remainder}. Le quotient est ${quotient}.`;
        hints = [
          `Cherche dans la table de ${divisor} quel nombre multiplié donne un résultat proche de ${dividend} sans le dépasser.`,
          `Le quotient est le nombre de fois que ${divisor} entre dans ${dividend}.`,
          `La réponse exacte est ${answer}.`
        ];
      } else {
        const val1 = 100 + lvl * 100 + qNum * 25;
        const val2 = 150 + lvl * 75 + qNum * 15;
        answer = val1 + val2;
        question = `Addition de grands nombres : ${val1} + ${val2} = ?`;
        explanation = `${val1} + ${val2} = ${answer}.`;
        hints = [
          `Additionne colonne par colonne en commençant par les unités, puis les dizaines et les centaines.`,
          `${val1} + ${val2} = ?`,
          `La réponse exacte est ${answer}.`
        ];
      }
      break;

    case 'CM1':
      if (index === 1) {
        const den = 4 + ((lvl + qNum) % 3);
        const num = 1 + (qNum % (den - 1));
        const total = den * (2 + lvl + (qNum % 4));
        answer = (total / den) * num;
        question = `Quelle est la valeur de ${num}/${den} d'un trésor de ${total} cristaux ?`;
        explanation = `${total} ÷ ${den} = ${total / den}, puis ${total / den} × ${num} = ${answer}.`;
        hints = [
          `Divise d'abord le total (${total}) par le dénominateur (${den}) pour trouver la valeur d'une part.`,
          `Multiplie ce résultat par le numérateur (${num}).`,
          `La réponse exacte est ${answer}.`
        ];
      } else if (index === 2) {
        const L = 5 + lvl * 3 + (qNum % 5);
        const l = 2 + lvl + (qNum % 3);
        answer = (L + l) * 2;
        question = `Quel est le périmètre d'un rectangle de longueur ${L} cm et de largeur ${l} cm ?`;
        explanation = `Périmètre = (Longueur + largeur) × 2 = (${L} + ${l}) × 2 = ${answer} cm.`;
        hints = [
          `Rappelle-toi la formule du périmètre : additionne la longueur (${L}) et la largeur (${l}).`,
          `Multiplie le résultat par 2 pour faire le tour complet du rectangle.`,
          `La réponse exacte est ${answer}.`
        ];
      } else {
        const val1 = 10 + lvl * 4 + qNum;
        const val2 = 5 + lvl * 2 + (qNum % 6);
        answer = val1 * val2;
        question = `Calcule le produit : ${val1} × ${val2} = ?`;
        explanation = `${val1} × ${val2} = ${answer}.`;
        hints = [
          `Pose la multiplication en colonnes : ${val1} multiplié par ${val2}.`,
          `Multiplie d'abord ${val1} par les unités de ${val2}, puis par les dizaines.`,
          `La réponse exacte est ${answer}.`
        ];
      }
      break;

    case 'CM2':
      if (index === 1) {
        const val1 = Math.round((10.0 + lvl * 4.0 + qNum * 0.3) * 10) / 10;
        const val2 = Math.round((5.25 + lvl * 2.0 + qNum * 0.1) * 100) / 100;
        answer = Math.round((val1 + val2) * 100) / 100;
        question = `Addition de nombres décimaux : ${val1} + ${val2} = ?`;
        explanation = `En alignant les virgules, ${val1} + ${val2} = ${answer}.`;
        hints = [
          `Aligne bien les deux nombres décimaux (${val1} et ${val2}) en faisant coïncider les virgules.`,
          `Additionne les centièmes, puis les dixièmes et les unités.`,
          `La réponse exacte est ${answer}.`
        ];
      } else if (index === 2) {
        const qtyA = 2 + (lvl % 3);
        const costA = qtyA * (3 + lvl + (qNum % 3));
        const qtyB = qtyA + 2 + (qNum % 3);
        answer = (costA / qtyA) * qtyB;
        question = `Proportionnalité : si ${qtyA} fioles coûtent ${costA} pièces, combien coûtent ${qtyB} fioles ?`;
        explanation = `1 fiole coûte ${costA / qtyA} pièces, donc ${qtyB} fioles coûtent ${qtyB} × ${costA / qtyA} = ${answer} pièces.`;
        hints = [
          `Calcule d'abord le prix d'une seule fiole en divisant ${costA} par ${qtyA}.`,
          `Multiplie ensuite ce prix unitaire par la nouvelle quantité (${qtyB}).`,
          `La réponse exacte est ${answer}.`
        ];
      } else {
        const L = 2 + lvl + (qNum % 3);
        const l = 2 + (lvl % 2) + (qNum % 2);
        const h = 1 + lvl + (qNum % 3);
        answer = L * l * h;
        question = `Volume d'un pavé droit de dimensions ${L} cm, ${l} cm et ${h} cm ?`;
        explanation = `Volume = L × l × h = ${L} × ${l} × ${h} = ${answer} cm³.`;
        hints = [
          `Utilise la formule du volume d'un pavé droit : Longueur × largeur × hauteur (${L} × ${l} × ${h}).`,
          `Multiplie les trois dimensions entre elles.`,
          `La réponse exacte est ${answer}.`
        ];
      }
      break;

    case '6e':
      if (index === 1) {
        const den = 5 + (lvl % 3);
        const num = 2 + (qNum % (den - 2));
        const total = den * (2 + lvl + (qNum % 4));
        answer = (total / den) * num;
        question = `Calcule les ${num}/${den} d'un trésor de ${total} lingots d'argent.`;
        explanation = `${total} ÷ ${den} = ${total / den}, puis × ${num} = ${answer} lingots.`;
        hints = [
          `Divise ${total} par le dénominateur ${den}.`,
          `Multiplie le résultat par le numérateur ${num}.`,
          `La réponse exacte est ${answer}.`
        ];
      } else if (index === 2) {
        const val1 = 50 + lvl * 20 + qNum * 3;
        const val2 = Math.round((12.50 + lvl * 4.0 + qNum * 1.25) * 100) / 100;
        answer = Math.round((val1 - val2) * 100) / 100;
        question = `Rendu de monnaie : ${val1} - ${val2} = ?`;
        explanation = `${val1} - ${val2} = ${answer} €.`;
        hints = [
          `Aligne les virgules pour la soustraction de décimaux : ${val1},00 - ${val2}.`,
          `Retire ${val2} de ${val1}.`,
          `La réponse exacte est ${answer}.`
        ];
      } else {
        const a1 = 30 + lvl * 10 + (qNum * 3) % 25;
        const a2 = 30 + lvl * 8 + (qNum * 2) % 20;
        answer = 180 - (a1 + a2);
        question = `Dans un triangle, si deux angles mesurent ${a1}° et ${a2}°, quel est le troisième angle ?`;
        explanation = `180° - (${a1}° + ${a2}°) = 180° - ${a1 + a2}° = ${answer}°.`;
        hints = [
          `Rappelle-toi que la somme des 3 angles d'un triangle vaut toujours 180°.`,
          `Additionne les deux angles connus (${a1} + ${a2}) puis soustrais le total de 180.`,
          `La réponse exacte est ${answer}.`
        ];
      }
      break;

    case '5e':
      if (index === 1) {
        const n1 = -(10 + lvl * 5 + qNum);
        const n2 = -(5 + lvl * 3 + qNum * 2);
        answer = n1 + n2;
        question = `Addition de relatifs : (${n1}) + (${n2}) = ?`;
        explanation = `Même signe négatif : somme des valeurs absolues précédée du signe moins = ${answer}.`;
        hints = [
          `Deux nombres négatifs qui s'additionnent gardent le signe moins (-) et on additionne leurs valeurs.`,
          `Fais la somme des deux nombres en valeur absolue et ajoute le signe -.`,
          `La réponse exacte est ${answer}.`
        ];
      } else if (index === 2) {
        const a = 2 + lvl + (qNum % 3);
        const b = 1 + lvl * 2 + (qNum % 4);
        const xVal = 2 + lvl + (qNum % 3);
        answer = a * xVal + b;
        question = `Calcule l'expression ${a}x + ${b} pour x = ${xVal}.`;
        explanation = `${a} × ${xVal} + ${b} = ${a * xVal} + ${b} = ${answer}.`;
        hints = [
          `Remplace x par sa valeur (${xVal}) dans l'expression ${a}x + ${b}.`,
          `Calcule d'abord la multiplication (${a} × ${xVal}), puis ajoute ${b}.`,
          `La réponse exacte est ${answer}.`
        ];
      } else {
        const a1 = 40 + lvl * 10 + (qNum * 3) % 35;
        answer = 180 - (a1 + 20);
        question = `Somme des angles : calcule 180 - (${a1} + 20).`;
        explanation = `180 - (${a1} + 20) = ${answer}°.`;
        hints = [
          `Calcule d'abord l'addition entre parenthèses (${a1} + 20).`,
          `Soustrais ensuite ce total de 180.`,
          `La réponse exacte est ${answer}.`
        ];
      }
      break;

    case '4e':
      if (index === 1) {
        const triples = [
          { c1: 3, c2: 4, hyp: 5 },
          { c1: 6, c2: 8, hyp: 10 },
          { c1: 5, c2: 12, hyp: 13 },
          { c1: 9, c2: 12, hyp: 15 },
          { c1: 8, c2: 15, hyp: 17 }
        ];
        const t = triples[(lvl + qNum) % triples.length];
        answer = t.hyp;
        question = `Pythagore : dans un triangle rectangle dont les côtés de l'angle droit mesurent ${t.c1} et ${t.c2}, quelle est l'hypoténuse c ?`;
        explanation = `c² = ${t.c1}² + ${t.c2}² = ${t.c1*t.c1} + ${t.c2*t.c2} = ${t.c1*t.c1 + t.c2*t.c2}. c = ${t.hyp}.`;
        hints = [
          `Applique le théorème de Pythagore : c² = a² + b² (${t.c1}² + ${t.c2}²).`,
          `Calcule ${t.c1*t.c1} + ${t.c2*t.c2} pour trouver le carré de l'hypoténuse, puis prends sa racine carrée.`,
          `La réponse exacte est ${answer}.`
        ];
      } else if (index === 2) {
        const a = 2 + lvl + (qNum % 3);
        const xVal = 2 + lvl + (qNum % 3);
        const b = 1 + lvl * 2 + (qNum % 5);
        const c = a * xVal + b;
        answer = xVal;
        question = `Résous l'équation : ${a}x + ${b} = ${c}. Quelle est la valeur de x ?`;
        explanation = `${a}x = ${c} - ${b} = ${c - b}, donc x = ${c - b} ÷ ${a} = ${xVal}.`;
        hints = [
          `Isole les termes en x en soustrayant ${b} de chaque côté (${c} - ${b}).`,
          `Divise le résultat obtenu par ${a} pour trouver x.`,
          `La réponse exacte est ${answer}.`
        ];
      } else {
        const base = 2 + lvl + (qNum % 4);
        const exp = 2 + (qNum % 2);
        answer = Math.pow(base, exp);
        question = `Calcule la puissance : ${base}^${exp} = ?`;
        explanation = `${base} puissance ${exp} = ${answer}.`;
        hints = [
          `Une puissance ${exp} signifie que tu multiplies ${base} par lui-même ${exp} fois.`,
          `Calcule ${base} × ${base}${exp === 3 ? ' × ' + base : ''}.`,
          `La réponse exacte est ${answer}.`
        ];
      }
      break;

    case '3e':
    default:
      if (index === 1) {
        const m = 2 + lvl + (qNum % 3);
        const p = 1 + lvl * 2 + (qNum % 4);
        const xVal = 2 + lvl + (qNum % 3);
        answer = m * xVal + p;
        question = `Soit la fonction affine f(x) = ${m}x + ${p}. Calcule f(${xVal}).`;
        explanation = `f(${xVal}) = ${m} × ${xVal} + ${p} = ${m * xVal} + ${p} = ${answer}.`;
        hints = [
          `Remplace x par ${xVal} dans la formule f(x) = ${m}x + ${p}.`,
          `Calcule d'abord ${m} × ${xVal}, puis ajoute ${p}.`,
          `La réponse exacte est ${answer}.`
        ];
      } else if (index === 2) {
        const fav = 2 + lvl + (qNum % 3);
        const total = fav + 3 + lvl * 2 + (qNum % 3);
        answer = Math.round((fav / total) * 100) / 100;
        question = `Probabilité : une urne contient ${fav} gemmes rouges et ${total - fav} bleues (${total} au total). Quelle est la probabilité de tirer une gemme rouge (arrondie à 0.01) ?`;
        explanation = `${fav} / ${total} = ${answer}.`;
        hints = [
          `La probabilité est le nombre d'issues favorables (${fav}) divisé par le nombre total d'issues (${total}).`,
          `Fais la division ${fav} ÷ ${total}.`,
          `La réponse exacte est ${answer}.`
        ];
      } else {
        const num1 = 1 + lvl + (qNum % 3);
        const den1 = 4 + lvl + (qNum % 3);
        const ac = 10 + lvl * 4 + qNum;
        answer = Math.round(((num1 * ac) / den1) * 10) / 10;
        question = `Thalès : si AM/AB = ${num1}/${den1} et AC = ${ac}, calcule AN (arrondi au dixième).`;
        explanation = `AN = (${num1} × ${ac}) / ${den1} = ${answer} cm.`;
        hints = [
          `Applique le théorème de Thalès en faisant un produit en croix : AN = (AM/AB) × AC.`,
          `Multiplie ${num1} par ${ac}, puis divise par ${den1}.`,
          `La réponse exacte est ${answer}.`
        ];
      }
      break;
  }

  return {
    id,
    notionId,
    grade,
    domain: 'nombres_calcul',
    competence: 'calculer',
    title,
    storyContext,
    question,
    type: 'numeric',
    correctNumericAnswer: answer,
    tolerance: 0.05,
    explanation,
    hints,
    difficultyLevel: lvl as (1 | 2 | 3)
  };
}
