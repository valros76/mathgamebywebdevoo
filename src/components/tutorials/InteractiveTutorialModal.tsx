// MathGame par Webdevoo — Grimoire Tutoriel Interactif & Exemples Concrets Résolus
import React, { useState } from 'react';
import { soundManager } from '../../services/audio/soundManager';
import { IconBook, IconSparkles, ItemIconRenderer } from '../icons/GameIcons';
import { CURRICULUM_NOTIONS } from '../../engine/pedagogy/curriculum';

interface InteractiveTutorialModalProps {
  tutorialId: string;
  onClose: () => void;
  onStartPractice?: () => void;
}

interface StepData {
  title: string;
  explanation: string;
  visualType: 'complement10' | 'multiplication' | 'fractions' | 'relatifs' | 'pythagore' | 'perimetre_aire' | 'nombres_decimaux' | 'proportionnalite' | 'equations' | 'fonctions' | 'probabilites';
  question?: string;
  options?: { label: string; isCorrect: boolean }[];
  feedback?: string;
}

interface TutorialConfig {
  id: string;
  notionTitle: string;
  targetObjective: string;
  steps: StepData[];
}

const TUTORIAL_REGISTRY: Record<string, TutorialConfig> = {
  tut_cm2_proportionnalite: {
    id: 'tut_cm2_proportionnalite',
    notionTitle: 'Proportionnalité Simple : Le Grimoire Alchimique',
    targetObjective: 'Résoudre un problème de proportionnalité par le passage par l\'unité ou le coefficient.',
    steps: [
      {
        title: 'Étape 1 : Trouver le prix d\'une seule unité (Passer par l\'unité)',
        explanation: 'Exemple concret : Si 2 fioles magiques coûtent 6 pièces d\'or, combien coûtent 5 fioles ?\n\n1. On calcule d\'abord le prix d\'UNE seule fiole :\n   6 pièces ÷ 2 fioles = 3 pièces par fiole.\n\n2. On multiplie ce prix unitaire par la nouvelle quantité (5 fioles) :\n   5 fioles × 3 pièces = 15 pièces d\'or.',
        visualType: 'proportionnalite',
      },
      {
        title: 'Étape 2 : Règle d\'Or & Pièges à éviter',
        explanation: '• Règle d\'Or : Dans une situation proportionnelle, on multiplie ou on divise par le même nombre partout.\n\n❌ Piège fréquent : Ne jamais faire une addition additive (dire que si 2 fioles coûtent 6 et qu\'on en veut 5, on ajoute +3 car 2+3=5, c\'est faux ! On multiplie par le coefficient ou on passe par l\'unité).',
        visualType: 'proportionnalite',
      }
    ]
  },

  tut_cm2_nombres_decimaux: {
    id: 'tut_cm2_nombres_decimaux',
    notionTitle: 'Addition et Calcul avec les Nombres Décimaux',
    targetObjective: 'Maîtriser l\'addition de nombres à virgule par un alignement rigoureux.',
    steps: [
      {
        title: 'Étape 1 : L\'Alignement des Virgules',
        explanation: 'Exemple concret : Calculer 14,6 + 7,45\n\n1. On aligne les virgules verticalement en complétant par un zéro si nécessaire :\n     1 4 , 6 0\n   +  7 , 4 5\n   ------------\n\n2. On additionne de droite à gauche :\n   • Centièmes : 0 + 5 = 5\n   • Dixièmes : 6 + 4 = 10 (on pose 0, retient 1)\n   • Unitės : 4 + 7 + 1 (retenue) = 12 (pose 2, retient 1)\n   • Dizaines : 1 + 1 (retenue) = 2\n\nRésultat : 22,05',
        visualType: 'nombres_decimaux',
      },
      {
        title: 'Étape 2 : Règle d\'Or & Pièges à éviter',
        explanation: '❌ Erreur fréquente : Oublier d\'aligner les virgules ou additionner la partie entière avec la partie décimale directement (ex: écrire 14,6 + 7,45 = 14,105). La virgule reste toujours bien alignée dans la colonne.',
        visualType: 'nombres_decimaux',
      }
    ]
  },

  tut_cm1_perimetre_aire: {
    id: 'tut_cm1_perimetre_aire',
    notionTitle: 'Périmètre et Aire du Rectangle',
    targetObjective: 'Distinguer le contour (périmètre) et la surface intérieure (aire).',
    steps: [
      {
        title: 'Étape 1 : Calculer le Périmètre (Le Tour)',
        explanation: 'Exemple concret : Un rectangle de Longueur L = 6 cm et de largeur l = 3 cm.\n\n• Le Périmètre est la longueur totale du contour :\n  Périmètre = (Longueur + largeur) × 2\n  Périmètre = (6 + 3) × 2 = 9 × 2 = 18 cm.',
        visualType: 'perimetre_aire',
      },
      {
        title: 'Étape 2 : Calculer l\'Aire (La Surface)',
        explanation: '• L\'Aire est la surface occupée à l\'intérieur :\n  Aire = Longueur × largeur\n  Aire = 6 cm × 3 cm = 18 cm² (en cm carrés).\n\n❌ Piège fréquent : Confondre les unités (le périmètre est en cm, l\'aire est en cm²).',
        visualType: 'perimetre_aire',
      }
    ]
  },

  tut_cm1_fractions_simples: {
    id: 'tut_cm1_fractions_simples',
    notionTitle: 'Fractions Simples : Prendre une Fraction d\'une Quantité',
    targetObjective: 'Calculer la valeur d\'une fraction d\'un nombre entier.',
    steps: [
      {
        title: 'Étape 1 : Diviser par le dénominateur, multiplier par le numérateur',
        explanation: 'Exemple concret : Quelle est la valeur de 3/4 d\'un trésor de 20 cristaux ?\n\n1. Le dénominateur est 4 : on divise le total par 4 :\n   20 cristaux ÷ 4 = 5 cristaux (ce qui représente 1 quart).\n\n2. Le numérateur est 3 : on prend 3 parts :\n   5 cristaux × 3 = 15 cristaux.\n\nRésultat : 3/4 de 20 vaut 15 cristaux.',
        visualType: 'fractions',
      },
      {
        title: 'Étape 2 : Règle d\'Or & Pièges',
        explanation: '• Numérateur (en haut) : ce qu\'on prend.\n• Dénominateur (en bas) : le nombre total de parts égales dans lesquelles on découpe l\'unité.',
        visualType: 'fractions',
      }
    ]
  },

  tut_4e_theoreme_pythagore: {
    id: 'tut_4e_theoreme_pythagore',
    notionTitle: 'Le Théorème de Pythagore',
    targetObjective: 'Calculer la longueur de l\'hypoténuse dans un triangle rectangle.',
    steps: [
      {
        title: 'Étape 1 : La Formule Sacrée c² = a² + b²',
        explanation: 'Exemple concret : Un triangle rectangle a des côtés de l\'angle droit a = 3 et b = 4.\n\n1. On applique le théorème de Pythagore :\n   c² = a² + b²\n   c² = 3² + 4²\n   c² = 9 + 16 = 25.\n\n2. On prend la racine carrée pour trouver c :\n   c = √25 = 5 mètres.',
        visualType: 'pythagore',
      },
      {
        title: 'Étape 2 : Règle d\'Or & Pièges',
        explanation: '❌ Piège fréquent : N\'oublie jamais que ce théorème ne s\'applique QUE dans un triangle rectangle !',
        visualType: 'pythagore',
      }
    ]
  }
};

export const InteractiveTutorialModal: React.FC<InteractiveTutorialModalProps> = ({
  tutorialId,
  onClose,
  onStartPractice,
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);

  const getVisualType = (id: string): StepData['visualType'] => {
    if (id.includes('multiplication') || id.includes('tables')) return 'multiplication';
    if (id.includes('fraction') || id.includes('quotient')) return 'fractions';
    if (id.includes('relatif')) return 'relatifs';
    if (id.includes('pythagore')) return 'pythagore';
    if (id.includes('perimetre') || id.includes('aire')) return 'perimetre_aire';
    if (id.includes('decimaux') || id.includes('calcul')) return 'nombres_decimaux';
    if (id.includes('proportionnalite')) return 'proportionnalite';
    if (id.includes('equation')) return 'equations';
    if (id.includes('fonction')) return 'fonctions';
    if (id.includes('probabilite')) return 'probabilites';
    return 'complement10';
  };

  const getTutorialConfig = (id: string): TutorialConfig => {
    if (TUTORIAL_REGISTRY[id]) {
      return TUTORIAL_REGISTRY[id];
    }
    const notion = CURRICULUM_NOTIONS.find((n) => n.tutorialId === id || `tut_${n.id}` === id || n.id === id.replace('tut_', ''));
    const vType = getVisualType(id);

    if (notion) {
      return {
        id,
        notionTitle: notion.title,
        targetObjective: notion.learningObjectives[0] || notion.subtitle,
        steps: [
          {
            title: `📖 Exemple Concret & Méthode : ${notion.title}`,
            explanation: `${notion.subtitle}\n\nProgramme officiel 2026 : ${notion.officialRef}\n\n• Objectifs pédagogiques clés :\n${notion.learningObjectives.map((o) => ` ✔️ ${o}`).join('\n')}\n\n💡 Exemple résolu type :\nPour réussir ce type d'exercice, identifie bien les données de l'énoncé, pose ton calcul par étapes (comme vu dans ton cours) et vérifie la cohérence du résultat.`,
            visualType: vType,
          },
          {
            title: '💡 Règle d\'Or & Pièges à Éviter',
            explanation: `Prérequis indispensables : ${notion.prerequisites.join(', ')}\n\n⚠️ Erreurs fréquentes à éviter :\n${notion.commonMisconceptions.map((m) => ` ❌ ${m}`).join('\n')}`,
            visualType: vType,
          }
        ]
      };
    }

    return {
      id,
      notionTitle: 'Grimoire des Notions Pédagogiques',
      targetObjective: 'Maîtriser les concepts fondamentaux du programme officiel 2026.',
      steps: [
        {
          title: 'Exemple concret et méthode',
          explanation: 'Examine attentivement l’énoncé, décompose les données numériques et applique la formule étape par étape.',
          visualType: 'complement10',
        },
      ],
    };
  };

  const tutorial = getTutorialConfig(tutorialId);
  const step = tutorial.steps[currentStepIdx] || tutorial.steps[0];
  const isLastStep = currentStepIdx === tutorial.steps.length - 1;

  const handleSelectOption = (idx: number, isCorrect: boolean) => {
    setSelectedOption(idx);
    if (isCorrect) {
      soundManager.playSuccess();
      setAnsweredCorrectly(true);
    } else {
      soundManager.playError();
      setAnsweredCorrectly(false);
    }
  };

  const nextStep = () => {
    soundManager.playClick();
    setSelectedOption(null);
    setAnsweredCorrectly(false);
    if (!isLastStep) {
      setCurrentStepIdx((prev) => prev + 1);
    } else if (onStartPractice) {
      onStartPractice();
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    soundManager.playClick();
    setSelectedOption(null);
    setAnsweredCorrectly(false);
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
      <div className="relative max-h-[80vh] w-full max-w-2xl overflow-y-auto pb-12 rounded-3xl border border-amber-500/30 bg-gradient-to-b from-slate-900 to-indigo-950 p-5 sm:p-6 shadow-2xl shadow-amber-950/40 text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Sticky Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md z-10 flex items-center justify-between border-b border-indigo-900/60 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl" role="img" aria-label="Grimoire">📖</span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-amber-300 font-serif tracking-wide">
                {tutorial.notionTitle}
              </h2>
              <p className="text-xs text-indigo-300">
                Étape {currentStepIdx + 1} sur {tutorial.steps.length}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer le grimoire pédagogique"
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Objective banner */}
        <div className="mb-4 rounded-lg bg-indigo-950/50 border border-indigo-800/40 px-3 py-2 text-xs text-indigo-200">
          <span className="font-semibold text-amber-400">Objectif d'apprentissage : </span>
          {tutorial.targetObjective}
        </div>

        {/* Visual Illustration Box matching Notion */}
        <div className="mb-4 rounded-xl border border-indigo-800/60 bg-slate-950/70 p-4 min-h-[140px] flex flex-col items-center justify-center">
          {step.visualType === 'proportionnalite' && (
            <div className="w-full max-w-md text-center">
              <p className="text-xs text-slate-400 mb-2">Exemple concret résolu : Passage par l'unité</p>
              <div className="p-3 bg-slate-900/95 rounded-xl border border-amber-700/50 font-mono text-xs text-amber-300 space-y-1">
                <div>2 fioles ➔ 6 pièces d'or</div>
                <div>1 fiole ➔ 3 pièces (6 ÷ 2)</div>
                <div className="text-emerald-300 font-bold">5 fioles ➔ 15 pièces (5 × 3)</div>
              </div>
            </div>
          )}

          {step.visualType === 'nombres_decimaux' && (
            <div className="w-full max-w-md text-center">
              <p className="text-xs text-slate-400 mb-2">Exemple concret résolu : Addition posée</p>
              <div className="p-3 bg-slate-900/95 rounded-xl border border-cyan-700/50 font-mono text-xs text-cyan-300 space-y-0.5">
                <div className="text-amber-300 font-bold">14,60 + 7,45 = 22,05</div>
                <div>Alignement strict des virgules</div>
              </div>
            </div>
          )}

          {step.visualType === 'perimetre_aire' && (
            <div className="w-full max-w-md text-center">
              <p className="text-xs text-slate-400 mb-2">Exemple concret résolu : Périmètre & Aire</p>
              <div className="p-3 bg-slate-900/95 rounded-xl border border-indigo-700/50 font-mono text-xs text-amber-300 space-y-1">
                <div>L = 6cm, l = 3cm</div>
                <div>Périmètre = (6 + 3) × 2 = 18 cm</div>
                <div>Aire = 6 × 3 = 18 cm²</div>
              </div>
            </div>
          )}

          {step.visualType === 'fractions' && (
            <div className="w-full max-w-md text-center">
              <p className="text-xs text-slate-400 mb-2">Exemple concret résolu : Fraction d'une quantité</p>
              <div className="p-3 bg-slate-900/95 rounded-xl border border-blue-700/50 font-mono text-xs text-blue-300">
                3/4 de 20 ➔ 20 ÷ 4 = 5, puis 5 × 3 = 15
              </div>
            </div>
          )}

          {step.visualType === 'pythagore' && (
            <div className="w-full max-w-md text-center">
              <p className="text-xs text-slate-400 mb-2">Exemple concret résolu : Théorème de Pythagore</p>
              <div className="p-3 bg-slate-900/95 rounded-xl border border-purple-700/50 font-mono text-xs text-purple-300">
                c² = 3² + 4² = 9 + 16 = 25 ➔ c = 5
              </div>
            </div>
          )}

          {step.visualType === 'multiplication' && (
            <div className="w-full max-w-md text-center">
              <p className="text-xs text-slate-400 mb-2">Exemple concret résolu : Multiplication</p>
              <div className="p-3 bg-slate-900/95 rounded-xl border border-green-700/50 font-mono text-xs text-green-300">
                3 rangées de 4 ➔ 3 × 4 = 12
              </div>
            </div>
          )}

          {step.visualType === 'complement10' && (
            <div className="w-full max-w-md text-center">
              <p className="text-xs text-slate-400 mb-2">Exemple concret résolu : Complément à 10</p>
              <div className="p-3 bg-slate-900/95 rounded-xl border border-red-700/50 font-mono text-xs text-red-300">
                6 + ? = 10 ➔ Il manque 4
              </div>
            </div>
          )}
        </div>

        {/* Step Content */}
        <div className="mb-4">
          <h3 className="text-base font-semibold text-amber-200 mb-1">{step.title}</h3>
          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{step.explanation}</p>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-indigo-900/60">
          <button
            onClick={prevStep}
            disabled={currentStepIdx === 0}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
              currentStepIdx === 0 ? 'opacity-40 cursor-not-allowed border-slate-700 text-slate-500' : 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
          >
            ← Précédent
          </button>

          <div className="flex gap-1.5">
            {tutorial.steps.map((_, i) => (
              <span key={i} className={`w-2 h-2 rounded-full transition-all ${i === currentStepIdx ? 'w-4 bg-amber-400' : 'bg-slate-700'}`} />
            ))}
          </div>

          <button
            onClick={nextStep}
            className="px-4 py-2 rounded-lg text-xs sm:text-sm font-medium bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md font-semibold transition flex items-center gap-1.5 cursor-pointer"
          >
            {isLastStep ? 'Passer aux défis ! ⚔️' : 'Suivant →'}
          </button>
        </div>
      </div>
    </div>
  );
};
