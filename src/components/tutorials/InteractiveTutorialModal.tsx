// MathGame par Webdevoo — Grimoire Tutoriel Interactif & Visuel Pédagogique
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
  visualType: 'complement10' | 'multiplication' | 'fractions' | 'relatifs' | 'pythagore' | 'perimetre_aire' | 'nombres_decimaux';
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
    ],
  },
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
            title: `📖 Résumé : ${notion.title}`,
            explanation: `${notion.subtitle}\n\nProgramme officiel 2026 : ${notion.officialRef}\n\n• Objectifs pédagogiques :\n${notion.learningObjectives.map((o) => ` ✔️ ${o}`).join('\n')}`,
            visualType: vType,
          },
          {
            title: '💡 Méthode & Règle d\'Or',
            explanation: `Prérequis : ${notion.prerequisites.join(', ')}\n\n⚠️ Erreurs fréquentes à éviter :\n${notion.commonMisconceptions.map((m) => ` ❌ ${m}`).join('\n')}`,
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
          title: 'Résumé de la notion',
          explanation: 'Examine attentivement l’énoncé de l’exercice, décompose les données et applique la règle mathématique correspondante pas à pas.',
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
        <div className="mb-4 rounded-xl border border-indigo-800/60 bg-slate-950/70 p-4 min-h-[150px] flex flex-col items-center justify-center">
          {step.visualType === 'complement10' && (
            <div className="w-full max-w-md text-center">
              <p className="text-xs text-slate-400 mb-2">Illustration : Décomposition additive et complément</p>
              <div className="grid grid-cols-5 gap-2 bg-slate-900/80 p-3 rounded-lg border border-indigo-700/40">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-9 rounded-md border flex items-center justify-center text-sm ${
                      i < 7 ? 'border-red-500/60 bg-red-950/40 text-red-400' : 'border-cyan-500/60 bg-cyan-950/40 text-cyan-300'
                    }`}
                  >
                    {i < 7 ? '💎' : '✨'}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step.visualType === 'multiplication' && (
            <div className="w-full max-w-md text-center">
              <p className="text-xs text-slate-400 mb-2">Illustration : Groupement rectangulaire (multiplication)</p>
              <div className="flex flex-col gap-2 bg-slate-900/80 p-3 rounded-lg border border-indigo-700/40 font-mono text-xs text-amber-300">
                <span>🧪🧪🧪🧪 (4 par rangée)</span>
                <span>🧪🧪🧪🧪 (× 3 rangées)</span>
                <span className="text-cyan-300 font-bold">= 12 au total</span>
              </div>
            </div>
          )}

          {step.visualType === 'fractions' && (
            <div className="w-full max-w-md text-center">
              <p className="text-xs text-slate-400 mb-2">Illustration : Partage de l'unité en parts égales (Fractions)</p>
              <div className="flex h-10 w-full rounded-lg overflow-hidden border-2 border-indigo-500 shadow-md">
                <div className="w-1/4 bg-blue-500 flex items-center justify-center font-bold text-xs text-white">Part</div>
                <div className="w-1/4 bg-blue-500 flex items-center justify-center font-bold text-xs text-white">Part</div>
                <div className="w-1/4 bg-blue-500 flex items-center justify-center font-bold text-xs text-white">Part</div>
                <div className="w-1/4 bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-400">Reste</div>
              </div>
            </div>
          )}

          {step.visualType === 'perimetre_aire' && (
            <div className="w-full max-w-md text-center">
              <p className="text-xs text-slate-400 mb-2">Illustration : Contour (Périmètre) vs Surface (Aire)</p>
              <div className="p-3 bg-slate-900/95 rounded-xl border border-indigo-700/50 font-mono text-xs text-amber-300 space-y-1">
                <div>📏 Périmètre = Somme des 4 côtés</div>
                <div>🟩 Aire = Longueur × Largeur</div>
              </div>
            </div>
          )}

          {step.visualType === 'nombres_decimaux' && (
            <div className="w-full max-w-md text-center">
              <p className="text-xs text-slate-400 mb-2">Illustration : Alignement des virgules pour le calcul</p>
              <div className="p-3 bg-slate-900/95 rounded-xl border border-cyan-700/50 font-mono text-xs text-cyan-300 space-y-0.5">
                <div>Partie Entière , Partie Décimale</div>
                <div className="text-amber-300 font-bold">14 , 60</div>
                <div className="text-amber-300 font-bold">+ 7 , 45</div>
                <div className="border-t border-cyan-700 my-1" />
                <div className="text-emerald-300 font-bold">= 22 , 05</div>
              </div>
            </div>
          )}

          {step.visualType === 'pythagore' && (
            <div className="w-full max-w-md text-center">
              <p className="text-xs text-slate-400 mb-2">Illustration : Théorème de Pythagore (a² + b² = c²)</p>
              <div className="p-3 bg-slate-900/95 rounded-xl border border-purple-700/50 font-mono text-xs text-purple-300">
                c² = a² + b² ➔ c = √(a² + b²)
              </div>
            </div>
          )}

          {step.visualType === 'relatifs' && (
            <div className="w-full max-w-md text-center">
              <p className="text-xs text-slate-400 mb-2">Illustration : Axe vertical des relatifs</p>
              <div className="p-3 bg-slate-900/95 rounded-xl border border-blue-700/50 font-mono text-xs text-cyan-300">
                + Altitudes / 0 Surface / - Catacombes
              </div>
            </div>
          )}
        </div>

        {/* Step Content */}
        <div className="mb-4">
          <h3 className="text-base font-semibold text-amber-200 mb-1">{step.title}</h3>
          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{step.explanation}</p>
        </div>

        {/* Interactive question if present */}
        {step.question && step.options && (
          <div className="mb-5 rounded-xl bg-indigo-950/40 border border-indigo-800/60 p-4">
            <p className="text-xs font-semibold text-amber-300 mb-3">{step.question}</p>
            <div className="space-y-2">
              {step.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx, opt.isCorrect)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition border cursor-pointer ${
                      isSelected
                        ? opt.isCorrect
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow'
                          : 'bg-red-950/80 border-red-500 text-red-200 shadow'
                        : 'bg-slate-900/80 border-slate-700 text-slate-200 hover:border-amber-400'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            {selectedOption !== null && (
              <p className={`mt-2 text-xs font-medium ${answeredCorrectly ? 'text-emerald-400' : 'text-amber-300'}`}>
                {answeredCorrectly ? step.feedback || 'Bonne réponse !' : 'Réessaie ou relis l\'explication ci-dessus.'}
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
