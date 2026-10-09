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
  visualType: 'complement10' | 'multiplication' | 'fractions' | 'relatifs' | 'pythagore';
  interactiveActionLabel?: string;
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
  tut_cp_complement10: {
    id: 'tut_cp_complement10',
    notionTitle: 'Les Compléments à 10',
    targetObjective: 'Comprendre comment deux quantités s\'assemblent pour former exactement 10.',
    steps: [
      {
        title: 'Étape 1 : Le Talisman des 10 Réceptacles',
        explanation: 'Ce talisman sacré possède 10 emplacements magiques disposés en deux rangées de 5.',
        visualType: 'complement10',
      },
      {
        title: 'Étape 2 : Placer 7 Cristaux Rouges',
        explanation: 'Nous remplissons 7 réceptacles avec des cristaux de rubis (5 en haut et 2 en bas). Combien de cases restent vides ?',
        visualType: 'complement10',
        question: 'Combien de cristaux saphirs bleus faut-il ajouter pour que le talisman soit plein ?',
        options: [
          { label: '2 cristaux', isCorrect: false },
          { label: '3 cristaux', isCorrect: true },
          { label: '4 cristaux', isCorrect: false },
        ],
        feedback: 'Bravo ! 7 + 3 = 10. Les 3 cases vides sont complétées par les cristaux bleus.',
      },
      {
        title: 'Étape 3 : La Règle d\'Or des Compléments',
        explanation: 'Pour n\'importe quel nombre entre 0 et 10, son complément est ce qu\'il manque pour atteindre 10. Par exemple : 6 + 4 = 10, 8 + 2 = 10, 9 + 1 = 10.',
        visualType: 'complement10',
      },
    ],
  },

  tut_ce1_multiplication: {
    id: 'tut_ce1_multiplication',
    notionTitle: 'Le Sens de la Multiplication',
    targetObjective: 'Comprendre que la multiplication est un regroupement de paquets égaux.',
    steps: [
      {
        title: 'Étape 1 : Les Rangs de Fioles Magiques',
        explanation: 'Dans l\'atelier, l\'alchimiste range ses fioles en rangées bien ordonnées.',
        visualType: 'multiplication',
      },
      {
        title: 'Étape 2 : 3 rangées de 4 fioles',
        explanation: 'Plutôt que de compter une par une : 1, 2, 3... on observe 3 rangées contenant chacune 4 fioles. C\'est 4 + 4 + 4 = 12.',
        visualType: 'multiplication',
        question: 'Comment écrit-on cette opération de manière condensée ?',
        options: [
          { label: '3 + 4 = 7', isCorrect: false },
          { label: '3 × 4 = 12', isCorrect: true },
          { label: '3 ÷ 4 = 12', isCorrect: false },
        ],
        feedback: 'Exactement ! « 3 fois 4 » s\'écrit 3 × 4 = 12. C\'est beaucoup plus rapide que d\'additionner.',
      },
      {
        title: 'Étape 3 : La Propriété Magique de Commutativité',
        explanation: 'Que l\'on compte 3 rangées de 4 (3 × 4) ou 4 colonnes de 3 (4 × 3), le résultat est le même : 12 fioles !',
        visualType: 'multiplication',
      },
    ],
  },

  tut_cm1_fractions: {
    id: 'tut_cm1_fractions',
    notionTitle: 'Les Fractions Simples',
    targetObjective: 'Donner du sens au numérateur (parties prises) et dénominateur (total de parts égales).',
    steps: [
      {
        title: 'Étape 1 : Le Cristal Unité',
        explanation: 'Voici une barre d\'or pur représentant « 1 unité » entière.',
        visualType: 'fractions',
      },
      {
        title: 'Étape 2 : Découpe en 4 parts égales',
        explanation: 'En taillant le cristal en 4 morceaux identiques, chaque morceau représente « 1 quart », noté 1/4.',
        visualType: 'fractions',
        question: 'Si un aventurier prend 3 de ces morceaux, quelle fraction possède-t-il ?',
        options: [
          { label: '1/3', isCorrect: false },
          { label: '3/4', isCorrect: true },
          { label: '4/3', isCorrect: false },
        ],
        feedback: 'Parfait ! 3 morceaux sur un total de 4 s\'écrit 3/4. Le 3 est le numérateur et le 4 est le dénominateur.',
      },
      {
        title: 'Étape 3 : Dénominateur vs Numérateur',
        explanation: '• Dénominateur (en bas) : le nombre TOTAL de parts égales qui composent l\'unité.\n• Numérateur (en haut) : le nombre de parts que tu as choisies ou colorées.',
        visualType: 'fractions',
      },
    ],
  },

  tut_5e_relatifs: {
    id: 'tut_5e_relatifs',
    notionTitle: 'Les Nombres Relatifs',
    targetObjective: 'Visualiser les nombres négatifs sous le zéro et comprendre leur addition.',
    steps: [
      {
        title: 'Étape 1 : L\'Axe Vertical du Donjon',
        explanation: 'Le niveau du sol est le niveau 0. Les tours s\'élèvent en altitude positive (+1, +2...), tandis que les catacombes plongent sous terre en nombres négatifs (-1, -2...).',
        visualType: 'relatifs',
      },
      {
        title: 'Étape 2 : Addition de deux nombres négatifs',
        explanation: 'Si un nain descend à -3 mètres, puis creuse encore 4 mètres plus bas, il s\'éloigne davantage du sol : (-3) + (-4) = -7 mètres.',
        visualType: 'relatifs',
        question: 'Quelle est la température si le thermomètre affiche -2°C et qu\'il baisse encore de 5°C ?',
        options: [
          { label: '+3°C', isCorrect: false },
          { label: '-7°C', isCorrect: true },
          { label: '-3°C', isCorrect: false },
        ],
        feedback: 'Exact ! Deux négatifs qui s\'ajoutent donnent un nombre encore plus négatif : -2 + (-5) = -7.',
      },
      {
        title: 'Étape 3 : Signes différents',
        explanation: 'Quand on ajoute un positif et un négatif (ex: -5 + 8), c\'est comme descendre de 5 puis remonter de 8 : on finit à +3.',
        visualType: 'relatifs',
      },
    ],
  },

  tut_4e_pythagore: {
    id: 'tut_4e_pythagore',
    notionTitle: 'Le Théorème de Pythagore',
    targetObjective: 'Visualiser la relation géométrique des carrés sur les côtés d\'un triangle rectangle.',
    steps: [
      {
        title: 'Étape 1 : Le Triangle Rectangle',
        explanation: 'Le théorème ne fonctionne QUE si le triangle possède un angle droit (90°). Le plus grand côté opposé à l\'angle droit s\'appelle l\'Hypoténuse.',
        visualType: 'pythagore',
      },
      {
        title: 'Étape 2 : Les Carrés Bâtis sur les Côtés',
        explanation: 'Sur un triangle de côtés 3 et 4, on dessine un carré de surface 3² = 9 et un autre de 4² = 16. La somme de leurs surfaces est 9 + 16 = 25.',
        visualType: 'pythagore',
        question: 'Quel nombre élevé au carré donne 25 ? (c² = 25 => c = ...)',
        options: [
          { label: 'c = 4', isCorrect: false },
          { label: 'c = 5', isCorrect: true },
          { label: 'c = 12,5', isCorrect: false },
        ],
        feedback: 'Bravo ! 5 × 5 = 25, donc la longueur de l\'hypoténuse est 5 ! a² + b² = c².',
      },
      {
        title: 'Étape 3 : La Formule Sacrée',
        explanation: 'Dans tout triangle ABC rectangle en A : BC² = AB² + AC². Grâce à la racine carrée √, on trouve toujours le côté manquant !',
        visualType: 'pythagore',
      },
    ],
  },
};

export const InteractiveTutorialModal: React.FC<InteractiveTutorialModalProps> = ({
  tutorialId,
  onClose,
  onStartPractice,
}) => {
  const getTutorialConfig = (id: string): TutorialConfig => {
    if (TUTORIAL_REGISTRY[id]) {
      return TUTORIAL_REGISTRY[id];
    }
    const notion = CURRICULUM_NOTIONS.find((n) => n.tutorialId === id || `tut_${n.id}` === id || n.id === id.replace('tut_', ''));
    if (notion) {
      return {
        id,
        notionTitle: notion.title,
        targetObjective: notion.learningObjectives[0] || notion.subtitle,
        steps: [
          {
            title: `📖 Résumé : ${notion.title}`,
            explanation: `${notion.subtitle}\n\nProgramme officiel 2026 : ${notion.officialRef}\n\n• Objectifs pédagogiques clés :\n${notion.learningObjectives.map((o) => ` ✔️ ${o}`).join('\n')}`,
            visualType: 'complement10',
          },
          {
            title: '💡 Méthode & Pièges à Éviter',
            explanation: `Prérequis : ${notion.prerequisites.join(', ')}\n\n⚠️ Erreurs fréquentes à éviter :\n${notion.commonMisconceptions.map((m) => ` ❌ ${m}`).join('\n')}`,
            visualType: 'complement10',
          }
        ]
      };
    }
    return TUTORIAL_REGISTRY.tut_cp_complement10;
  };

  const tutorial = getTutorialConfig(tutorialId);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);

  const step = tutorial.steps[currentStepIdx];
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
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition"
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

        {/* Visual Animation Box */}
        <div className="mb-4 rounded-xl border border-indigo-800/60 bg-slate-950/70 p-4 min-h-[160px] flex flex-col items-center justify-center">
          {step.visualType === 'complement10' && (
            <div className="w-full max-w-md">
              <p className="text-xs text-center text-slate-400 mb-2">Boîte de 10 cristaux (7 rouges + 3 bleus)</p>
              <div className="grid grid-cols-5 gap-2 bg-slate-900/80 p-3 rounded-lg border border-indigo-700/40">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-10 rounded-md border flex items-center justify-center text-base transition-all duration-300 ${
                      i < 7
                        ? 'border-red-500/60 bg-red-950/40 text-red-400 shadow-sm shadow-red-900/40 scale-100'
                        : 'border-cyan-500/60 bg-cyan-950/40 text-cyan-300 shadow-sm shadow-cyan-900/40'
                    }`}
                  >
                    {i < 7 ? '💎' : '✨'}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs mt-2 text-slate-400 px-1">
                <span className="text-red-400 font-medium">7 rubis</span>
                <span className="text-cyan-400 font-medium">3 saphirs manquants = 10 total</span>
              </div>
            </div>
          )}

          {step.visualType === 'multiplication' && (
            <div className="w-full max-w-md">
              <p className="text-xs text-center text-slate-400 mb-2">3 rangées horizontales de 4 fioles = 12</p>
              <div className="flex flex-col gap-2 bg-slate-900/80 p-3 rounded-lg border border-indigo-700/40">
                {[1, 2, 3].map((row) => (
                  <div key={row} className="flex justify-around items-center bg-indigo-950/40 py-1 px-2 rounded">
                    <span className="text-xs text-amber-400 font-mono">Rang {row} :</span>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map((col) => (
                        <span key={col} className="text-lg hover:scale-110 transition">🧪</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-center text-xs text-amber-300 mt-2 font-mono">4 + 4 + 4 = 3 × 4 = 12 fioles</p>
            </div>
          )}

          {step.visualType === 'fractions' && (
            <div className="w-full max-w-md text-center">
              <p className="text-xs text-slate-400 mb-2">Prisme taillé en 4 quarts égaux (3 colorés = 3/4)</p>
              <div className="flex h-12 w-full rounded-lg overflow-hidden border-2 border-indigo-500 shadow-md">
                <div className="w-1/4 bg-blue-500 flex items-center justify-center font-bold text-xs text-white border-r border-blue-400">1/4</div>
                <div className="w-1/4 bg-blue-500 flex items-center justify-center font-bold text-xs text-white border-r border-blue-400">1/4</div>
                <div className="w-1/4 bg-blue-500 flex items-center justify-center font-bold text-xs text-white border-r border-blue-400">1/4</div>
                <div className="w-1/4 bg-slate-800/80 flex items-center justify-center font-bold text-xs text-slate-400">1/4</div>
              </div>
              <div className="flex justify-between text-xs mt-2 text-indigo-300 font-mono">
                <span className="text-blue-400">Parties sélectionnées : 3</span>
                <span className="text-slate-400">Total : 4 parts</span>
              </div>
            </div>
          )}

          {step.visualType === 'relatifs' && (
            <div className="w-full max-w-md">
              <p className="text-xs text-center text-slate-400 mb-2">Axe vertical : Négatif sous terre / Positif en altitude</p>
              <div className="flex items-center justify-center gap-3 bg-slate-900/80 p-3 rounded-lg border border-indigo-700/40">
                <div className="flex flex-col items-center gap-1 font-mono text-xs">
                  <div className="text-emerald-400">+5m (Refuge) 🏰</div>
                  <div className="text-yellow-400 font-bold"> 0m (Surface) 🌳</div>
                  <div className="text-cyan-400">-3m (Grotte 1) ⛏️</div>
                  <div className="text-blue-400 font-bold">-7m (Abîme absolu) 🧊</div>
                </div>
              </div>
              <p className="text-center text-xs text-cyan-300 mt-2 font-mono">(-3) + (-4) = -7 mètres</p>
            </div>
          )}

          {step.visualType === 'pythagore' && (
            <div className="w-full max-w-md text-center">
              <p className="text-xs text-slate-400 mb-2">Triangle Rectangle 3, 4, 5 : 3² + 4² = 5²</p>
              <div className="flex justify-center items-center gap-4 py-2 font-mono text-sm">
                <div className="px-3 py-1.5 rounded bg-emerald-950/60 border border-emerald-500/50 text-emerald-300">
                  Côté a² = 3² = 9
                </div>
                <span className="text-amber-400 font-bold">+</span>
                <div className="px-3 py-1.5 rounded bg-cyan-950/60 border border-cyan-500/50 text-cyan-300">
                  Côté b² = 4² = 16
                </div>
                <span className="text-amber-400 font-bold">=</span>
                <div className="px-3 py-1.5 rounded bg-amber-950/60 border border-amber-500/50 text-amber-300 font-bold">
                  Hypoténuse c² = 25
                </div>
              </div>
              <p className="text-xs text-amber-300 mt-1">√25 = 5 mètres</p>
            </div>
          )}
        </div>

        {/* Step Content */}
        <div className="mb-4">
          <h3 className="text-base font-semibold text-amber-200 mb-1">{step.title}</h3>
          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{step.explanation}</p>
        </div>

        {/* Interactive Question if present */}
        {step.question && (
          <div className="mb-4 rounded-xl border border-indigo-700/50 bg-indigo-950/40 p-3 sm:p-4">
            <p className="text-sm font-medium text-amber-300 mb-2">{step.question}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {step.options?.map((opt, i) => {
                const isSelected = selectedOption === i;
                return (
                  <button
                    key={i}
                    onClick={() => handleSelectOption(i, opt.isCorrect)}
                    className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium border text-left transition ${
                      isSelected
                        ? opt.isCorrect
                          ? 'border-emerald-500 bg-emerald-950/60 text-emerald-200 ring-2 ring-emerald-500/50'
                          : 'border-red-500 bg-red-950/60 text-red-200 ring-2 ring-red-500/50'
                        : 'border-indigo-800/80 bg-slate-900/60 text-slate-200 hover:bg-indigo-900/40'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            {selectedOption !== null && (
              <p
                className={`mt-2 text-xs font-medium ${
                  answeredCorrectly ? 'text-emerald-400' : 'text-amber-300'
                }`}
              >
                {answeredCorrectly
                  ? step.feedback || 'Bonne réponse !'
                  : 'Essaie encore ou relis l\'explication ci-dessus.'}
              </p>
            )}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-indigo-900/60">
          <button
            onClick={prevStep}
            disabled={currentStepIdx === 0}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
              currentStepIdx === 0
                ? 'opacity-40 cursor-not-allowed border-slate-700 text-slate-500'
                : 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
          >
            ← Précédent
          </button>

          <div className="flex gap-1.5">
            {tutorial.steps.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentStepIdx ? 'w-4 bg-amber-400' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextStep}
            className="px-4 py-2 rounded-lg text-xs sm:text-sm font-medium bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md font-semibold transition flex items-center gap-1.5"
          >
            {isLastStep ? 'Passer aux défis ! ⚔️' : 'Suivant →'}
          </button>
        </div>
      </div>
    </div>
  );
};
