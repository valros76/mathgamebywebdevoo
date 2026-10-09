import React, { useState, useEffect } from 'react';
import type { PlayerProfile, NotionMastery } from '../../types';
import { CURRICULUM_NOTIONS } from '../../engine/pedagogy/curriculum';
import { db } from '../../services/persistence/db';
import { soundManager } from '../../services/audio/soundManager';
import { IconBook, IconScroll, IconSparkles } from '../../components/icons/GameIcons';

interface PedagogicalDashboardModalProps {
  player: PlayerProfile;
  onOpenTutorial: (tutorialId: string) => void;
  onClose: () => void;
}

export const PedagogicalDashboardModal: React.FC<PedagogicalDashboardModalProps> = ({
  player,
  onOpenTutorial,
  onClose,
}) => {
  const [masteryList, setMasteryList] = useState<NotionMastery[]>([]);
  const [selectedGradeFilter, setSelectedGradeFilter] = useState(player.grade);

  useEffect(() => {
    async function loadMastery() {
      const records = await db.progress.where('profileId').equals(player.id).toArray();
      setMasteryList(records);
    }
    loadMastery();
  }, [player.id]);

  const filteredNotions = CURRICULUM_NOTIONS.filter((n) => n.grade === selectedGradeFilter);

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'maitrise':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">Maîtrisé</span>;
      case 'consolide':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">Consolidé</span>;
      case 'en_cours':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">En cours</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-slate-400 border border-slate-800">Découverte</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-5">
      <div className="relative w-full max-w-3xl max-h-[92dvh] sm:max-h-[88vh] flex flex-col rounded-3xl border border-amber-500/40 bg-gradient-to-b from-slate-900 to-indigo-950 shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-indigo-900/60 p-4 sm:p-5 shrink-0 bg-slate-900/90 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-600/60 flex items-center justify-center shadow-md">
              <IconBook className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-amber-300 font-serif">
                Suivi Pédagogique & Compétences
              </h2>
              <p className="text-xs text-indigo-300">
                Inspiré des repères de mathématiques (école primaire et collège)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer le bilan pédagogique"
            className="rounded-xl p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 min-h-0">
          {/* Grade Filter Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 shrink-0">
            {(['CP', 'CE1', 'CE2', 'CM1', 'CM2', '6e', '5e', '4e', '3e'] as const).map((g) => (
              <button
                key={g}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedGradeFilter(g);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition cursor-pointer ${
                  selectedGradeFilter === g
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Notions List */}
          <div className="space-y-3">
            {filteredNotions.map((notion) => {
              const mastery = masteryList.find((m) => m.notionId === notion.id);
              const tier = mastery?.masteryLevel || 'decouverte';
              const successRate = mastery && mastery.attemptsCount > 0
                ? Math.round((mastery.successCount / mastery.attemptsCount) * 100)
                : 0;

              return (
                <div
                  key={notion.id}
                  className="rounded-xl border border-indigo-800/60 bg-slate-950/70 p-4 space-y-2 hover:border-amber-400/50 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-100">{notion.title}</h4>
                        {getTierBadge(tier)}
                      </div>
                      <p className="text-xs text-indigo-300 mt-0.5">{notion.subtitle}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {notion.tutorialAvailable && notion.tutorialId && (
                        <button
                          onClick={() => {
                            soundManager.playClick();
                            onOpenTutorial(notion.tutorialId!);
                          }}
                          className="px-3 py-1.5 rounded-lg border border-purple-600 bg-purple-950/40 hover:bg-purple-900/50 text-purple-200 text-xs font-medium transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                        >
                          <IconBook className="w-3.5 h-3.5 text-purple-200" />
                          <span>Revoir l'explication</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Official Reference & Competencies */}
                  <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-2 pt-1 border-t border-slate-900">
                    <span className="text-amber-400 font-mono">Réf : {notion.officialRef}</span>
                    <span>•</span>
                    <span>Compétences : {notion.competences.join(', ')}</span>
                    {mastery && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-400 font-mono">
                          Succès : {mastery.successCount}/{mastery.attemptsCount} ({successRate}%)
                        </span>
                      </>
                    )}
                  </div>

                  {/* Common misconceptions warning */}
                  {notion.commonMisconceptions.length > 0 && (
                    <div className="bg-amber-950/20 border border-amber-800/30 rounded-lg p-2 text-[11px] text-amber-200/90">
                      <span className="font-semibold text-amber-400">Erreur fréquente à surveiller : </span>
                      {notion.commonMisconceptions.join(' | ')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-indigo-900/60 p-4 sm:p-5 shrink-0 bg-slate-950/90 flex items-center justify-end z-10">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
